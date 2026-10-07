"""Build A-Z sheets for every GATE 2027 paper from the OFFICIAL syllabus PDFs (IIT Madras).

Usage: python scripts/build_syllabus.py            # all papers
       python scripts/build_syllabus.py CS EC      # some papers
Writes src/catalog/generated/<code>.json  (list of subjects -> modules -> topics).
Each topic is an item exactly as listed in the official syllabus.
"""
import json, pathlib, re, sys, urllib.request

import pypdf

ROOT = pathlib.Path(__file__).resolve().parent.parent
PDF_DIR = ROOT / "scripts" / "syllabus"
OUT = ROOT / "src" / "catalog" / "generated"
URL = "https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/{}_GATE2027_Syllabus.pdf"
PAPERS = ["CS", "DA", "EC", "EE", "ME", "CE", "IN", "CH", "PI", "BT", "AE", "AG", "BM", "ES", "GE", "MN", "MT",
          "NM", "PE", "TF", "XE", "AR", "CY", "EY", "GG", "MA", "PH", "ST", "XL", "XH", "GA"]

EASY = re.compile(r"\b(basic|introduction|definition|units?|classification|properties of|number system|terminology|overview|types of)\b", re.I)
HARD = re.compile(r"\b(undecidab|transform|stability|nyquist|root locus|eigen|partial differential|tensor|quantum|"
                  r"singular value|bayesian|inference|optimi[sz]ation|turing|pushdown|nonlinear|state.space|fourier|laplace|z-transform|"
                  r"finite element|variational|consolidation|indetermina|matrix method|plastic|fatigue|vibration|kinetics|thermodynamic)", re.I)


def slug(s):
    s = s.lower().replace("&", "and")
    s = re.sub(r"['’]", "", s)
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:60]


def fetch(code):
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    f = PDF_DIR / f"{code}.pdf"
    if not f.exists() or f.stat().st_size < 5000:
        req = urllib.request.Request(URL.format(code), headers={"User-Agent": "Mozilla/5.0"})
        f.write_bytes(urllib.request.urlopen(req, timeout=60).read())
    return "\n".join(p.extract_text() or "" for p in pypdf.PdfReader(str(f)).pages)


def clean(text):
    text = re.sub(r"GATE 2027 IIT Madras\s*\|\s*Organizing Institute", "\n", text)
    text = text.replace("‐", "-").replace("–", "-").replace(" ", " ")
    text = re.sub(r"(\w)-\s*\n\s*(\w)", r"\1\2", text)  # hyphenated line breaks
    return text


HEAD = re.compile(r"^\s*((?:Section|Part)\s+[A-Z0-9][\w.-]*\s*[:.]\s*.+|[A-Z]{2}-[A-Z]\d?\s*[:.]\s*.+|Sections?\s+\d+\s*[:.].+)$", re.M)


def diff_of(name):
    if HARD.search(name):
        return "H"
    if EASY.search(name) or len(name) < 18:
        return "E"
    return "M"


def split_items(body):
    body = re.sub(r"\s+", " ", body).strip()
    parts = re.split(r"(?<=[a-z0-9\)])\.\s+|;\s*", body)
    items = []
    for p in parts:
        p = p.strip(" .;:")
        if not p:
            continue
        # break long comma lists into separate topics, keep short phrases together
        chunks = [c.strip(" .") for c in re.split(r",\s*(?![^()]*\))", p)] if len(p) > 70 else [p]
        for c in chunks:
            c = re.sub(r"^(and|or)\s+", "", c, flags=re.I).strip()
            if len(c) >= 3:
                items.append(c[0].upper() + c[1:])
    seen, out = set(), []
    for i in items:
        k = i.lower()
        if k not in seen:
            seen.add(k)
            out.append(i)
    return out


def modules_of(body):
    """Split a section body into labelled modules ('Label: text') or one module."""
    body = body.strip()
    labels = list(re.finditer(r"(?:^|\n|(?<=\.)\s)([A-Z][A-Za-z ,&/()'-]{2,60}):\s", body))
    mods = []
    if labels:
        pre = body[:labels[0].start()].strip()
        if len(pre) > 15:
            mods.append(("Overview", pre))
        for i, m in enumerate(labels):
            end = labels[i + 1].start() if i + 1 < len(labels) else len(body)
            mods.append((m.group(1).strip(), body[m.end():end]))
    else:
        mods.append((None, body))
    return mods


def build(code):
    text = clean(fetch(code))
    heads = list(HEAD.finditer(text))
    subjects = []
    if not heads:
        heads_spans = [("General", text)]
    else:
        heads_spans = []
        for i, h in enumerate(heads):
            end = heads[i + 1].start() if i + 1 < len(heads) else len(text)
            heads_spans.append((h.group(1), text[h.end():end]))
    for title, body in heads_spans:
        name = re.sub(r"^(Section|Part)\s+[A-Z0-9][\w.-]*\s*[:.]\s*", "", title).strip()
        name = re.sub(r"^[A-Z]{2}-[A-Z]\d?\s*[:.]\s*", "", name).strip(" .")
        sid = f"{code.lower()}-{slug(name)[:30]}"
        mods = []
        for li, (label, mbody) in enumerate(modules_of(body)):
            topics = [{"id": f"{sid}--{slug(t)}", "name": t, "diff": diff_of(t)} for t in split_items(mbody)]
            if topics:
                mods.append({"letter": chr(65 + len(mods)), "name": label or name, "topics": topics})
        if mods:
            mods[0]["topics"][0]["sample"] = True
            subjects.append({"id": sid, "name": name, "marks": "", "focus": "", "modules": mods})
    return subjects


COMPOSITE = {"XE": [f"XE{i}" for i in range(1, 9)], "XL": [f"XL{i}" for i in range(1, 6)], "XH": [f"XH{i}" for i in range(1, 7)]}


def build_any(code):
    if code not in COMPOSITE:
        return build(code)
    subs = []
    for part in COMPOSITE[code]:
        subs.extend(build(part))
    return subs


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    codes = [c.upper() for c in sys.argv[1:]] or PAPERS
    for code in codes:
        try:
            subs = build_any(code)
        except Exception as e:  # missing PDF etc.
            print(f"{code}: FAILED {e}")
            continue
        n = sum(len(m["topics"]) for s in subs for m in s["modules"])
        (OUT / f"{code.lower()}.json").write_text(json.dumps(subs, indent=1, ensure_ascii=False), encoding="utf-8")
        print(f"{code}: {len(subs)} subjects, {n} topics")


if __name__ == "__main__":
    main()
