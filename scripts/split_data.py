"""Split catalog data per paper so the site only downloads the paper you open.

Run after build_syllabus.py / find_videos.py:  python scripts/split_data.py
Writes src/catalog/videos/<paper>.json and src/catalog/summary.json.
"""
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
CAT = ROOT / "src" / "catalog"
GEN = CAT / "generated"
VID_OUT = CAT / "videos"
VID_OUT.mkdir(exist_ok=True)

videos = json.loads((CAT / "videos.json").read_text(encoding="utf-8"))
ga = json.loads((GEN / "ga.json").read_text(encoding="utf-8"))
# Only papers on sale show their own videos; the rest show just General Aptitude until their lists are verified.
SELLABLE = set(json.loads((CAT / "sellable.json").read_text(encoding="utf-8")))


def topic_ids(subjects):
    return [t["id"] for s in subjects for m in s["modules"] for t in m["topics"]]


def sample_ids(subjects):
    return {t["id"] for s in subjects for m in s["modules"] for t in m["topics"] if t.get("sample")}


summary = {}
for f in sorted(GEN.glob("*.json")):
    if f.stem == "ga":
        continue
    own = json.loads(f.read_text(encoding="utf-8"))
    subs = ga + own
    ids = topic_ids(subs)
    shown = set(ids) if f.stem in SELLABLE else set(topic_ids(ga))
    vids = {i: videos[i] for i in ids if videos.get(i) and i in shown}
    samples = sample_ids(subs)
    public = {i: (v if i in samples else len(v)) for i, v in vids.items()}  # paid lists live in the DB
    (VID_OUT / f"{f.stem}.json").write_text(json.dumps(public, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    summary[f.stem] = {"subjects": len(subs), "topics": len(ids), "videos": sum(len(v) for v in vids.values())}

(CAT / "summary.json").write_text(json.dumps(summary, indent=1), encoding="utf-8")
print({k: v["videos"] for k, v in summary.items()})
