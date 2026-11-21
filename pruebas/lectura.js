// Lectura y números: letras por niveles, palabras con sus letras, «¿con qué letra empieza?», sílabas y decenas.
const L = require('./lib');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 1 });
  await L.fresh(p);
  const oye = () => p.evaluate(() => { window.__dicho = []; const s = window.speechSynthesis, o = s.speak.bind(s); s.speak = u => { window.__dicho.push(u.text); try { o(u); } catch (e) {} }; });
  const dicho = () => p.evaluate(() => window.__dicho); await oye();
  const J = f => p.evaluate(f);
  // 1. letras por niveles
  ok(await J(() => window.__juego.letrasNivel('letra')) === 'AEIOUMPLSD', 'en fácil, solo las letras de clase');
  const conNivel = async base => { await J(() => 0); await p.evaluate(b => { const d = JSON.parse(localStorage.getItem('bloques2')); d.base = b; d.niv = {}; localStorage.setItem('bloques2', JSON.stringify(d)); }, base); await p.reload(); await p.waitForTimeout(500); await oye(); };
  await conNivel(4); ok(await J(() => window.__juego.letrasNivel('letra')) === 'AEIOUMPLSDTNF', 'en medio se añaden las tres siguientes: T, N y F');
  await conNivel(8); ok(await J(() => window.__juego.letrasNivel('letra')) === 'AEIOUMPLSDTNFRBGCH', 'en difícil, ocho: hasta la H');
  const s = await J(() => { const c = {}; for (let k = 0; k < 4000; k++) { const l = window.__juego.letraSuelta(); c[l] = (c[l] || 0) + 1; } return c; });
  const deClase = [...'AEIOUMPLSD'].reduce((a, l) => a + (s[l] || 0), 0); ok(deClase / 4000 > .55 && deClase / 4000 < .7, `aun en difícil, las de clase son mayoría: ${Math.round(deClase / 40)} % de las veces`);
  ok(await J(() => [0, 7, 15, 20, 21, 23, 30, 47, 69, 99].map(n => window.__juego.numero(n)).join(' | ')) === 'cero | siete | quince | veinte | veintiuno | veintitrés | treinta | cuarenta y siete | sesenta y nueve | noventa y nueve', 'los números se dicen bien hasta el 99');
  await conNivel(0);

  // 2. ¿con qué letra empieza?
  let r = await L.pide(p, 'inicial', ''); await p.waitForTimeout(300);
  ok(r.kind === 'inicial' && r.opts.length === 3 && r.opts.includes(r.L) && r.opts.every(l => 'AEIOUMPLSD'.includes(l)), `letra inicial: «${r.pal}», con las opciones ${r.opts.join(' ')}`);
  ok(await J(() => !!document.querySelector('#retoIco canvas.dibujo') && document.querySelectorAll('#retoOpc .opc').length === 3), 'la cabecera enseña el dibujo y tres letras');
  ok((await dicho()).includes(`¿Con qué letra empieza ${r.pal}?`), 'la voz pregunta: ' + (await dicho()).pop());
  await p.screenshot({ path: `${L.CAP}/lectura-inicial.png`, clip: { x: 0, y: 0, width: 1024, height: 230 } });
  const malas = r.opts.filter(l => l !== r.L);
  await p.evaluate(v => window.__juego.elige(v), malas[0]); await p.waitForTimeout(150); ok((await dicho()).some(t => /Esa es la .+\. Escucha bien/.test(t)), 'al fallar explica qué letra es y repite la palabra');
  await p.evaluate(v => window.__juego.elige(v), malas[1]); await p.waitForTimeout(150);
  ok(await p.evaluate(v => [...document.querySelectorAll('#retoOpc .opc.pista')].map(e => e.dataset.v).join('') === v, r.L) && (await dicho()).some(t => /empieza por la .+\. Toca la/.test(t)), 'a la segunda da la pista: marca la letra y lo dice');
  await p.evaluate(v => window.__juego.elige(v), r.L); await p.waitForTimeout(300);
  ok(await L.starsN(p) === 1 && (await dicho()).some(t => new RegExp(`empieza por la`).test(t) && /Lo has conseguido/.test(t)), 'al acertar gana la estrella: ' + (await dicho()).filter(t => /Lo has conseguido/.test(t)).pop());
  await p.waitForTimeout(4500);

  // 3. sílabas
  r = await L.pide(p, 'silaba', 'inicial'); await p.waitForTimeout(300);
  ok(r.kind === 'silaba' && r.opts.length === 4 && 'MPLSD'.includes(r.sil[0]) && 'AEIOU'.includes(r.sil[1]), `sílaba: «${r.sil}», con las opciones ${r.opts.join(' ')}`);
  ok(await J(() => document.getElementById('retoEq').textContent) === '??', 'se ven dos huecos');
  await p.evaluate(v => window.__juego.elige(v), r.sil[1]); await p.waitForTimeout(150); ok((await dicho()).some(t => /Esa va después/.test(t)), 'si empieza por la vocal, la voz dice que esa va después');
  await p.evaluate(v => window.__juego.elige(v), r.sil[0]); await p.waitForTimeout(150); ok(await J(() => document.getElementById('retoEq').textContent) === r.sil[0] + '?', 'con la primera letra se rellena el primer hueco');
  await p.screenshot({ path: `${L.CAP}/lectura-silaba.png`, clip: { x: 0, y: 0, width: 1024, height: 230 } });
  await p.evaluate(v => window.__juego.elige(v), r.sil[1]); await p.waitForTimeout(300);
  ok(await L.starsN(p) === 2 && await J(() => document.getElementById('retoEq').textContent) === r.sil, 'con la segunda se completa y gana: ' + (await dicho()).filter(t => /Lo has conseguido/.test(t)).pop());
  await p.waitForTimeout(4500);

  // 4. decenas
  const antes = await J(() => window.__juego.grid().filter(v => v).length);
  r = await L.pide(p, 'decenas', 'silaba'); await L.quieta(p);
  const hay = await J(() => window.__juego.grid().filter(v => v).length) - antes;
  ok(r.kind === 'decenas' && hay === r.t && r.t >= 11 && r.t <= 29 && r.opts.includes(r.t) && r.opts.length === 3, `decenas: hay ${hay} bloques (${r.dz} filas de diez y ${r.u} sueltos); opciones ${r.opts.join(' ')}`);
  await p.screenshot({ path: `${L.CAP}/lectura-decenas.png` });
  const otros = r.opts.filter(v => v !== r.t);
  await p.evaluate(v => window.__juego.elige(v), otros[0]); await p.waitForTimeout(150); await p.evaluate(v => window.__juego.elige(v), otros[1]); await p.waitForTimeout(150);
  ok((await dicho()).some(t => /^Mira: diez/.test(t) && /Toca el/.test(t)), 'a la segunda cuenta de diez en diez: ' + (await dicho()).filter(t => /^Mira: diez/.test(t)).pop());
  await p.evaluate(v => window.__juego.elige(v), r.t); await p.waitForTimeout(300);
  ok(await L.starsN(p) === 3 && (await dicho()).some(t => /(Un diez|dieces).*: /.test(t)), 'al acertar: ' + (await dicho()).filter(t => /Lo has conseguido/.test(t)).pop());
  await p.waitForTimeout(4700); ok(await J(() => window.__juego.grid().filter(v => v).length) === antes, 'al cerrarse, las filas desaparecen del cielo');

  // 5. palabras con sus letras: se escribe una entera, letra a letra
  let palabra = '', letras = [], ultimo = 'decenas', acabada = false;
  for (let k = 0; k < 14 && !acabada; k++) {
    await p.evaluate(() => { window.__azar = Math.random; });
    r = await L.pide(p, 'letra', ultimo); ultimo = 'letra';
    if (r.kind === 'letra' && r.auto) { if (!palabra) palabra = r.pal; letras.push(r.L); await L.quieta(p); await p.click('#b10');
      for (const g of r.ghost) await L.tapCell(p, null, null, g.x, g.y); await p.waitForTimeout(400);
      acabada = (await dicho()).some(t => /entera!/.test(t)); await p.waitForTimeout(4400); }
    else { await p.click('#rClose'); await p.waitForTimeout(150); }
    const q = await L.pide(p, 'pon', ultimo); ultimo = q.kind; await p.click('#rClose'); await p.waitForTimeout(150);
  }
  ok(!!palabra && [...palabra].every(c => 'AEIOUMPLSDÁ'.includes(c)), `sale una palabra hecha con sus letras: ${palabra}`);
  ok(acabada && letras.join('') === palabra.normalize('NFD').replace(/[̀-ͯ]/g, ''), `se escribe letra a letra (${letras.join(', ')}) y al acabar la voz lo celebra: ` + (await dicho()).filter(t => /entera!/.test(t)).pop());
  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
})();
