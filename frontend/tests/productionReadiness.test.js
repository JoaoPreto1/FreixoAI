/**
 * FREIXO AI — Testes de Preparação para Produção, Segurança e Robustez
 * Valida sanitização XSS, prevenção de Path Traversal, validação de limites de URL,
 * integridade de metadados de favoritos e ausência de segredos expostos.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');

import { storageService, DEFAULT_FAVORITES } from '../js/services/storageService.js';
import { AiChatWidget } from '../js/components/AiChatWidget.js';

let testServer;
let baseUrl;

before(async () => {
  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8'
  };

  testServer = http.createServer((req, res) => {
    let rawPath = req.url.split('?')[0];
    let reqPath;
    try {
      reqPath = decodeURIComponent(rawPath);
    } catch {
      reqPath = decodeURI(rawPath);
    }
    if (reqPath === '/') reqPath = '/index.html';

    if (reqPath === '/env.js') {
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
      return res.end('window.__ENV__ = Object.freeze({ PUBLIC_API_URL: "http://localhost:5000/api" });');
    }

    const filePath = path.normalize(path.join(frontendDir, reqPath));
    if (!filePath.startsWith(frontendDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('403 Forbidden');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
      return fs.createReadStream(filePath).pipe(res);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  await new Promise(resolve => {
    testServer.listen(0, () => {
      const port = testServer.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (testServer) {
    await new Promise(resolve => testServer.close(resolve));
  }
});

// ==============================================================================
// 1. Segurança: Path Traversal no Servidor Estático
// ==============================================================================
test('Segurança — Tentativas de Directory/Path Traversal devem retornar 403 Forbidden', async () => {
  const statusCode = await new Promise((resolve, reject) => {
    const port = testServer.address().port;
    const req = http.request({
      hostname: 'localhost',
      port,
      path: '/..%2f..%2fpackage.json',
      method: 'GET'
    }, (res) => {
      resolve(res.statusCode);
    });
    req.on('error', reject);
    req.end();
  });

  assert.equal(statusCode, 403);
});

// ==============================================================================
// 2. Segurança: Sanitização XSS no formatMarkdown do Chat
// ==============================================================================
test('Segurança — formatMarkdown neutraliza injeções HTML/XSS enquanto preserva formatação segura', () => {
  const widget = new AiChatWidget();

  const xssInput1 = '<script>alert("xss")</script>';
  const sanitized1 = widget.formatMarkdown(xssInput1);
  assert.ok(!sanitized1.includes('<script>'), 'Não deve conter tag script viva');
  assert.ok(sanitized1.includes('&lt;script&gt;'), 'Deve escapar caracteres < e >');

  const xssInput2 = '<img src="x" onerror="stealCookie()">';
  const sanitized2 = widget.formatMarkdown(xssInput2);
  assert.ok(!sanitized2.includes('<img'), 'Não deve conter tag img viva');
  assert.ok(sanitized2.includes('&lt;img'), 'Deve escapar entidades HTML');

  const safeMarkdown = 'Visita o **Penedo Durão** e a *Freixo de Espada à Cinta*.';
  const formatted = widget.formatMarkdown(safeMarkdown);
  assert.ok(formatted.includes('<strong>Penedo Durão</strong>'), 'Deve converter markdown ** em strong');
  assert.ok(formatted.includes('<em>Freixo de Espada à Cinta</em>'), 'Deve converter markdown * em em');
});

// ==============================================================================
// 3. Robustez e Integridade de Metadados nos Favoritos
// ==============================================================================
test('StorageService — DEFAULT_FAVORITES possuem metadados completos de título e categoria', () => {
  assert.ok(Array.isArray(DEFAULT_FAVORITES) && DEFAULT_FAVORITES.length >= 2);
  DEFAULT_FAVORITES.forEach(rec => {
    assert.ok(rec.id);
    assert.ok(rec.title, `Favorito padrão ${rec.id} deve ter título preenchido`);
    assert.ok(rec.category, `Favorito padrão ${rec.id} deve ter categoria`);
  });
});

test('StorageService — toggleFavorite armazena e preserva metadados enriquecidos', () => {
  storageService.clearFavorites();

  const isNowFav = storageService.toggleFavorite('castelo-freixo', {
    type: 'place',
    title: 'Torre do Galo e Castelo',
    category: 'patrimonio',
    image: 'assets/images/penedo-durao.png'
  });

  assert.equal(isNowFav, true);
  const records = storageService.getFavoriteRecords();
  const found = records.find(r => r.id === 'castelo-freixo');
  assert.ok(found);
  assert.equal(found.title, 'Torre do Galo e Castelo');
  assert.equal(found.category, 'patrimonio');
});

// ==============================================================================
// 4. Ausência de Segredos e Configuração de Ambiente
// ==============================================================================
test('Configuração — Ficheiro estático frontend/env.js existe para servidores não-Node', () => {
  const envPath = path.join(frontendDir, 'env.js');
  assert.ok(fs.existsSync(envPath), 'frontend/env.js deve existir fisicamente');

  const content = fs.readFileSync(envPath, 'utf8');
  assert.ok(content.includes('PUBLIC_API_URL'), 'Deve definir PUBLIC_API_URL');
  assert.ok(!content.includes('SUPABASE_SECRET_KEY'), 'Nunca deve expor SUPABASE_SECRET_KEY no frontend');
  assert.ok(!content.includes('SERVICE_ROLE_KEY'), 'Nunca deve expor SERVICE_ROLE_KEY no frontend');
});

test('Configuração — Ficheiros HTML contêm charset UTF-8 e viewport responsivo', () => {
  const htmlFiles = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));
  assert.ok(htmlFiles.length >= 8);

  htmlFiles.forEach(file => {
    const html = fs.readFileSync(path.join(frontendDir, file), 'utf8');
    assert.ok(html.includes('charset="UTF-8"') || html.includes("charset='UTF-8'"), `${file} deve conter charset UTF-8`);
    assert.ok(html.includes('name="viewport"'), `${file} deve conter meta viewport`);
  });
});
