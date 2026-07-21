# Walt Solar Energies , Static Website

Modern, responsive marketing site for **Walt Solar Energies** (authorized vendor for Waree, Adani & Alpex). Built with plain HTML + Tailwind (CDN) + Swiper + GSAP + Lucide. No build step required.

## Run locally
Use the bundled dev server (adds HTTP Range streaming for videos and silences the benign client-disconnect tracebacks):

```bash
python serve.py            # http://127.0.0.1:5173
```

Any static server also works (e.g. `npx serve .`). Note that plain `python -m http.server` prints harmless `ConnectionResetError` tracebacks for video requests because it lacks Range support.

Then open http://127.0.0.1:5173

> Open via a server (not `file://`) so `data/pricing.json` loads over HTTP.

## Structure
```
walt-solar-energies/
├── index.html          # all sections
├── css/styles.css      # custom styles (glass, glow, floating cards)
├── js/main.js          # nav, carousel, catalog, modal, forms, animations
├── data/pricing.json   # single source of truth for all prices
├── assets/img/         # logos, favicon
├── assets/videos/      # hero, carousel & downloaded solar clips
├── CREDITS.md          # stock media licenses
├── robots.txt
└── sitemap.xml
```

## Editing prices
Update `data/pricing.json` , the interactive catalog and the Walt-vs-TATA comparison render from it automatically.

## Lead capture
The quote form and modal use **mailto** (`waltsolarenergies17@gmail.com`) and **WhatsApp** (`+91 8115 012 336`). To switch to a hosted form, point `#quote-form` at a Formspree endpoint.

## Deploy
Drag the folder into Netlify, or connect the repo to Vercel/GitHub Pages. It is fully static.
