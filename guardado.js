// Guardado: todo lo que el juego guarda pasa por aquí.
//
// Hoy vive en el almacenamiento del navegador (localStorage), en este aparato. Más adelante se sincronizará con "mundo-api"
// (un Worker aparte, con D1 y código de familia, compartido con otros juegos; su diseño está en docs/PLAN.md del repo mundojoor).
// Esa sincronización se añadirá dentro de este archivo: el juego solo conoce estas cuatro funciones y no tiene que cambiar.
//
//   Guardado.cargar(parte)            lo guardado en esa parte, o null si no hay nada (o no se puede leer)
//   Guardado.guardar(estado, parte)   lo guarda; devuelve true si ha podido
//   Guardado.exportar()               texto JSON con la copia completa (formato "mundobloque", con versión)
//   Guardado.importar(texto, aplicar) comprueba una copia; con aplicar=true la deja guardada. Devuelve {ok, error, resumen}
//
// Las partes son: 'juego' (los tres mundos, estrellas y niveles; es la de por defecto), 'palabra' (la palabra de la semana),
// 'uso' (los contadores de "Cómo juega") y 'voz' (ajustes de voz y sonido). La voz es de cada aparato: no entra en la copia.
//
// Es local e inmediato a propósito (el juego funciona sin conexión): cuando haya nube, guardar() seguirá escribiendo aquí al momento
// y la subida irá por detrás. Sin sintaxis posterior a ES2018 (iPad con iOS 12).
var Guardado = (function () {
  'use strict';
  // Versión 2: la partida guarda también cuántos huevos de estrellas se han abierto. Las copias de la versión 1 se importan igual (sin huevos abiertos).
  var FORMATO = 'mundobloque', VERSION = 2;
  var CLAVES = { juego: 'bloques2', palabra: 'bloquesPalabra', uso: 'bloquesUso', voz: 'bloquesVoz' };
  var EN_COPIA = ['juego', 'palabra', 'uso'];
  var cerrado = false; // tras importar no se escribe nada más hasta que la página se recarga, para no pisar lo importado

  function cargar(parte) {
    try { var t = localStorage.getItem(CLAVES[parte || 'juego']); return t ? JSON.parse(t) : null; } catch (e) { return null; }
  }
  function guardar(estado, parte) {
    if (cerrado) return false;
    try { localStorage.setItem(CLAVES[parte || 'juego'], JSON.stringify(estado)); return true; } catch (e) { return false; }
  }
  function exportar() {
    var copia = { formato: FORMATO, version: VERSION, exportado: new Date().toISOString() };
    EN_COPIA.forEach(function (p) { var d = cargar(p); if (d) copia[p] = d; });
    return JSON.stringify(copia);
  }
  // Lo que hay dentro de una copia, para enseñárselo al adulto antes de confirmar
  function resumen(c) {
    var j = c.juego, mundos = (j.mundos || []).filter(function (w) { return w && Array.isArray(w.grid); }).length;
    return { mundos: mundos, estrellas: j.stars | 0, exportado: typeof c.exportado === 'string' ? c.exportado : '', version: c.version };
  }
  function importar(texto, aplicar) {
    var c;
    try { c = JSON.parse(String(texto).trim()); } catch (e) { return { ok: false, error: 'El texto no es una copia válida (no se puede leer).' }; }
    if (!c || typeof c !== 'object' || c.formato !== FORMATO) return { ok: false, error: 'Esto no es una copia de Mundo de Bloques.' };
    if (typeof c.version !== 'number' || c.version < 1) return { ok: false, error: 'La copia no dice de qué versión es.' };
    if (c.version > VERSION) return { ok: false, error: 'La copia es de una versión más nueva del juego. Actualiza el juego en este aparato y vuelve a intentarlo.' };
    var j = c.juego;
    if (!j || typeof j !== 'object' || !Array.isArray(j.mundos) || !j.mundos.some(function (w) { return w && Array.isArray(w.grid) && w.grid.length > 0; }))
      return { ok: false, error: 'La copia no trae ningún mundo.' };
    var r = resumen(c);
    if (!aplicar) return { ok: true, resumen: r };
    try {
      EN_COPIA.forEach(function (p) { if (c[p] && typeof c[p] === 'object') localStorage.setItem(CLAVES[p], JSON.stringify(c[p])); else if (p !== 'juego') localStorage.removeItem(CLAVES[p]); });
    } catch (e) { return { ok: false, error: 'No se ha podido guardar en este aparato (¿sin espacio, o navegación privada?).' }; }
    cerrado = true;
    return { ok: true, resumen: r };
  }
  return { cargar: cargar, guardar: guardar, exportar: exportar, importar: importar, FORMATO: FORMATO, VERSION: VERSION };
})();
