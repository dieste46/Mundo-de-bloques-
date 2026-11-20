// Servidor local para probar el juego tal como lo sirve Cloudflare Pages: desde la raíz, redirigiendo /index.html a /
// y pidiendo al navegador que revalide siempre. Uso: node pruebas/servidor.js [puerto]   (por defecto, 8765)
const http = require('http'), fs = require('fs'), path = require('path');
const RAIZ = path.join(__dirname, '..'), PUERTO = +(process.argv[2] || process.env.PUERTO || 8765);
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
function arranca(puerto = PUERTO) {
  return new Promise((ok, mal) => {
    const s = http.createServer((req, res) => {
      const [ruta, consulta] = req.url.split('?'); let u = decodeURIComponent(ruta);
      if (u === '/index.html') { res.writeHead(308, { Location: '/' + (consulta ? '?' + consulta : '') }); return res.end(); }
      if (u.endsWith('/')) u += 'index.html';
      const f = path.join(RAIZ, path.normalize(u));
      if (!f.startsWith(RAIZ)) { res.writeHead(403); return res.end(); }
      fs.readFile(f, (e, d) => {
        if (e) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('404'); }
        res.writeHead(200, { 'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'public, max-age=0, must-revalidate' }); res.end(d);
      });
    });
    s.on('error', mal); s.listen(puerto, () => ok(s));
  });
}
if (require.main === module) arranca().then(() => console.log('Mundo de Bloques en http://localhost:' + PUERTO + '/   (Ctrl+C para parar)'), e => { console.error('No se puede abrir el puerto ' + PUERTO + ': ' + e.message); process.exit(1); });
module.exports = { arranca, PUERTO };
