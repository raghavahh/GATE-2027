"""Human/AI review of picked videos.

  python scripts/review_videos.py export <videos.json> <paper> <out.txt>
      Writes a compact list per topic: "## <topic id> | <topic name> | <module>" then "<n>. <title> — <channel>".
  python scripts/review_videos.py apply <videos.json> <drop.json>
      drop.json = {"<topic id>": [n, ...]} (1-based numbers from the export). Removes them from videos.json,
      adds them to scripts/video_blocklist.json (so find_videos.py never re-picks them for that topic)
      and prints the topics left with fewer than 3 videos (re-run find_videos.py --topics on those).
"""
import json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
BL = ROOT / "scripts" / "video_blocklist.json"
cmd, vpath = sys.argv[1], pathlib.Path(sys.argv[2])
videos = json.loads(vpath.read_text(encoding="utf-8"))

if cmd == "export":
    paper, out = sys.argv[3], pathlib.Path(sys.argv[4])
    subjects = json.loads((ROOT / "src/catalog/generated" / f"{paper}.json").read_text(encoding="utf-8"))
    lines = []
    for s in subjects:
        for m in s["modules"]:
            for t in m["topics"]:
                lines.append(f"## {t['id']} | {t['name']} | {s['name']} › {m['name']}")
                lines += [f"{i}. {v['title']} — {v['channel']}" for i, v in enumerate(videos.get(t["id"], []), 1)]
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(len(lines), "lines")
elif cmd == "apply":
    drop = json.loads(pathlib.Path(sys.argv[3]).read_text(encoding="utf-8"))
    blocked = json.loads(BL.read_text(encoding="utf-8")) if BL.exists() else {}
    weak = []
    for tid, nums in drop.items():
        vids = videos.get(tid, [])
        gone = {n - 1 for n in nums if 1 <= n <= len(vids)}
        blocked.setdefault(tid, [])
        blocked[tid] = sorted(set(blocked[tid]) | {vids[i]["id"] for i in gone})
        videos[tid] = [v for i, v in enumerate(vids) if i not in gone]
        if len(videos[tid]) < 3:
            weak.append(tid)
    vpath.write_text(json.dumps(videos, indent=1, ensure_ascii=False), encoding="utf-8")
    BL.write_text(json.dumps(blocked, indent=1), encoding="utf-8")
    print("\n".join(weak))
