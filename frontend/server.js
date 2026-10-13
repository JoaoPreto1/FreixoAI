import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let rawPath = req.url.split('?')[0];
  let reqPath;
  try {
    reqPath = decodeURIComponent(rawPath);
  } catch {
    reqPath = decodeURI(rawPath);
  }
  if (reqPath === '/') reqPath = '/index.html';

  if (reqPath === '/favicon.ico') {
    res.writeHead(204);
    return res.end();
  }

  // Fornecer variáveis de ambiente públicas dinâmicas ao frontend
  if (reqPath === '/env.js') {
    const publicConfig = {
      PUBLIC_API_URL: process.env.PUBLIC_API_URL || 'http://localhost:5000/api',
      NODE_ENV: process.env.NODE_ENV || 'development'
    };
    res.writeHead(200, {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(`window.__ENV__ = Object.freeze(${JSON.stringify(publicConfig)});`);
  }

  const filePath = path.normalize(path.join(__dirname, reqPath));
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`404 Not Found: ${reqPath}`);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`500 Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Freixo AI Frontend a correr em: http://localhost:${PORT}`);
});
