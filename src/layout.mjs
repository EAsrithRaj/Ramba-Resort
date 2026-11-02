import { conceptImage, conceptCaption } from './imagery.mjs';

export const navigation = [
  ['index.html', 'Home'], ['story.html', 'Our Story'],
  ['experience.html', 'The Experience'], ['retreat.html', 'The Retreat'], ['enquire.html', 'Enquire']
];

export const brand = `<span class="brand-type">RAMBA<small>RESORTS</small></span>`;

export function link(href, text, filled = false) {
  return `<a class="button${filled ? ' button-fill' : ''}" href="${href}"><span>${text}</span><span aria-hidden="true">↗</span></a>`;
}

export function media(label = 'A visual direction', extra = '', name = 'garden') {
  return `<figure class="media ${extra}">${conceptImage(name,{sizes:'(max-width: 820px) 90vw, 45vw'})}<figcaption><span>${label}</span>${conceptCaption}</figcaption></figure>`;
}

export function pageHero(kicker, title, copy, number) {
  return `<section class="page-hero" aria-labelledby="page-title"><div class="page-number" aria-hidden="true">${number}</div><div class="wrap"><p class="eyebrow reveal">${kicker}</p><h1 id="page-title" class="reveal">${title}</h1><div class="page-hero-bottom"><p class="lede reveal">${copy}</p><a class="text-link" href="#chapter">Explore the chapter <span aria-hidden="true">↓</span></a></div></div></section>`;
}

export function shell(page, baseUrl = '') {
  const canonical = baseUrl ? `<link rel="canonical" href="${baseUrl}/${page.file === 'index.html' ? '' : page.file}"><meta property="og:url" content="${baseUrl}/${page.file === 'index.html' ? '' : page.file}">` : '';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#29483D">
  <meta name="description" content="${page.description}">
  <meta name="robots" content="${baseUrl ? 'index, follow' : 'noindex, nofollow'}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="RAMBA RESORTS">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  ${canonical}
  <title>${page.title}</title>
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preload" href="assets/fonts/playfair-regular.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="home.css">
  <script src="script.js" defer></script>
</head>
<body data-page="${page.file}">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="index.html" aria-label="RAMBA Resorts home">${brand}</a>
      <button class="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu"><span data-menu-label>Menu</span><span class="menu-lines" aria-hidden="true"></span></button>
      <nav class="nav" id="site-nav" aria-label="Primary navigation">${navigation.map(([file,name]) => `<a href="${file}"${page.file === file ? ' aria-current="page"' : ''}${file === 'enquire.html' ? ' class="nav-cta"' : ''}>${name}${file === 'enquire.html' ? ' <span aria-hidden="true">↗</span>' : ''}</a>`).join('')}</nav>
    </div>
  </header>
  <main id="main-content" tabindex="-1">${page.content}</main>
  <footer class="footer"><div class="wrap">
    <div class="footer-top"><a class="brand brand-large" href="index.html" aria-label="RAMBA Resorts home">${brand}</a><p>Curating <em>Memories.</em></p><a class="text-link" href="#main-content">Back to top <span aria-hidden="true">↑</span></a></div>
    <div class="footer-bottom"><div><p>A retreat in the making.<br>Interiors &amp; pool under construction.</p><p class="footer-contact">stay@ramba.example<br><span>Placeholder · email setup pending</span></p></div><nav aria-label="Footer navigation">${navigation.map(([file,name]) => `<a href="${file}">${name}</a>`).join('')}</nav><small>RAMBA RESORTS · <span data-year>2026</span><br>All resort imagery is AI-generated.<br>Concepts, not actual property photographs.<button class="motion-toggle" type="button" data-motion-toggle aria-pressed="false">Reduce motion</button></small></div>
  </div></footer>
</body>
</html>`;
}
