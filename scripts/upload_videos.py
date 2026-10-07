"""Upload paid video lists into Supabase table topic_videos (the real lock).

Run yourself (the service key is secret — never commit it or share it):
  PowerShell:  $env:SUPABASE_SERVICE_ROLE_KEY="..." ; python scripts/upload_videos.py
Reads src/catalog/generated/*.json + src/catalog/videos.json.
"""
import json, os, pathlib, sys, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = "https://ddrnwwbtlyayvgoloion.supabase.co/rest/v1/topic_videos"
KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
if not KEY:
    sys.exit("Set SUPABASE_SERVICE_ROLE_KEY first (Supabase → Settings → API Keys → secret key).")

videos = json.loads((ROOT / "src/catalog/videos.json").read_text(encoding="utf-8"))
gen = ROOT / "src/catalog/generated"
ga = json.loads((gen / "ga.json").read_text(encoding="utf-8"))
rows = []
for f in sorted(gen.glob("*.json")):
    if f.stem == "ga":
        continue
    for s in ga + json.loads(f.read_text(encoding="utf-8")):
        for m in s["modules"]:
            for t in m["topics"]:
                if videos.get(t["id"]):
                    rows.append({"paper": f.stem, "topic_id": t["id"], "videos": videos[t["id"]]})

for i in range(0, len(rows), 500):
    req = urllib.request.Request(URL, data=json.dumps(rows[i:i + 500]).encode(), method="POST", headers={
        "apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"})
    urllib.request.urlopen(req, timeout=60).read()
    print(f"uploaded {min(i + 500, len(rows))}/{len(rows)}")
