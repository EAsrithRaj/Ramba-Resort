import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const routes = new Set(['index.html','story.html','experience.html','retreat.html','enquire.html','404.html','styles.css','home.css','script.js','favicon.svg','robots.txt','sitemap.xml']);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.webp':'image/webp', '.ttf':'font/ttf', '.txt':'text/plain; charset=utf-8', '.xml':'application/xml; charset=utf-8' };
export const csp = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'";

export function createRequestHandler(directory = root) {
  return async (req, res) => {
    res.setHeader('Content-Security-Policy', csp);
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
    res.setHeader('Cache-Control','no-store');
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, {Allow:'GET, HEAD'}); res.end(); return; }
    let path;
    try { path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '') || 'index.html'; }
    catch { res.writeHead(400); res.end(); return; }
    const target = resolve(directory, path);
    const assetPath = path.startsWith('assets/') && target.startsWith(resolve(directory, 'assets') + sep);
    const permitted = (routes.has(path) || assetPath) && target.startsWith(resolve(directory) + sep);
    let body;
    try { if (!permitted) throw new Error('Not a public file'); body = await readFile(target); }
    catch {
      body = await readFile(resolve(directory, '404.html'));
      res.writeHead(404, {'Content-Type':types['.html']});
      res.end(req.method === 'HEAD' ? undefined : body); return;
    }
    res.writeHead(200, {'Content-Type': types[extname(path)] || 'application/octet-stream'});
    res.end(req.method === 'HEAD' ? undefined : body);
  };
}

export function createStaticServer(directory = root) {
  return createServer(createRequestHandler(directory));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createStaticServer(process.argv.includes('--dist') ? resolve(root,'dist') : root);
  const port = Number(process.env.PORT || 4173);
  server.on('error', error => {
    console.error(`Unable to start local preview: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => console.log(`RAMBA local preview: http://127.0.0.1:${server.address().port}`));
}
