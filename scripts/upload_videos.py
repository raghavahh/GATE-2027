"""Upload paid video lists into Supabase table topic_videos (the real lock).

Run yourself (the service key is secret — never commit it or share it):
  PowerShell:  $env:SUPABASE_SERVICE_ROLE_KEY="..." ; python scripts/upload_videos.py
Reads src/catalog/generated/*.json + src/catalog/videos.json.
"""
import json, os, pathlib, sys, urllib.error, urllib.request

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

# one row per (paper, topic) — the official PDFs repeat a few topic names
rows = list({(r["paper"], r["topic_id"]): r for r in rows}.values())

headers = {"apikey": KEY, "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates"}
if KEY.startswith("eyJ"):  # legacy JWT service_role key; new sb_secret_ keys go only in "apikey"
    headers["Authorization"] = f"Bearer {KEY}"

for i in range(0, len(rows), 500):
    req = urllib.request.Request(URL + "?on_conflict=paper,topic_id", data=json.dumps(rows[i:i + 500]).encode(), method="POST", headers=headers)
    try:
        urllib.request.urlopen(req, timeout=60).read()
    except urllib.error.HTTPError as e:
        sys.exit(f"Upload failed ({e.code}): {e.read().decode()[:400]}")
    print(f"uploaded {min(i + 500, len(rows))}/{len(rows)}")
print("done")
