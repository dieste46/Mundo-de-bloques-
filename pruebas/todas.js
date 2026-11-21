// Pasa todas las pruebas, una detrás de otra, arrancando el servidor local si hace falta. Uso: node pruebas/todas.js
// Con SIN_PUNTERO=1 las pasa simulando un Safari sin eventos de puntero (iOS 12).
const { spawnSync } = require('child_process'), path = require('path'), { arranca, PUERTO } = require('./servidor');
const PRUEBAS = ['sintaxis', 'copia', 'ensanche', 'toques', 'tocar', 'mundo-vivo', 'vida', 'recoger', 'letras', 'huevo', 'musica', 'aventura', 'recorrido', 'uso', 'recorrer-mundos'];
(async () => {
  let servidor = null; try { servidor = await arranca(); } catch (e) { console.log('(el puerto ' + PUERTO + ' ya está en uso: se supone que es el juego)'); }
  const fallos = [];
  for (const n of PRUEBAS) {
    console.log('\n=== ' + n);
    const r = spawnSync(process.execPath, [path.join(__dirname, n + '.js')], { stdio: 'inherit', env: process.env });
    if (r.status !== 0) fallos.push(n);
  }
  console.log('\n' + (fallos.length ? 'HAN FALLADO: ' + fallos.join(', ') : 'Todas las pruebas pasan (' + PRUEBAS.length + ').'));
  if (servidor) servidor.close(); process.exit(fallos.length ? 1 : 0);
})();
