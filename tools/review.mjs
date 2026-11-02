// Local-only responsive review harness. Never copied to dist/.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequestHandler, csp } from './serve.mjs';
const handler = createRequestHandler();
const files = new Map([
  ['/review.html', ['../tests/review.html','text/html']],
  ['/review.js', ['../tests/review.js','text/javascript']],
  ['/review.css', ['../tests/review.css','text/css']]
]);
createServer(async (req,res) => {
  const file = files.get(new URL(req.url,'http://localhost').pathname);
  if (file) {
    res.writeHead(200,{'Content-Type':file[1], 'Cache-Control':'no-store',
      'Content-Security-Policy':"default-src 'self'; frame-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'"});
    res.end(await readFile(new URL(file[0],import.meta.url))); return;
  }
  // Same-origin embedding is enabled ONLY on this separate loopback review server.
  const setHeader = res.setHeader.bind(res);
  res.setHeader = (name,value) => setHeader(name,name === 'Content-Security-Policy' ? csp.replace("frame-ancestors 'none'","frame-ancestors 'self'") : value);
  return handler(req,res);
}).listen(4174,'127.0.0.1',()=>console.log('Responsive review: http://127.0.0.1:4174/review.html'));
