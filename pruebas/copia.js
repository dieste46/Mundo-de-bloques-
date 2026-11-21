// Copia de seguridad: exportar, importar con confirmación, copias que no valen, y que el juego funciona servido desde la raíz y sin conexión.
const L = require('./lib');
const fs = require('fs'), path = require('path');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, ctx, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 1 });
  await L.fresh(p);
  let aceptar = true; const avisos = [];
  p.on('dialog', async d => { const m = /(\d+) × (\d+)/.exec(d.message()); if (m) return d.accept(String(m[1] * m[2])); avisos.push(d.message()); return aceptar ? d.accept() : d.dismiss(); });
  const abre = async () => { await p.click('#vozBtn'); await p.waitForTimeout(250); await p.click('#copiaBtn'); await p.waitForTimeout(250); };
  const msg = () => p.evaluate(() => document.getElementById('copiaMsg').textContent);
  const guardado = () => p.evaluate(() => JSON.parse(localStorage.getItem('bloques2')));

  // 1. se juega un poco: dos bloques de oro, un reto ganado (una estrella) y una palabra de la semana
  await L.startKind(p, 'pon'); await L.quieta(p);
  const r = await p.evaluate(() => { const q = window.__juego.retoFull(); return { b: q.b, n: q.n }; });
  await p.click('#b' + r.b); for (const h of await L.huecos(p, r.n, 1)) await L.tapCell(p, null, null, h[0], h[1]);
  await p.waitForTimeout(4800);
  await p.evaluate(() => localStorage.setItem('bloquesPalabra', JSON.stringify({ txt: 'PATO', i: 2 })));
  const antes = await guardado(); ok(antes.stars === 1, 'hay una partida con una estrella');

  // 2. exportar
  ok(await p.evaluate(() => typeof Guardado === 'object' && ['cargar', 'guardar', 'exportar', 'importar'].every(f => typeof Guardado[f] === 'function')), 'el módulo Guardado tiene cargar, guardar, exportar e importar');
  await abre(); ok(await p.evaluate(() => !document.getElementById('copia').hidden), 'Ajustes > Copia de seguridad abre el panel (tras la multiplicación)');
  const texto = await p.evaluate(() => document.getElementById('copiaSal').value), c = JSON.parse(texto);
  ok(c.formato === 'mundobloque' && c.version === 2 && !isNaN(new Date(c.exportado)), `la copia dice su formato y versión: ${c.formato} v${c.version}, ${c.exportado}`);
  ok(c.juego.stars === 1 && c.juego.mundos.filter(Boolean).length === 1 && c.juego.mundos[c.juego.mundo].grid.length === L.COLS * L.ROWS, 'lleva el mundo, las estrellas y los niveles');
  ok(c.palabra.txt === 'PATO' && c.uso && c.uso.v === 1 && !('voz' in c), 'lleva la palabra y los contadores, y no los ajustes de voz');
  ok(texto.length < 40000, `ocupa ${(texto.length / 1024).toFixed(1)} KB de texto`);
  const [bajada] = await Promise.all([p.waitForEvent('download'), p.click('#copiaArchivo')]);
  ok(/^mundobloque-\d{4}-\d\d-\d\d\.json$/.test(bajada.suggestedFilename()), 'Guardar archivo descarga ' + bajada.suggestedFilename());
  const archivo = path.join(L.CAP, 'copia.json'); await bajada.saveAs(archivo);
  ok(fs.readFileSync(archivo, 'utf8') === texto, 'y el archivo es la misma copia');
  await p.click('#copiaCopiar'); await p.waitForTimeout(200); ok(/Copiada|Mantén/.test(await msg()), 'Copiar responde: ' + await msg());
  await p.screenshot({ path: `${L.CAP}/copia-panel.png` });

  // 3. "otro aparato": se borra todo, sale un mundo nuevo sin estrellas, y se importa la copia
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(500);
  ok((await guardado()).stars === 0, 'en un aparato vacío empieza de cero');
  await abre();
  // copias que no valen
  for (const [malo, dice] of [['hola', /no es una copia válida/], ['{"a":1}', /no es una copia de Mundo de Bloques/], [JSON.stringify({ ...c, version: 99 }), /versión más nueva/], [JSON.stringify({ formato: 'mundobloque', version: 1, juego: { mundos: [null, null, null] } }), /ningún mundo/]]) {
    await p.fill('#copiaEnt', malo); await p.click('#copiaImportar'); await p.waitForTimeout(150);
    ok(dice.test(await msg()), 'rechaza una copia mala: ' + await msg());
  }
  ok((await guardado()).stars === 0 && avisos.length === 0, 'y no toca nada ni pregunta');
  // decir que no
  aceptar = false; await p.fill('#copiaEnt', texto); await p.click('#copiaImportar'); await p.waitForTimeout(300);
  ok(avisos.length === 1 && /SUSTITUYE/.test(avisos[0]) && /1 mundo y 1 estrella/.test(avisos[0]), 'antes de importar pregunta, diciendo qué trae: ' + avisos[0].split('\n')[0]);
  ok((await guardado()).stars === 0 && /No se ha importado/.test(await msg()), 'si se dice que no, no cambia nada');
  // desde archivo, y decir que sí
  aceptar = true; await p.fill('#copiaEnt', ''); await p.setInputFiles('#copiaFile', archivo); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.getElementById('copiaEnt').value) === texto, 'Elegir archivo lee la copia');
  await p.click('#copiaImportar'); await p.waitForTimeout(1800);
  const tras = await guardado();
  ok(tras.stars === 1 && JSON.stringify(tras.mundos[tras.mundo].grid) === JSON.stringify(antes.mundos[antes.mundo].grid), 'tras confirmar, el juego recarga con el mundo y las estrellas de la copia');
  ok(JSON.stringify(tras.niv) === JSON.stringify(antes.niv) && await p.evaluate(() => JSON.parse(localStorage.getItem('bloquesPalabra')).txt) === 'PATO', 'y con sus niveles y su palabra');
  ok(await L.starsN(p) === 1, 'el contador de estrellas en pantalla también');
  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();

  // 4. servido desde la raíz, con service worker: se instala, guarda lo necesario y el juego abre sin conexión
  const s = await L.open({ width: 800, height: 600 }, { sw: true });
  await s.p.evaluate(() => navigator.serviceWorker.ready); await s.p.waitForTimeout(800);
  const cache = await s.p.evaluate(async () => { const ks = await caches.keys(), c = await caches.open(ks[0]), rs = await c.keys(); return { ks, rutas: rs.map(q => new URL(q.url).pathname) }; });
  ok(cache.ks.length === 1 && /^bloques-v\d+$/.test(cache.ks[0]), 'el service worker crea su caché: ' + cache.ks.join(', '));
  ok(cache.rutas.includes('/') && cache.rutas.includes('/guardado.js') && !cache.rutas.includes('/index.html'), 'con la página como "/" y guardado.js: ' + cache.rutas.join(' '));
  ok(await s.p.evaluate(() => navigator.serviceWorker.controller && new URL(navigator.serviceWorker.controller.scriptURL).pathname) === '/sw.js', 'registrado en la raíz');
  await s.ctx.setOffline(true); await s.p.reload(); await s.p.waitForTimeout(900);
  ok(await s.p.evaluate(() => typeof Guardado === 'object' && !!window.__juego && document.querySelectorAll('#blocks .slot').length > 10), 'sin conexión, el juego abre entero desde la caché');
  ok(!s.errs.filter(e => !/ERR_INTERNET_DISCONNECTED|Failed to load resource/.test(e)).length, 'sin errores' + (s.errs.length ? ' (' + s.errs.length + ' avisos de red esperados)' : ''));
  await s.b.close();
})();
