# CartoGIS — portfolio i blog kartograficzny

Statyczna strona (czysty HTML/CSS/JS) do prezentacji map i analiz przestrzennych.
Bez żadnego procesu budowania — działa od razu na **GitHub Pages**.

## 📁 Struktura strony

```
├── index.html            → strona główna (hero + wyróżnione projekty i wpisy)
├── portfolio.html        → galeria projektów z filtrami
├── blog.html             → lista wpisów
├── about.html            → o mnie
├── CNAME                 → własna domena (cartogis.pl)
├── projects/             → strony pojedynczych projektów
├── blog/                 → strony pojedynczych wpisów
└── assets/
    ├── css/style.css     → wszystkie style (motyw jasny/ciemny)
    ├── js/main.js        → nawigacja, motyw, renderowanie kart, dane witryny (obiekt SITE)
    ├── data/
    │   ├── projects.json → LISTA PROJEKTÓW  ← tu dodajesz projekty
    │   └── posts.json    → LISTA WPISÓW      ← tu dodajesz wpisy
    └── img/              → obrazy, placeholdery, favicon.png
```

Zbudowano jako czysty HTML/CSS/JS — bez zależności i procesu budowania.

## 🖥️ Podgląd lokalny

Karty projektów i wpisów są wczytywane przez `fetch()`, który nie działa po otwarciu
pliku bezpośrednio (`file://`). Uruchom prosty serwer w katalogu repozytorium:

```bash
python -m http.server 8000
```

i otwórz <http://localhost:8000>.

## 🗺️ Sitemap

Po dodaniu wpisu lub projektu (plik HTML + wpis w JSON) wygeneruj `sitemap.xml` od nowa:

```bash
python scripts/generate_sitemap.py
```
