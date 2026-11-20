// Cómo se toca: un toque pone un bloque, arrastrar mueve el mundo, lo ocupado no se cambia, y una palma apoyada no estorba.
const L = require('./lib');
(async () => {
  const { b, ctx, p, errs } = await L.open({ width: 1024, height: 768 }, {});
  await L.fresh(p, 0);
  const cdp = await ctx.newCDPSession(p);
  const touch = async (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], i) => ({ x, y, id: i })) });
  const dedoArrastra = async (x0, y0, x1, y1, pasos = 12) => { await touch('touchStart', [[x0, y0]]);
    for (let i = 1; i <= pasos; i++) { await touch('touchMove', [[x0 + (x1 - x0) * i / pasos, y0 + (y1 - y0) * i / pasos]]); await p.waitForTimeout(16); }
    await touch('touchEnd', []); await p.waitForTimeout(120); };
  const pos = async (x, y) => { const c = await L.cam(p); return [c.left + (x - c.camC + .5) * c.S, c.top + (y + .5) * c.S + c.offY]; };
  const dedoToca = async (x, y, baile = 0) => { const [sx, sy] = await pos(x, y); await touch('touchStart', [[sx, sy]]); if (baile) await touch('touchMove', [[sx + baile, sy + baile]]); await touch('touchEnd', []); await p.waitForTimeout(120); };
  const bloques = s => s.grid.filter(v => v).length;
  let st = await L.state(p), c = await L.cam(p); const n0 = bloques(st);
  console.log('inicio: bloques', n0, '| vista columna', c.camC.toFixed(2), 'fila', c.camR.toFixed(2));
  // 1) arrastrar: mueve el mundo a lo ancho y a lo alto, y no pone nada
  await dedoArrastra(700, 300, 300, 300); let d = await L.cam(p); st = await L.state(p);
  console.log('arrastre 400 px a la izquierda -> bloques iguales:', bloques(st) === n0, '| columna', c.camC.toFixed(2), '->', d.camC.toFixed(2), '| fila sin cambio:', Math.abs(d.camR - c.camR) < .01);
  await dedoArrastra(500, 150, 500, 450); let e = await L.cam(p); st = await L.state(p);
  console.log('arrastre 300 px hacia abajo -> bloques iguales:', bloques(st) === n0, '| fila', d.camR.toFixed(2), '->', e.camR.toFixed(2), '(sube al cielo) | columna sin cambio:', Math.abs(e.camC - d.camC) < .01);
  await dedoArrastra(500, 450, 500, 150); await dedoArrastra(300, 500, 700, 500);
  // 2) un toque en un hueco pone un bloque; con el dedo bailando un poco también
  await p.click('#b10'); const [[x1, y1], [x2, y2]] = await L.huecos(p, 2);
  await dedoToca(x1, y1); st = await L.state(p); console.log('toque en hueco -> celda', L.cell(st, x1, y1), '(10 = oro) | bloques nuevos', bloques(st) - n0);
  await dedoToca(x2, y2, 6); st = await L.state(p); console.log('toque con el dedo bailando 8 px -> celda', L.cell(st, x2, y2));
  // 3) toque sobre un bloque ya puesto, con otro seleccionado: no lo cambia y lo explica
  await p.click('#b8'); await dedoToca(x1, y1); st = await L.state(p);
  console.log('toque sobre el oro con ladrillo -> el oro sigue:', L.cell(st, x1, y1) === 10, '| el ladrillo va encima:', L.cell(st, x1, y1 - 1) === 8);
  const t = L.topOf(st, x1 + 1 === x2 ? x1 - 1 : x1 + 1), gx = x1 + 1 === x2 ? x1 - 1 : x1 + 1; await dedoToca(gx, t); st = await L.state(p);
  console.log('toque sobre el suelo -> sigue siendo', L.cell(st, gx, t), '(1 = hierba)');
  // 4) pico: un toque quita uno; arrastrar no quita nada
  await p.click('#tDig'); const n1 = bloques(st); await dedoToca(x1, y1); st = await L.state(p);
  console.log('pico, un toque -> celda', L.cell(st, x1, y1), '| bloques', bloques(st) - n1);
  const n2 = bloques(st); await dedoArrastra(300, 560, 700, 560); st = await L.state(p); console.log('pico, arrastre por la tierra -> bloques', bloques(st) - n2);
  // 5) dos dedos a la vez (la palma apoyada y un dedo que toca): el toque sigue contando
  await p.click('#tPut'); await p.click('#b12'); const [[x3, y3]] = await L.huecos(p, 1); const [px, py] = await pos(x3, y3);
  await touch('touchStart', [[60, 600]]); await touch('touchStart', [[60, 600], [px, py]]); await touch('touchEnd', [[60, 600]]); await touch('touchEnd', []); await p.waitForTimeout(150);
  st = await L.state(p); console.log('palma apoyada + toque en hueco -> celda', L.cell(st, x3, y3), '(12 = nieve)');
  console.log('errores', errs);
  await b.close();
})();
