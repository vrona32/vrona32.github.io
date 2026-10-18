"""Generuje sitemap.xml na podstawie stron głównych oraz projects.json i posts.json.

Uruchom z katalogu repozytorium po dodaniu wpisu lub projektu:
    python scripts/generate_sitemap.py
"""
import json
from datetime import date
from pathlib import Path
from xml.sax.saxutils import escape

DOMAIN = "https://cartogis.pl/"
ROOT = Path(__file__).resolve().parent.parent

# (ścieżka, changefreq, priority)
PAGES = [
    ("", "weekly", "1.0"),
    ("portfolio.html", "weekly", "0.9"),
    ("blog.html", "weekly", "0.9"),
    ("about.html", "monthly", "0.7"),
]


def load(name):
    path = ROOT / "assets" / "data" / name
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else []


def lastmod(rel, fallback=None):
    """Data z JSON-a, a jeśli jej brak — data modyfikacji pliku."""
    if fallback:
        return fallback
    file = ROOT / (rel or "index.html")
    return date.fromtimestamp(file.stat().st_mtime).isoformat() if file.exists() else date.today().isoformat()


def url_entry(rel, freq, prio, mod):
    return (
        "  <url>\n"
        f"    <loc>{escape(DOMAIN + rel)}</loc>\n"
        f"    <lastmod>{mod}</lastmod>\n"
        f"    <changefreq>{freq}</changefreq>\n"
        f"    <priority>{prio}</priority>\n"
        "  </url>"
    )


def main():
    items = load("projects.json") + load("posts.json")
    newest = max((i.get("date", "") for i in items), default="") or None

    entries = []
    for rel, freq, prio in PAGES:
        # strony list (portfolio/blog/start) zmieniają się razem z najnowszym wpisem
        mod = lastmod(rel, newest if rel != "about.html" else None)
        entries.append(url_entry(rel, freq, prio, mod))

    for item in items:
        rel = item.get("url")
        if not rel or rel.startswith("http"):
            continue
        if not (ROOT / rel).exists():
            print(f"UWAGA: brak pliku {rel} — pomijam")
            continue
        entries.append(url_entry(rel, "monthly", "0.6", lastmod(rel, item.get("date"))))

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(entries)
        + "\n</urlset>\n"
    )
    (ROOT / "sitemap.xml").write_text(xml, encoding="utf-8", newline="\n")
    print(f"Zapisano sitemap.xml ({len(entries)} adresów)")


if __name__ == "__main__":
    main()
