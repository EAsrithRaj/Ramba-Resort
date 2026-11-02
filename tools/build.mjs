import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages } from '../src/pages.mjs';
import { shell, link } from '../src/layout.mjs';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const staticFiles = ['styles.css', 'home.css', 'script.js', 'favicon.svg', '_headers'];

export function siteOrigin(value = '') {
  if (!value) return '';
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash || url.hostname.endsWith('.example') || url.hostname === 'localhost') {
    throw new Error('SITE_URL must be a real HTTPS origin, such as https://your-owned-domain.com, with no path or credentials.');
  }
  return url.origin;
}

export function renderSite(value = '') {
  const origin = siteOrigin(value);
  const files = new Map(pages.map(page => [page.file, shell(page, origin)]));
  files.set('404.html', shell({ file: '404.html', title: 'Off the path — RAMBA RESORTS', description: 'The page could not be found. Return to RAMBA RESORTS.', content: `<section class="not-found paper"><div class="wrap"><p class="eyebrow">404 / Off the path</p><h1>A quiet<br><em>dead end.</em></h1><p>The page you followed isn’t here. Find your way back to the beginning.</p>${link('index.html','Return to RAMBA',true)}</div></section>` }));
  files.set('robots.txt', origin ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
  files.set('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${origin ? pages.map(page => `  <url><loc>${origin}/${page.file === 'index.html' ? '' : page.file}</loc></url>`).join('\n') : ''}\n</urlset>\n`);
  return files;
}

export async function build(value = process.env.SITE_URL || '') {
  const files = renderSite(value);
  const dist = join(root, 'dist');
  await mkdir(dist, { recursive: true });
  for (const [file, content] of files) {
    await writeFile(join(root, file), content);
    await writeFile(join(dist, file), content);
  }
  for (const file of staticFiles) {
    await readFile(join(root, file));
    await cp(join(root, file), join(dist, file));
  }
  // dist/assets is generated output; remove obsolete assets before copying.
  await rm(join(dist, 'assets'), { recursive: true, force: true });
  await cp(join(root, 'assets'), join(dist, 'assets'), { recursive: true });
  return { pages: pages.length, sections: pages.map(p => p.sections), origin: siteOrigin(value) || null, output: dist };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await build(), null, 2));
}
