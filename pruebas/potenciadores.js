// Aventura: los potenciadores (rayo, pluma, poción, imán) y lo que se mueve en el recorrido largo (muelles, ascensores y balsas).
const L = require('./lib');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 1 });
  await L.fresh(p);
  await p.evaluate(() => { window.__dicho = []; const s = window.speechSynthesis, o = s.speak.bind(s); s.speak = u => { window.__dicho.push(u.text); try { o(u); } catch (e) {} }; });
  const dicho = () => p.evaluate(() => window.__dicho);
  // un mundo llano entero, sin cerditos
  await p.evaluate(() => { const g = window.__juego.grid(), C = window.__juego.COLS; for (let x = 0; x < C; x++) for (let y = 0; y < 32; y++) g[y * C + x] = y < 20 ? 0 : y === 20 ? 1 : y < 24 ? 2 : 3; window.__juego.pigs().length = 0; });

  // 1. en su mundo: tres potenciadores entre las manzanas
  let r = await p.evaluate(() => { const J = window.__juego; J.entra(0); const a = J.av(); return { pots: a.pots.map(q => [q.x, q.y, q.t]), manz: a.manz.map(m => m.x), tipos: J.POT_K }; });
  ok(r.pots.length === 3 && new Set(r.pots.map(q => q[2])).size === 3 && r.pots.every(q => q[1] === 19), `tres potenciadores distintos a ras de suelo: ${r.pots.map(q => q[2] + ' en ' + q[0]).join(', ')}`);
  ok(r.pots.every(q => !r.manz.includes(q[0])), 'ninguno en la columna de una manzana');
  ok(r.tipos.join() === 'rayo,pluma,pocion,iman', 'hay cuatro tipos: ' + r.tipos.join(', '));
  await p.waitForTimeout(400); await p.screenshot({ path: `${L.CAP}/pot-1-mundo.png` });

  // 2. se cogen andando, y la voz dice qué pasa
  r = await p.evaluate(() => { const J = window.__juego, a = J.av(); a.pots[0].t = 'rayo'; a.kD = true; let t = 0; while (!a.pod && t < 4) { J.paso(1 / 60); t += 1 / 60; } a.kD = false; return { pod: a.pod && a.pod.t, s: a.pod && a.pod.s, x: a.x, c: a.pots[0].c }; });
  ok(r.pod === 'rayo' && r.c && r.s > 9.9, `andando hasta él se coge (x=${r.x.toFixed(1)}) y dura diez segundos`);
  ok((await dicho()).includes('¡Un rayo! ¡Ahora corres muchísimo!'), 'la voz: ¡Un rayo! ¡Ahora corres muchísimo!');

  // 3. cada uno hace lo suyo (simulado por pasos, sobre el llano)
  r = await p.evaluate(() => { const J = window.__juego, a = J.av(), g = J.grid(), C = J.COLS, out = {};
    a.pots.forEach(q => { q.c = true; }); a.manz.forEach(m => { m.c = true; });
    const pon = (t, x) => { a.pod = t ? { t, s: 10 } : null; a.x = x; a.y = 20; a.vy = 0; a.kD = a.kI = false; a.salto = 0; for (let k = 0; k < 5; k++) J.paso(1 / 60); };
    const corre = t => { pon(t, 12); a.kD = true; const x0 = a.x; for (let k = 0; k < 60; k++) J.paso(1 / 60); a.kD = false; return a.x - x0; };
    const salta = t => { pon(t, 12); a.salto = .15; let alto = 0; for (let k = 0; k < 120; k++) { J.paso(1 / 60); alto = Math.max(alto, 20 - a.y); } return alto; };
    out.corre = [corre(''), corre('rayo')]; out.salta = [salta(''), salta('pluma')];
    // un muro de dos en la columna 30: sin poción para; con poción lo sube solo
    g[19 * C + 30] = 3; g[18 * C + 30] = 3;
    const muro = t => { pon(t, 26); a.kD = true; for (let k = 0; k < 150; k++) J.paso(1 / 60); a.kD = false; return a.x; };
    out.muro = [muro(''), muro('pocion')]; out.tam = a.tam; g[19 * C + 30] = 0; g[18 * C + 30] = 0;
    // una manzana cuatro bloques por encima del suelo: sin imán se pasa por debajo; con imán viene sola
    const alta = t => { a.manz = [{ x: 40, y: 15, c: false }]; a.cog = 0; pon(t, 36); a.kD = true; for (let k = 0; k < 110; k++) J.paso(1 / 60); a.kD = false; return a.cog; };
    out.iman = [alta(''), alta('iman')];
    // el gigante alcanza una manzana a dos bloques sin saltar
    const dos = t => { a.manz = [{ x: 40, y: 17, c: false }]; a.cog = 0; pon(t, 36); a.kD = true; for (let k = 0; k < 110; k++) J.paso(1 / 60); a.kD = false; return a.cog; };
    out.gig = [dos(''), dos('pocion')];
    // y se acaba solo
    pon('pluma', 12); for (let k = 0; k < 590; k++) J.paso(1 / 60); out.queda = a.pod && a.pod.s; for (let k = 0; k < 40; k++) J.paso(1 / 60); out.fin = a.pod; out.tamFin = a.tam;
    return out; });
  ok(Math.abs(r.corre[0] - 4.6) < .1 && r.corre[1] > r.corre[0] * 1.55, `rayo: en un segundo recorre ${r.corre[1].toFixed(1)} bloques en vez de ${r.corre[0].toFixed(1)}`);
  ok(r.salta[0] > 2.1 && r.salta[0] < 2.5 && r.salta[1] > 3.6 && r.salta[1] < 4.2, `pluma: salta ${r.salta[1].toFixed(1)} bloques de alto en vez de ${r.salta[0].toFixed(1)}`);
  ok(r.muro[0] < 30 && r.muro[1] > 31 && r.tam > 1.7, `poción: se hace gigante (×${r.tam.toFixed(1)}) y sube solo un escalón de dos (x=${r.muro[1].toFixed(1)}; sin ella se queda en ${r.muro[0].toFixed(1)})`);
  ok(r.gig[0] === 0 && r.gig[1] === 1, 'y alcanza sin saltar una manzana que está a dos bloques');
  ok(r.iman[0] === 0 && r.iman[1] === 1, 'imán: una manzana alta viene sola al pasar por debajo');
  ok(r.queda > 0 && r.queda < .3 && r.fin === null && r.tamFin < 1.05, 'a los diez segundos se acaba solo y todo vuelve a ser normal');
  // así se ve el gigante con su barrita
  await p.evaluate(() => { const a = window.__juego.av(); a.pod = { t: 'pocion', s: 6 }; a.x = 12; a.y = 20; a.manz = []; });
  await p.waitForTimeout(500); await p.screenshot({ path: `${L.CAP}/pot-2-gigante.png` });
  await p.evaluate(() => window.__juego.sale());

  // 4. el recorrido largo: un potenciador por tramo, y muelles, ascensores y balsas bien puestos
  const gen = await p.evaluate(() => { const J = window.__juego, C = J.COLS, out = { n: 0, mal: [], muelle: 0, asc: 0, balsa: 0, ej: {} };
    for (let s = 1; s <= 150; s++) { const tipos = [];
      for (let n = 0; n < 3; n++) { const t = J.generaTramo(n, s), g = t.g; out.n++;
        const firme = (x, y) => !g[y * C + x] && [1, 6, 12].includes(g[(y + 1) * C + x]);
        if (t.pots.length !== 1 || !firme(t.pots[0].x, t.pots[0].y)) out.mal.push(`semilla ${s} tramo ${n}: potenciador mal puesto`); else tipos.push(t.pots[0].t);
        t.muelles.forEach(m => { out.muelle++; if (!out.ej.muelle) out.ej.muelle = [n, s];
          if (!firme(m.x, m.y) || !t.manz.some(q => q.x === m.x && q.y === m.y - 4)) out.mal.push(`semilla ${s} tramo ${n}: muelle sin suelo o sin su manzana`); });
        t.plats.forEach(q => { if (q.eje) { out.asc++; if (!out.ej.asc) out.ej.asc = [n, s];
            if (!t.manz.some(m => m.x === q.x + .5 && m.y === q.b - 6)) out.mal.push(`semilla ${s} tramo ${n}: ascensor sin su manzana`);
            for (let y = q.b - 8; y < q.b; y++) for (let x = q.x - .5; x <= q.x + 1.5; x++) if (g[y * C + x]) out.mal.push(`semilla ${s} tramo ${n}: algo estorba al ascensor en ${x},${y}`); }
          else { out.balsa++; if (!out.ej.balsa) out.ej.balsa = [n, s];
            for (let x = q.a; x < q.b + 2; x++) if (g[(q.y + 1) * C + x] !== 7 || g[q.y * C + x]) out.mal.push(`semilla ${s} tramo ${n}: la balsa no va sobre el agua en ${x}`); } }); }
      if (new Set(tipos).size !== 3) out.mal.push(`semilla ${s}: potenciadores repetidos (${tipos.join()})`); }
    return out; });
  ok(gen.mal.length === 0, `${gen.n} tramos: un potenciador en cada uno (distinto en cada tramo) y todo sobre suelo firme` + (gen.mal.length ? ' — ' + gen.mal.slice(0, 4).join('; ') : ''));
  ok(gen.muelle > gen.n * .25 && gen.asc > gen.n * .15 && gen.balsa > gen.n * .1, `en ${gen.n} tramos salen ${gen.muelle} muelles, ${gen.asc} ascensores y ${gen.balsa} balsas`);

  // 5. cómo funcionan: el muelle lanza hasta su manzana, el ascensor sube solo hasta la suya y la balsa lleva de un lado al otro
  const mec = await p.evaluate(ej => { const J = window.__juego, out = {}; J.modo('curso'); J.entra(0); const a = J.av();
    const quieto = () => { a.kD = a.kI = false; a.salto = 0; a.pod = null; a.vy = 0; a.cog = 0; a.manz.forEach(m => { m.c = false; }); };
    { J.cursoPon(ej.muelle[0], ej.muelle[1]); quieto(); const m = a.muelles[0]; a.x = m.x - 1.5; a.y = m.y + 1; a.kD = true; let alto = 0, t = 0;
      while (t < 2.5) { J.paso(1 / 60); t += 1 / 60; alto = Math.max(alto, m.y + 1 - a.y); if (a.x > m.x + .4) a.kD = false; }
      out.muelle = { alto, cog: a.cog, arriba: a.manz.find(q => q.y === m.y - 4 || q.c).c }; }
    { J.cursoPon(ej.asc[0], ej.asc[1]); quieto(); const q = a.plats.find(e => e.eje); a.x = q.x + 1; a.y = q.b; let alto = 0, t = 0, baja = false;
      while (t < 9) { J.paso(1 / 60); t += 1 / 60; alto = Math.max(alto, q.b - a.y); if (alto > 4 && a.y === q.b) baja = true; }
      out.asc = { alto, cog: a.cog, baja }; }
    { J.cursoPon(ej.balsa[0], ej.balsa[1]); quieto(); const q = a.plats.find(e => !e.eje); a.x = q.x + 1; a.y = q.y; let min = a.x, max = a.x, t = 0, y0 = a.y, cae = false;
      while (t < 7) { J.paso(1 / 60); t += 1 / 60; min = Math.min(min, a.x); max = Math.max(max, a.x); if (a.y > y0 + .01) cae = true; }
      out.balsa = { viaje: max - min, cae, ancho: q.b - q.a };
      // por debajo no estorba: desde el agua, un salto lo deja subido a la balsa o fuera
      a.x = q.a + 2.5; a.y = q.y + 2; a.vy = 0; for (let k = 0; k < 10; k++) J.paso(1 / 60); a.salto = .15; let sube = false; for (let k = 0; k < 90; k++) { J.paso(1 / 60); if (a.suelo && a.y <= q.y + .01) sube = true; }
      out.balsa.sube = sube; }
    J.sale(); J.modo('mundo'); return out; }, gen.ej);
  ok(mec.muelle.alto > 4.8 && mec.muelle.cog === 1, `muelle: al pisarlo sale lanzado ${mec.muelle.alto.toFixed(1)} bloques y coge la manzana de arriba`);
  ok(mec.asc.alto > 4.5 && mec.asc.cog === 1 && mec.asc.baja, `ascensor: quieto encima, sube ${mec.asc.alto.toFixed(1)} bloques, coge la manzana y vuelve a bajar`);
  ok(mec.balsa.viaje > mec.balsa.ancho - .1 && !mec.balsa.cae, `balsa: quieto encima, lo lleva ${mec.balsa.viaje.toFixed(1)} bloques sobre el agua sin caerse`);
  ok(mec.balsa.sube, 'desde el agua, saltando se sube a la balsa: por debajo se atraviesa');

  // 6. cómo se ve
  await p.evaluate(ej => { const J = window.__juego; J.modo('curso'); J.entra(2); J.cursoPon(ej.muelle[0], ej.muelle[1]); const a = J.av(); a.x = a.muelles[0].x - 3; a.y = a.muelles[0].y + 1; }, gen.ej);
  await p.waitForTimeout(700); await p.screenshot({ path: `${L.CAP}/pot-3-muelle.png` });
  await p.evaluate(ej => { const J = window.__juego; J.cursoPon(ej.asc[0], ej.asc[1]); const a = J.av(), q = a.plats.find(e => e.eje); a.x = q.x - 2; a.y = q.b; }, gen.ej);
  await p.waitForTimeout(1500); await p.screenshot({ path: `${L.CAP}/pot-4-ascensor.png` });
  await p.evaluate(ej => { const J = window.__juego; J.cursoPon(ej.balsa[0], ej.balsa[1]); const a = J.av(), q = a.plats.find(e => !e.eje); a.x = q.a - 2; a.y = q.y; }, gen.ej);
  await p.waitForTimeout(900); await p.screenshot({ path: `${L.CAP}/pot-5-balsa.png` });
  await p.evaluate(() => { window.__juego.sale(); window.__juego.modo('mundo'); });
  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
})();
