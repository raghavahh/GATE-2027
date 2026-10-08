"""Install rebuilt topic lists and carry videos + student progress over to the new topic ids.

Usage: python scripts/apply_syllabus.py <folder with <paper>.json and <paper>.idmap.json> ga cs da ...
  * copies each <paper>.json into src/catalog/generated/
  * videos.json: an old topic's videos are copied to every new id it maps to (re-pick afterwards to clean up)
  * src/catalog/idmap.json: old id -> new id(s), only for ids that changed; the site uses it to move saved progress
"""
import json, pathlib, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CAT = ROOT / "src" / "catalog"
src, papers = pathlib.Path(sys.argv[1]), sys.argv[2:]

videos = json.loads((CAT / "videos.json").read_text(encoding="utf-8"))
idmap_path = CAT / "idmap.json"
idmap = json.loads(idmap_path.read_text(encoding="utf-8")) if idmap_path.exists() else {}

for p in papers:
    subjects = json.loads((src / f"{p}.json").read_text(encoding="utf-8"))
    mapping = json.loads((src / f"{p}.idmap.json").read_text(encoding="utf-8"))
    new_ids = {t["id"] for s in subjects for m in s["modules"] for t in m["topics"]}
    for old, new in mapping.items():
        targets = [] if new is None else new if isinstance(new, list) else [new]
        assert all(t in new_ids for t in targets), (p, old, targets)
        for t in targets:
            if t != old and not videos.get(t) and videos.get(old):
                videos[t] = list(videos[old])
        if targets != [old]:
            idmap[old] = targets[0] if len(targets) == 1 else targets
    shutil.copyfile(src / f"{p}.json", CAT / "generated" / f"{p}.json")
    print(f"{p}: {len(new_ids)} topics, {sum(1 for o, n in mapping.items() if n != o)} ids changed")

(CAT / "videos.json").write_text(json.dumps(videos, indent=1, ensure_ascii=False), encoding="utf-8")
idmap_path.write_text(json.dumps(idmap, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print("idmap entries:", len(idmap))
