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


def topic_ids(subjects):
    return [t["id"] for s in subjects for m in s["modules"] for t in m["topics"]]


summary = {}
for f in sorted(GEN.glob("*.json")):
    if f.stem == "ga":
        continue
    own = json.loads(f.read_text(encoding="utf-8"))
    subs = ga + own
    ids = topic_ids(subs)
    vids = {i: videos[i] for i in ids if videos.get(i)}
    (VID_OUT / f"{f.stem}.json").write_text(json.dumps(vids, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    summary[f.stem] = {"subjects": len(subs), "topics": len(ids), "videos": sum(len(v) for v in vids.values())}

(CAT / "summary.json").write_text(json.dumps(summary, indent=1), encoding="utf-8")
print({k: v["videos"] for k, v in summary.items()})
