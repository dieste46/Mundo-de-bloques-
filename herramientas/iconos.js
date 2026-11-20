// Genera los iconos del juego con sus propias texturas y su cerdito: una escena pequeña de su mundo (árbol, sol, flor y cerdito).
// Uso, con el servidor local en marcha (node pruebas/servidor.js):   node herramientas/iconos.js
// Escribe en la raíz icon-512.png, icon-192.png, apple-touch-icon.png (180) e icon-maskable.png (512, con el dibujo dentro
// de la zona segura, porque Android puede recortarlo en círculo). Después hay que subir CACHE en sw.js para que se renueven.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const BASE = process.env.JUEGO || 'http://localhost:8765/', RAIZ = path.join(__dirname, '..');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 800, height: 600 } });
  await p.goto(BASE + '?prueba'); await p.waitForTimeout(700);
  const png = await p.evaluate(() => {
    const J = window.__juego, tv = J.texV(), cerdo = J.PERS[0].der[0], N = 512;
    // s: lado de un bloque (múltiplo de 16, para que cada píxel del dibujo sea un cuadrado exacto); x0: borde izquierdo del árbol; y: altura del suelo
    const escena = (s, x0, y, cerdoLado, conNube) => {
      const c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
      const g = x.createLinearGradient(0, 0, 0, N); g.addColorStop(0, '#5fb4ec'); g.addColorStop(1, '#bfe6fb'); x.fillStyle = g; x.fillRect(0, 0, N, N);
      const bl = (id, px, py, k) => x.drawImage(tv[id][k % tv[id].length], Math.round(px), Math.round(py), s, s);
      const sol = s * .9; x.fillStyle = '#ffe066'; x.fillRect(x0 + 4.2 * s, y - 4 * s, sol, sol); x.fillStyle = '#fff3a6'; x.fillRect(x0 + 4.2 * s + sol * .2, y - 4 * s + sol * .2, sol * .6, sol * .6);
      if (conNube) { x.fillStyle = 'rgba(255,255,255,.94)'; x.fillRect(x0 + 3.25 * s, y - 2.6 * s, s * 1.5, s * .36); x.fillRect(x0 + 3.55 * s, y - 2.84 * s, s * .8, s * .3); }
      for (let k = 0, px = x0 - Math.ceil(x0 / s) * s; px < N; k++, px += s) { bl(1, px, y, k); for (let t = 1; y + t * s < N; t++) bl(2, px, y + t * s, k + t); } // hierba y, debajo, tierra hasta el borde
      bl(4, x0 + s, y - s, 0); bl(4, x0 + s, y - 2 * s, 1);                                           // tronco (la segunda madera lleva el nudo)
      for (let dx = 0; dx < 3; dx++) for (let dy = 0; dy < 2; dy++) bl(5, x0 + dx * s, y - (3 + dy) * s, dx + dy * 2); // copa
      bl(11, x0 + 2.3 * s, y - s, 0);                                                                  // flor
      x.drawImage(cerdo, Math.round(x0 + 5.5 * s - cerdoLado), y - cerdoLado, cerdoLado, cerdoLado);   // cerdito, con los pies en la hierba
      return c;
    };
    const reduce = (c, n) => { // de 512 al tamaño pedido, promediando (primero a la mitad exacta, luego el resto)
      const m = document.createElement('canvas'); m.width = m.height = 256; const mx = m.getContext('2d'); mx.imageSmoothingQuality = 'high'; mx.drawImage(c, 0, 0, 256, 256);
      const o = document.createElement('canvas'); o.width = o.height = n; const ox = o.getContext('2d'); ox.imageSmoothingQuality = 'high'; ox.drawImage(m, 0, 0, n, n); return o;
    };
    const normal = escena(80, 36, 352, 192, true), segura = escena(48, 124, 336, 112, false);
    return { 'icon-512.png': normal.toDataURL(), 'icon-192.png': reduce(normal, 192).toDataURL(), 'apple-touch-icon.png': reduce(normal, 180).toDataURL(), 'icon-maskable.png': segura.toDataURL() };
  });
  for (const n of Object.keys(png)) { fs.writeFileSync(path.join(RAIZ, n), Buffer.from(png[n].split(',')[1], 'base64')); console.log('escrito', n); }
  await b.close();
})();
