// Tocar se nota: saltito al poner, trocitos al romper, la casa que se levanta, la estrella y la línea de imágenes por segundo.
const L = require('./lib');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 2 });
  await L.fresh(p);
  // reloj que se puede parar, para fotografiar el salto a medias
  await p.evaluate(() => { const real = Date.now.bind(Date); window.__reloj = null; Date.now = () => window.__reloj !== null ? window.__reloj : real(); });
  const para = ms => p.evaluate(ms => { window.__reloj = (window.__t0 = window.__t0 || Date.now()) + ms; }, ms);
  const suelta = () => p.evaluate(() => { window.__reloj = null; window.__t0 = 0; });

  // 1. poner un bloque: salta
  const [[x, y]] = await L.huecos(p, 1, 1);
  const c = await L.cam(p), sx = c.left + (x - c.camC + .5) * c.S, sy = c.top + (y + .5) * c.S + c.offY;
  await p.evaluate(() => { window.__t0 = window.__reloj = Date.now(); });
  await p.mouse.click(sx, sy);
  ok(await p.evaluate(() => window.__juego.pops()) === 1, 'al poner un bloque se apunta su salto');
  const clip = { x: sx - c.S * 1.6, y: sy - c.S * 1.6, width: c.S * 3.2, height: c.S * 3.2 };
  for (const ms of [0, 25, 60, 95, 130, 165]) { await para(ms); await p.waitForTimeout(60); await p.screenshot({ path: `${L.CAP}/pop-${String(ms).padStart(3, '0')}.png`, clip }); }
  await suelta(); await p.waitForTimeout(350);
  ok(await p.evaluate(() => window.__juego.pops()) === 0, 'el salto termina y se olvida');
  let st = await L.state(p); ok(L.cell(st, x, y) === 1, 'el bloque queda puesto (hierba)');

  // 2. romperlo: trocitos
  await p.click('#tDig'); await p.waitForTimeout(80);
  const antes = await p.evaluate(() => window.__juego.partes());
  await p.mouse.click(sx, sy); await p.waitForTimeout(90);
  const tras = await p.evaluate(() => window.__juego.partes());
  ok(tras - antes >= 6, `al romper salen trocitos (${tras - antes})`);
  await p.screenshot({ path: `${L.CAP}/romper.png`, clip });
  st = await L.state(p); ok(L.cell(st, x, y) === 0, 'el bloque desaparece');
  await p.waitForTimeout(900);
  ok(await p.evaluate(() => window.__juego.partes()) <= antes + 1, 'los trocitos se acaban');

  // 3. la casa se levanta fila a fila
  await p.click('#tBuild').catch(() => {});
  const casaBtn = await p.evaluate(() => { const bs = [...document.querySelectorAll('.tool')]; const b = bs.find(b => /Casa|casa/.test(b.getAttribute('aria-label') || '')); return b ? b.id : null; });
  ok(!!casaBtn, 'hay botón de casa: ' + casaBtn);
  await p.evaluate(() => { window.__t0 = window.__reloj = Date.now(); });
  await p.click('#' + casaBtn); await p.waitForTimeout(60);
  const hayCasa = await p.evaluate(() => window.__juego.pops());
  if (!hayCasa) { const [[hx, hy]] = await L.huecos(p, 1, 1); await L.tapCell(p, null, null, hx, hy); }
  const n = await p.evaluate(() => window.__juego.pops());
  ok(n > 8, `la casa apunta un salto por bloque (${n})`);
  for (const ms of [40, 130, 230, 420]) { await para(ms); await p.waitForTimeout(60); await p.screenshot({ path: `${L.CAP}/casa-${String(ms).padStart(3, '0')}.png` }); }
  await suelta(); await p.waitForTimeout(700);
  ok(await p.evaluate(() => window.__juego.pops()) === 0, 'los saltos de la casa terminan');

  // 4. línea de versión con imágenes por segundo
  p.on('dialog', async d => { const m = /(\d+) × (\d+)/.exec(d.message()); await d.accept(String(m[1] * m[2])); });
  await p.click('#vozBtn'); await p.waitForTimeout(900);
  const ver = await p.evaluate(() => document.getElementById('vozVer').textContent);
  ok(/Versión del .+ · \d+ imágenes\/s · detalle ×[\d,]+/.test(ver), 'ajustes: ' + ver);
  await p.screenshot({ path: `${L.CAP}/ajustes.png` });
  await p.click('#vozClose');

  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
})();
