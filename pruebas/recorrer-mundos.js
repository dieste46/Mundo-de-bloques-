// Recorre N mundos recién generados simulando a un niño que mantiene ➡️ y salta cuando deja de avanzar. ¿Llega siempre a la bandera?
const { chromium } = require('playwright');
const L = require('./lib');
(async () => {
  const N = +(process.argv[2] || 200);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1024, height: 768 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(L.URL); await p.waitForTimeout(600);
  const r = await p.evaluate(N => {
    const J = window.__juego, out = { llega: 0, atasco: [], manz: 0, saltos: 0, t: 0 };
    for (let n = 0; n < N; n++) {
      J.genera(); J.entra(n % 6); const a = J.av(); a.kD = true; let t = 0, xAnt = a.x, quieto = 0, saltos = 0;
      while (!a.fin && t < 90) { J.paso(1 / 60); t += 1 / 60;
        if (Math.abs(a.x - xAnt) < 1e-4) { quieto += 1 / 60; if (quieto > .4 && a.suelo) { a.salto = .15; saltos++; quieto = 0; } } else quieto = 0; xAnt = a.x; }
      if (a.fin) { out.llega++; out.manz += a.cog; out.saltos += saltos; out.t += t; }
      else { const g = J.grid(), cx = Math.floor(a.x), cy = Math.floor(a.y), f = []; for (let y = cy - 6; y <= cy + 2; y++) { let s = ''; for (let x = cx - 4; x <= cx + 5; x++) s += (x === cx && y === cy - 1) ? '@' : (g[y * 96 + x] || 0).toString(16); f.push(s); } out.atasco.push({ n, x: +a.x.toFixed(2), y: +a.y.toFixed(2), mapa: f }); }
      J.sale();
    }
    return out;
  }, N);
  console.log(`llega a la bandera en ${r.llega} de ${N} mundos | media: ${(r.t / r.llega).toFixed(1)} s, ${(r.manz / r.llega).toFixed(1)} manzanas de 8, ${(r.saltos / r.llega).toFixed(1)} saltos`);
  r.atasco.slice(0, 4).forEach(a => console.log('ATASCO mundo', a.n, 'en', a.x, a.y, '\n  ' + a.mapa.join('\n  ')));
  console.log('errores:', errs.length ? errs.slice(0, 3) : 'ninguno');
  if (r.llega !== N || errs.length) process.exitCode = 1;
  await b.close();
})();
