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
│   ├── przyklad-mapa-interaktywna.html   (mapa Leaflet)
│   └── przyklad-mapa-statyczna.html      (mapa jako obraz)
├── blog/                 → strony pojedynczych wpisów
│   └── przyklad-wpis.html
└── assets/
    ├── css/style.css     → wszystkie style (motyw jasny/ciemny)
    ├── js/main.js        → nawigacja, motyw, renderowanie kart, dane witryny (obiekt SITE)
    ├── data/
    │   ├── projects.json → LISTA PROJEKTÓW  ← tu dodajesz projekty
    │   └── posts.json    → LISTA WPISÓW      ← tu dodajesz wpisy
    └── img/              → obrazy, placeholdery, favicon.png
```

Zbudowano jako czysty HTML/CSS/JS — bez zależności i procesu budowania.
