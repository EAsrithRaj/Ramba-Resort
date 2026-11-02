# RAMBA RESORTS — Homepage review build

A runnable, five-page static website. The homepage has received the new visual treatment; the other four page layouts are retained pending homepage approval. No deployment or domain connection has been performed.

## Run

Unzip and open index.html, or use Node.js 20+:

```sh
npm start
```

Visit http://127.0.0.1:4173. No package installation, API key or account is required. Stop the server with Ctrl+C.

## Edit and rebuild

- src/home.mjs: homepage, seven sections plus shared footer.
- src/pages.mjs: Our Story (4), The Experience (5), The Retreat (4), Enquire (3).
- src/layout.mjs: shared text identity, navigation, metadata and footer.
- src/imagery.mjs: reusable responsive image markup and conceptual alt text.
- styles.css: official palette, local fonts and existing page foundations.
- home.css: new homepage, shared brand refinements, responsive and motion rules.
- script.js: menu, scroll enhancement, keyboard image selector and enquiry draft tool.
- assets/concepts/: optimized images; design/originals/: ten full-resolution originals.

```sh
npm run build
npm run check
```

The build refreshes root HTML and dist/, clearing retired generated assets. Preview dist with node tools/serve.mjs --dist. Do not edit generated HTML as your source.

## Responsive review

```sh
node tools/review.mjs
```

Open http://127.0.0.1:4174/review.html. The optional local review frame shows the actual pages at 320, 390, 768 and 1024 pixels. It is excluded from dist/. Only its separate loopback server permits same-origin framing; normal preview and production headers continue to prohibit framing.

## Honest content

All resort scenes are original AI-generated concepts, visibly disclosed. They are not actual RAMBA property photographs or specifications. Villa exteriors are complete; interiors and pool are under construction. Opening dates, availability, capacities, rates, commercial terms and final experiences are unconfirmed.

stay@ramba.example is unchanged and cannot receive mail. The enquiry tool validates and prepares a local plain-text draft; it does not send, book, or store information. Visitors can save the draft and optionally open their own mail client. There is no backend or tracking.

No usable official logo was found. The site uses plain RAMBA RESORTS text and a temporary colour-only favicon marker. Supply approved SVG or transparent high-resolution PNG logo versions on light and dark backgrounds before launch. No invented logo is presented as official.

Fonts: self-hosted Playfair Display and DM Sans with SIL Open Font Licences in assets/fonts/.

## Motion and accessibility

All routes, copy and native accordions work without JavaScript. The enquiry tool explains when JavaScript is required. Experience controls support click, Tab, left/right arrows, Home and End. Without JavaScript, all experience panels remain readable. System reduced-motion preferences and the footer motion control disable movement, clipping and animated navigation. The arch entrance does not block navigation.

## Future launch

Default output is noindex with Disallow: / and an empty sitemap. A future SITE_URL HTTPS origin enables canonical URLs and the five-page sitemap; use it only after content and launch approval. No fictitious origin is inserted. Configure a static host to serve dist/ and return 404.html with a 404 status. _headers supplies security headers on compatible hosts.

See docs/AUDIT.md, docs/QA.md, docs/CHANGES.md and design/IMAGERY.md for audit, verified checks, file inventory, image provenance and unresolved work.
# Ramba-Resort
