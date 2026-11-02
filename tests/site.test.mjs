import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pages } from '../src/pages.mjs';
import { renderSite, root, siteOrigin } from '../tools/build.mjs';
import { createRequestHandler } from '../tools/serve.mjs';

const rendered = renderSite();

test('approved five-page architecture and unique headings', () => {
  assert.deepEqual(pages.map(p => p.sections), [7,4,5,4,3]);
  for (const page of pages) {
    const html = rendered.get(page.file);
    assert.equal((html.match(/<section\b/g) || []).length, page.sections, page.file);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, page.file);
    assert.match(html, /<main id="main-content" tabindex="-1">/);
    assert.match(html, /href="#main-content"/);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${page.file}: IDs must be unique`);
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
  }
});

test('all rendered local links, images, scripts, fonts, and fragments resolve', async () => {
  for (const [file, html] of rendered) {
    if (!file.endsWith('.html')) continue;
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const value = match[1];
      if (/^(https?:|mailto:)/.test(value)) continue;
      const [target, hash] = value.split('#');
      const path = target || file;
      if (!rendered.has(path)) await access(join(root, path));
      if (hash) assert.ok((rendered.get(path) || '').includes(`id="${hash}"`), `${file}: missing ${value}`);
    }
    for (const [,set] of html.matchAll(/srcset="([^"]+)"/g)) {
      for (const candidate of set.split(',')) await access(join(root,candidate.trim().split(/\s+/)[0]));
    }
  }
  const css = await readFile(join(root,'styles.css'),'utf8');
  for (const match of css.matchAll(/url\('([^']+)'\)/g)) await access(join(root,match[1]));
});

test('every resort scene is disclosed as conceptual and uses intrinsic dimensions', () => {
  for (const [file, html] of rendered) {
    if (!file.endsWith('.html')) continue;
    for (const [image] of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(image, /alt="AI concept:/, file);
      assert.match(image, /width="\d+" height="\d+"/, file);
    }
  }
  assert.match(rendered.get('index.html'), /All resort scenes.*AI-generated concepts/);
  assert.match(rendered.get('index.html'), /Under construction/);
});

test('generated root and dist pages match current templates and static assets', async () => {
  const builtIndex = await readFile(join(root,'index.html'),'utf8');
  const canonical = builtIndex.match(/rel="canonical" href="([^"]+)"/);
  const configuredOrigin = canonical ? new URL(canonical[1]).origin : '';
  for (const [file, content] of renderSite(configuredOrigin)) {
    assert.equal(await readFile(join(root,file),'utf8'),content,`${file}: run npm run build`);
    assert.equal(await readFile(join(root,'dist',file),'utf8'),content,`dist/${file}: stale output`);
  }
  for (const file of ['styles.css','home.css','script.js','favicon.svg','_headers','assets/concepts/hero-1600.webp','assets/fonts/dm-sans-regular.ttf','assets/fonts/dm-sans-semibold.ttf','assets/fonts/playfair-regular.ttf','assets/fonts/playfair-italic.ttf']) {
    assert.deepEqual(await readFile(join(root,'dist',file)),await readFile(join(root,file)),file);
  }
});

test('unlaunched site has no fake canonical domain or sitemap URLs', () => {
  assert.match(rendered.get('robots.txt'), /Disallow: \//);
  assert.doesNotMatch(rendered.get('sitemap.xml'), /<loc>/);
  for (const page of pages) {
    assert.match(rendered.get(page.file), /noindex, nofollow/);
    assert.doesNotMatch(rendered.get(page.file), /rel="canonical"/);
  }
  assert.throws(() => siteOrigin('https://ramba.example'));
  assert.throws(() => siteOrigin('javascript:alert(1)'));
  assert.throws(() => siteOrigin('https://test.com/path'));
});

test('future origin config renders real canonical paths without changing default files', () => {
  const configured = renderSite('https://resort.test');
  assert.match(configured.get('story.html'), /href="https:\/\/resort.test\/story.html"/);
  assert.equal((configured.get('sitemap.xml').match(/<loc>/g) || []).length, 5);
});

test('email remains unchanged and user text is not injected as HTML', async () => {
  const js = await readFile(join(root,'script.js'),'utf8');
  assert.match(js, /mailto:stay@ramba.example/);
  assert.match(js, /encodeURIComponent\(body\)/);
  assert.doesNotMatch(js, /innerHTML|fetch\(|XMLHttpRequest|localStorage|sessionStorage/);
  assert.match(rendered.get('enquire.html'), /placeholder and cannot receive mail/);
});

test('preview request handler serves pages, handles 404, blocks private files and POST (no network)', async () => {
  const handler = createRequestHandler();
  async function request(url, method = 'GET') {
    const result = { status: 0, headers: {}, body: '' };
    await handler({url,method}, {
      setHeader(key,value) { result.headers[key.toLowerCase()] = value; },
      writeHead(status,headers = {}) { result.status = status; Object.entries(headers).forEach(([k,v]) => {result.headers[k.toLowerCase()] = v;}); },
      end(body) { result.body = body?.toString() || ''; }
    });
    return result;
  }
  for (const page of pages) assert.equal((await request(`/${page.file}`)).status, 200);
  const missing = await request('/missing-page');
  assert.equal(missing.status, 404);
  assert.match(missing.body, /A quiet/);
  assert.equal((await request('/src/pages.mjs')).status, 404);
  assert.equal((await request('/assets/%2e%2e%2fpackage.json')).status, 404);
  assert.equal((await request('/','POST')).status, 405);
  assert.equal((await request('/','HEAD')).body, '');
  assert.equal((await request('/%zz')).status, 400);
  assert.match((await request('/')).headers['content-security-policy'], /connect-src 'none'/);
});
