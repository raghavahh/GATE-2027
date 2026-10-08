"""Pick 3-5 relevant, embeddable YouTube lectures per topic of a paper sheet.

Usage:
  python scripts/find_videos.py src/catalog/generated/cs.json            # topics with < 3 videos
  python scripts/find_videos.py src/catalog/generated/cs.json --force    # re-pick every topic
  python scripts/find_videos.py src/catalog/generated/cs.json --force --topics ids.txt

Writes/merges src/catalog/videos.json: { "<topic id>": [ {"id", "title", "channel"} ] }
Topics that end with fewer than 3 good videos are listed in scripts/needs_manual.txt (never padded with junk).

How a video is chosen:
  * searched with the topic's alias (`q`) or name plus its module and subject;
  * title must contain the topic's keywords; strategy/news/off-exam titles and weak channels are rejected;
  * the same video is used in at most 2 topics of a paper;
  * reputable GATE channels rank higher; ordered intro/part 1 first, PYQ/one-shot/revision last;
  * every pick is checked through YouTube oEmbed (exists and embedding allowed).
"""
import json, math, os, pathlib, re, sys, time, urllib.parse, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
# VIDEOS_OUT lets several papers run in parallel into separate files (merged afterwards).
OUT = pathlib.Path(os.environ.get("VIDEOS_OUT", ROOT / "src" / "catalog" / "videos.json"))
MANUAL = ROOT / "scripts" / "needs_manual.txt"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
      "Accept-Language": "en-IN,en;q=0.9"}
MIN_PICK, MAX_PICK, MIN_SEC, MAX_SEC, MAX_REUSE = 3, 5, 300, 4 * 3600, 2

# Exact (lower-case) channel names known for clear GATE teaching.
GOOD = {
    "gate smashers", "go classes", "go classes for gate cs", "go classes for gate da", "neso academy",
    "knowledgegate by sanchit sir", "knowledge gate", "abdul bari", "ravindrababu ravula", "nptel",
    "nptel-noc iitm", "mit opencourseware", "gate wallah", "gate wallah - ec, ee & cs", "gate wallah cse & da",
    "gate wallah - ece, ee & in", "gate wallah - me & ce", "gate wallah me", "made easy", "made easy gate",
    "ace engineering academy", "gate academy", "gate academy global", "kreatryx", "unacademy gate - ec, ee, in",
    "unacademy gate - me, pi, xe", "unacademy gate me", "unacademy computer science", "exergic",
    "let's crack gate & ese - me", "lectures in electrical engineering", "dr. gajendra purohit",
    "geeksforgeeks gate english", "byju's exam prep gate & ese", "byju's exam prep gate & ese: ee,ec,in,cs",
    "engineering funda", "ekeeda", "sudhakar atchala", "jenny's lectures cs it", "education 4u",
    "christy's classes", "techtud", "william fiset", "khan academy", "3blue1brown",
}
BAD_CHANNEL = re.compile(r"telugu|tamil|kannada|malayalam|neet|ssc|sri chaitanya|commerce|rs academy|pradeep giri|"
                         r"rama reddy|s\.a\. engineering|satish bojjawar|gate insights|solutions adda|engineering mindset|"
                         r"sabin civil|jan's english|devika|kasim|nerchuko|advaitha", re.I)
BAD_TITLE = re.compile(
    r"strategy|roadmap|weightage|important topics|syllabus|marks vs rank|rank vs marks|form fill|best books|"
    r"paper analysis|paper solution|question paper|subject (sequence|order)|how to (score|study|prepare|master|crack)|"
    r"demo class|course overview|official update|notification|result|cut ?off|admit card|telugu|tamil|"
    r"jntu|\bb\.?tech\b|\bm[123]\b|aktu|vtu|diploma|polytechnic|neet|ssc[- ]?je|constable|class 1[12]|"
    r"don'?t subscribe|#shorts|motivation|topper|interview|counselling|psu|stop studying|is easy\b", re.I)
PYQ_TITLE = re.compile(r"\bpyqs?\b|previous year|gate (19|20)\d\d\b|one[- ]?shot|revision|marathon|practice|problems?\b|"
                       r"questions?\b|solution", re.I)
INTRO_TITLE = re.compile(r"intro|introduction|basics?|fundamental|overview of|part[- ]?0?1\b|lec(ture)?[- ]?0?1\b|\bl-?0?1\b", re.I)
OLD_PYQ = re.compile(r"gate (19\d\d|200\d|201[0-5])\b", re.I)
# Titles in Indic scripts are regional-language lectures; the site serves English/Hinglish GATE teaching.
NON_LATIN = re.compile(r"[ऀ-෿]")
# Aimed at other exams; fine only if the title also says GATE.
OTHER_EXAM = re.compile(r"\bssc\b|\bbank|\bibps|\bsbi\b|\bcuet\b|\bcat\b|afcat|tcs nqt|upsc|\bcds\b|\bcpo\b|chsl|\bcgl\b|"
                        r"railway|\brrb\b|class \d+(th)?\b|cbse|quiz|challenge|test your", re.I)
# Words that make a search land on the wrong thing for these topics.
HOMONYM = {
    "uniform": r"cost search|continuity|circular|convergence", "mean": r"value theorem", "rank": r"\bmarks?\b|\bair\b|score", "bernoulli": r"equation|pump",
    "powers": r"power system|power electronics", "bends": r"bending", "limitations": r"limits,? fits", "top-down": r"pars|dynamic",
    "nearest": r"k-?map", "normal": r"normal form|normali[sz]ation|strategy", "line": r"transmission line",
    "series": r"series compensation|differential", "phase": r"phase (diagram|transition)", "equations": r"maxwell",
}
STOP = set("a an the and or of in on for to with by its their using via from as at is are be into vs".split())
# Videos a reviewer rejected for a topic (scripts/review_videos.py apply): never picked again for it.
_BL = ROOT / "scripts" / "video_blocklist.json"
BLOCKED = {k: set(v) for k, v in json.loads(_BL.read_text(encoding="utf-8")).items()} if _BL.exists() else {}
# Too generic to prove a title is about the topic.
GENERIC = set("principle concept basic introduction method methods theory analysis application applications "
              "gate lecture engineering topic types type properties property problem problems design".split())

PAPER_NAME = {"cs": "CSE", "da": "DA data science", "ec": "ECE", "ee": "EE electrical", "me": "mechanical", "ga": "general aptitude"}


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20) as r:
        return r.read().decode("utf-8", "ignore")


def secs(txt):
    n = 0
    for part in txt.split(":"):
        n = n * 60 + int(part)
    return n


def search(q):
    html = get("https://www.youtube.com/results?search_query=" + urllib.parse.quote_plus(q))
    m = re.search(r"var ytInitialData = (\{.*?\});</script>", html)
    if not m:
        return []
    res = []

    def walk(o):
        if isinstance(o, dict):
            if "videoRenderer" in o:
                v = o["videoRenderer"]
                try:
                    views = re.sub(r"\D", "", v.get("viewCountText", {}).get("simpleText", "0")) or "0"
                    res.append({"id": v["videoId"], "title": "".join(r["text"] for r in v["title"]["runs"]),
                                "channel": v["ownerText"]["runs"][0]["text"],
                                "len": v.get("lengthText", {}).get("simpleText", "0:00"), "views": int(views)})
                except (KeyError, IndexError):
                    pass
            for x in o.values():
                walk(x)
        elif isinstance(o, list):
            for x in o:
                walk(x)
    walk(json.loads(m.group(1)))
    return res


def embeddable(vid):
    try:
        d = json.loads(get(f"https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v={vid}"))
        return d.get("title"), d.get("author_name")
    except Exception:
        return None


def words(s):
    s = s.lower().replace("’", "'")
    return [w.rstrip("s") if len(w) > 4 else w for w in re.findall(r"[a-z0-9][a-z0-9'+-]*", s) if w not in STOP]


def relevance(title, keys):
    """Share of the topic's keywords that appear in the title (prefix match tolerates plurals/word forms)."""
    tw = words(title)
    hit = sum(1 for k in keys if any(w.startswith(k[:6]) or k.startswith(w[:6]) for w in tw if len(w) > 2))
    return hit / max(1, len(keys))


def homonym_clash(name, title):
    n = name.lower()
    return any(k in n and re.search(bad, title, re.I) and not re.search(bad, n, re.I) for k, bad in HOMONYM.items())


def order_key(v):
    t = v["title"]
    if PYQ_TITLE.search(t):
        return (2, 0)
    m = re.search(r"(?:part|lec(?:ture)?|l|session|class)[- #]?0*(\d{1,3})\b", t, re.I)
    if INTRO_TITLE.search(t):
        return (0, int(m.group(1)) if m else 0)
    return (1, int(m.group(1)) if m else 50)


def pick(topic, module, subject, paper, used, prior):
    label = topic.get("q") or topic["name"]
    keys = [w for w in words(label) if len(w) > 2 and w not in GENERIC][:6] or words(label)
    queries = [f"{label} {module} GATE {PAPER_NAME.get(paper, paper)} lecture", f"{label} {subject} GATE lecture", f"{label} lecture"]
    cands, seen = [], set()
    for v in prior:  # previous picks compete again, but must pass the same checks
        cands.append({**v, "len": "10:00", "views": 0})
    for q in queries:
        try:
            cands += search(q)
        except Exception as e:
            print("   search error", e)
        time.sleep(0.7)
    scored = []
    for v in cands:
        if v["id"] in seen:
            continue
        seen.add(v["id"])
        try:
            ln = secs(v["len"])
        except ValueError:
            continue
        t, ch = v["title"], v["channel"]
        if not (MIN_SEC <= ln <= MAX_SEC) or BAD_TITLE.search(t) or BAD_CHANNEL.search(ch) or OLD_PYQ.search(t) or NON_LATIN.search(t):
            continue
        if homonym_clash(topic["name"], t) or used.get(v["id"], 0) >= MAX_REUSE or v["id"] in BLOCKED.get(topic["id"], ()):
            continue
        rel = relevance(t, keys)
        if rel < (0.5 if len(keys) > 1 else 1):
            continue
        gate = bool(re.search(r"\bgate\b", t + " " + ch, re.I))
        score = (rel * 3 + (2.5 if ch.lower() in GOOD else 0) + (1.5 if gate else 0) + min(1.5, math.log10(v["views"] + 1) / 4)
                 - (1 if PYQ_TITLE.search(t) else 0) - (2.5 if OTHER_EXAM.search(t) and not gate else 0))
        scored.append((score, v))
    scored.sort(key=lambda x: -x[0])
    picks, pyqs = [], 0
    for _, v in scored:
        is_pyq = bool(PYQ_TITLE.search(v["title"]))
        if is_pyq and pyqs >= 1:
            continue
        # skip a second copy of the same lecture from another batch year on the same channel
        stem = re.sub(r"\b20\d\d\b|batch|\d+", "", v["title"].lower())[:40]
        if any(p["channel"] == v["channel"] and re.sub(r"\b20\d\d\b|batch|\d+", "", p["title"].lower())[:40] == stem for p in picks):
            continue
        ok = embeddable(v["id"])
        # Search results can show auto-translated titles; check the real title (from oEmbed) as well.
        if not ok or BAD_TITLE.search(ok[0]) or NON_LATIN.search(ok[0]) or BAD_CHANNEL.search(ok[1] or ""):
            continue
        picks.append({"id": v["id"], "title": ok[0], "channel": ok[1]})
        pyqs += is_pyq
        if len(picks) >= MAX_PICK:
            break
    picks.sort(key=order_key)
    return picks


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    cat = pathlib.Path(args[0])
    paper = cat.stem
    force = "--force" in args
    only = None
    if "--topics" in args:
        only = set(pathlib.Path(args[args.index("--topics") + 1]).read_text(encoding="utf-8").split())
    data = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {}
    subjects = json.loads(cat.read_text(encoding="utf-8"))
    rows = [(t, m["name"], s["name"]) for s in subjects for m in s["modules"] for t in m["topics"]]
    used = {}
    for t, _, _ in rows:
        for v in data.get(t["id"], []):
            used[v["id"]] = used.get(v["id"], 0) + 1
    weak = []
    for i, (t, module, subject) in enumerate(rows, 1):
        tid = t["id"]
        if only is not None and tid not in only:
            continue
        if not force and len(data.get(tid, [])) >= MIN_PICK:
            continue
        prior = data.get(tid, [])
        for v in prior:
            used[v["id"]] = max(0, used.get(v["id"], 1) - 1)
        try:
            picks = pick(t, module, subject, paper, used, prior)
        except Exception as e:
            print("  error", e)
            picks = prior
        for v in picks:
            used[v["id"]] = used.get(v["id"], 0) + 1
        data[tid] = picks
        if len(picks) < MIN_PICK:
            weak.append(tid)
        print(f"{i}/{len(rows)} {len(picks)} videos  {t['name']}", flush=True)
        OUT.write_text(json.dumps(data, indent=1, ensure_ascii=False), encoding="utf-8")
    if weak:
        with MANUAL.open("a", encoding="utf-8") as f:
            f.write("".join(f"{paper}\t{w}\n" for w in weak))
    print(f"done. {len(weak)} topics with fewer than {MIN_PICK} good videos (see {MANUAL.name})")


if __name__ == "__main__":
    main()
