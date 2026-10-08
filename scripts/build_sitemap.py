"""Write public/sitemap.xml: every public page, paper sheet and topic page (run after the syllabus changes)."""
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://gate-az.pages.dev"
GEN = ROOT / "src" / "catalog" / "generated"

urls = ["/", "/papers", "/pyq", "/guide", "/terms", "/privacy", "/refund", "/delivery", "/contact"]
ga = json.loads((GEN / "ga.json").read_text(encoding="utf-8"))
for f in sorted(GEN.glob("*.json")):
    if f.stem == "ga":
        continue
    subjects = json.loads(f.read_text(encoding="utf-8"))
    if not subjects:
        continue
    urls.append(f"/{f.stem}")
    urls += [f"/{f.stem}/{t['id']}" for s in subjects + ga for m in s["modules"] for t in m["topics"]]

body = "".join(f"<url><loc>{SITE}{u}</loc></url>\n" for u in dict.fromkeys(urls))
(ROOT / "public" / "sitemap.xml").write_text(
    f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{body}</urlset>\n', encoding="utf-8")
print(len(urls), "urls")
