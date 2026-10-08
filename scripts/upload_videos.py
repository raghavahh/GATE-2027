"""Upload paid content into Supabase: video lists (topic_videos) and topic notes (topic_notes).

Run yourself (the service key is secret — never commit it or share it):
  PowerShell:  $env:SUPABASE_SERVICE_ROLE_KEY="..." ; python scripts/upload_videos.py
Reads src/catalog/generated/*.json, src/catalog/videos.json and content/notes/<paper>.json (both kept out of git).
"""
import json, os, pathlib, sys, urllib.error, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = "https://ddrnwwbtlyayvgoloion.supabase.co/rest/v1/"
KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
if not KEY:
    sys.exit("Set SUPABASE_SERVICE_ROLE_KEY first (Supabase → Settings → API Keys → secret key).")

headers = {"apikey": KEY, "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates"}
if KEY.startswith("eyJ"):  # legacy JWT service_role key; new sb_secret_ keys go only in "apikey"
    headers["Authorization"] = f"Bearer {KEY}"


def upload(table, conflict, rows):
    for i in range(0, len(rows), 500):
        req = urllib.request.Request(f"{BASE}{table}?on_conflict={conflict}", data=json.dumps(rows[i:i + 500]).encode(), method="POST", headers=headers)
        try:
            urllib.request.urlopen(req, timeout=60).read()
        except urllib.error.HTTPError as e:
            sys.exit(f"{table} upload failed ({e.code}): {e.read().decode()[:400]}")
        print(f"{table}: {min(i + 500, len(rows))}/{len(rows)}")


videos = json.loads((ROOT / "src/catalog/videos.json").read_text(encoding="utf-8"))
gen = ROOT / "src/catalog/generated"
ga = json.loads((gen / "ga.json").read_text(encoding="utf-8"))
rows, samples = [], set()
for f in sorted(gen.glob("*.json")):
    for s in json.loads(f.read_text(encoding="utf-8")):
        samples |= {t["id"] for m in s["modules"] for t in m["topics"] if t.get("sample")}
    if f.stem == "ga":
        continue
    for s in ga + json.loads(f.read_text(encoding="utf-8")):
        for m in s["modules"]:
            for t in m["topics"]:
                if videos.get(t["id"]):
                    rows.append({"paper": f.stem, "topic_id": t["id"], "videos": videos[t["id"]]})
# one row per (paper, topic) — the official PDFs repeat a few topic names
upload("topic_videos", "paper,topic_id", list({(r["paper"], r["topic_id"]): r for r in rows}.values()))

notes = {}
for f in sorted((ROOT / "content/notes").glob("*.json")):
    notes.update(json.loads(f.read_text(encoding="utf-8")))
if notes:
    upload("topic_notes", "topic_id", [{"topic_id": k, "sample": k in samples, "notes": v} for k, v in notes.items()])
print("done")
