"""Find 3-4 verified, embeddable YouTube videos per topic of a paper catalog.

Usage: python scripts/find_videos.py src/catalog/cs.ts
Reads topic names from the catalog file and writes/merges src/catalog/videos.json:
  { "<subject>--<topic-slug>": [ {"id": "...", "title": "...", "channel": "..."} ] }
Every video is checked through YouTube oEmbed (exists + embedding allowed).
"""
import json, re, sys, time, urllib.parse, urllib.request, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "catalog" / "videos.json"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
      "Accept-Language": "en-IN,en;q=0.9"}
TRUSTED = ["gate smashers", "knowledge gate", "neso academy", "abdul bari", "nptel", "jenny", "education 4u",
           "sudhakar atchala", "ravindrababu", "unacademy computer science", "gate wallah", "made easy", "ace academy",
           "techtud", "go classes", "gate cse", "computer science", "chirag", "william fiset", "mit opencourseware",
           "easy engineering classes", "5 minutes engineering", "vidya-mitra", "gate academy", "byju's exam prep",
           "careerwill", "rbr", "gate", "ekeeda", "engineering", "academy", "classes", "tutorial", "lectures", "unacademy", "learn with sumit", "university academy", "edutech learning", "physics wallah"]
MAX_PER_TOPIC, MIN_SEC, MAX_SEC = 4, 120, 3 * 3600


def slug(s):
    s = s.lower().replace("&", "and")
    s = re.sub(r"['’]", "", s)
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def topics_from_catalog(path):
    if str(path).endswith(".json"):
        subs = json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
        return [(tp["id"], tp["name"], s["name"]) for s in subs for m in s["modules"] for tp in m["topics"]]
    src = pathlib.Path(path).read_text(encoding="utf-8")
    out, subject, sname = [], None, None
    for line in src.splitlines():
        m = re.search(r"\bS\('([^']+)',\s*'((?:[^'\\]|\\.)*)'", line)
        if m:
            subject, sname = m.group(1), m.group(2).replace("\\'", "'")
            continue
        for t in re.finditer(r"\bT\('((?:[^'\\]|\\.)*)'", line):
            name = t.group(1).replace("\\'", "'")
            out.append((f"{subject}--{slug(name)}", name, sname))
    return out


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
    data = json.loads(m.group(1))
    res = []

    def walk(o):
        if isinstance(o, dict):
            if "videoRenderer" in o:
                v = o["videoRenderer"]
                try:
                    res.append({"id": v["videoId"],
                                "title": "".join(r["text"] for r in v["title"]["runs"]),
                                "channel": v["ownerText"]["runs"][0]["text"],
                                "len": v.get("lengthText", {}).get("simpleText", "0:00")})
                except (KeyError, IndexError):
                    pass
            for x in o.values():
                walk(x)
        elif isinstance(o, list):
            for x in o:
                walk(x)
    walk(data)
    return res


def embeddable(vid):
    try:
        d = json.loads(get(f"https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v={vid}"))
        return d.get("title"), d.get("author_name")
    except Exception:
        return None


def pick(name, subject, paper):
    seen, picks = set(), []
    for q in (f"{name} {subject} GATE {paper}", f"{name} GATE {paper} lecture"):
        for v in search(q):
            if v["id"] in seen:
                continue
            seen.add(v["id"])
            try:
                ln = secs(v["len"])
            except ValueError:
                continue
            ch = v["channel"].lower()
            if not (MIN_SEC <= ln <= MAX_SEC) or not any(t in ch for t in TRUSTED):
                continue
            ok = embeddable(v["id"])
            if ok:
                picks.append({"id": v["id"], "title": ok[0], "channel": ok[1]})
            if len(picks) >= MAX_PER_TOPIC:
                return picks
        time.sleep(0.8)
    return picks


def main():
    global PAPER
    cat = sys.argv[1] if len(sys.argv) > 1 else str(ROOT / "src/catalog/cs.ts")
    PAPER = {"cs": "CSE"}.get(pathlib.Path(cat).stem, pathlib.Path(cat).stem.upper())
    data = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {}
    topics = topics_from_catalog(cat)
    for i, (tid, name, subject) in enumerate(topics, 1):
        if len(data.get(tid, [])) >= 3:
            continue
        try:
            data[tid] = pick(name, subject, PAPER)
        except Exception as e:
            print("  error", e)
        print(f"{i}/{len(topics)} {len(data.get(tid, []))} videos  {name}", flush=True)
        OUT.write_text(json.dumps(data, indent=1, ensure_ascii=False), encoding="utf-8")
    weak = [t for t, _, _ in topics if len(data.get(t, [])) < 3]
    print("done. topics with fewer than 3 videos:", len(weak))


if __name__ == "__main__":
    main()
