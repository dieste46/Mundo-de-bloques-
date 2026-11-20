# Mundo de Bloques

Juego de construir con bloques en 2D, con retos por voz, para un niño de unos 5 años que todavía no lee. Web estática, sin dependencias ni paso de compilación. El detalle de cada función del juego está en `README.md`.

## Cómo está organizado

- `index.html`: todo el juego (HTML, CSS y un único script). Dentro del script, por este orden: texturas dibujadas por código, estado y mundo, sonido y voz, ajustes, mundos, retos, «Cómo juega» (contadores de uso), copia de seguridad, aventura, cerdito músico, reacciones y semillas, toques, y el bucle de dibujo `tick`.
- `guardado.js`: lo único que toca el almacenamiento. Interfaz: `Guardado.cargar(parte)`, `Guardado.guardar(estado, parte)`, `Guardado.exportar()` y `Guardado.importar(texto, aplicar)`.
- `sw.js` y `manifest.json`: PWA que funciona sin conexión. Al añadir un archivo al juego, ponlo en `ASSETS` de `sw.js` y sube `CACHE`.
- `pruebas/`: pruebas automáticas con Playwright y un servidor local.

## Reglas que no se rompen

- Tiene que funcionar en un iPad Air con iOS 12: sintaxis ES2018 como mucho, sin depender de Pointer Events, de `gap` en flex, de `inset` ni de `aspect-ratio`.
- El niño no lee: nada de lo que él usa depende de texto. Todo se dice por voz y se enseña con dibujos.
- Sin cronómetro, sin penalización y sin forma de perder. El error se explica y a la segunda aparece una pista.
- Lo que es para el adulto (ajustes, copia de seguridad, «Cómo juega») va detrás de la multiplicación de `puerta()`.
- Rutas siempre relativas: el juego se sirve desde la raíz, pero no debe depender de ello.
- Estilo propio: no imitar personajes, gráficos ni niveles de juegos existentes.
- Nada de datos personales en el repositorio. Los mensajes de commit y los comentarios, en español.

## Cómo probarlo

```bash
node pruebas/servidor.js
```

Sirve el juego en `http://localhost:8765/` como lo hace Cloudflare Pages (desde la raíz y redirigiendo `/index.html` a `/`). Con `?prueba` en la dirección el juego expone `window.__juego`, que es lo que usan las pruebas para mirar dentro.

```bash
node pruebas/todas.js
```

Pasa todas las pruebas; arranca el servidor si no lo está. Hace falta Playwright con Chromium y, para la comprobación de sintaxis, `acorn`. Con `SIN_PUNTERO=1` delante se simula un Safari sin eventos de puntero (iOS 12). Cada prueba se puede lanzar suelta: `node pruebas/aventura.js`.

Antes de dar un cambio por bueno: `pruebas/todas.js` en los dos modos, y probarlo en el iPad real si toca el sonido, la voz o el rendimiento, que desde aquí no se pueden comprobar.

## Publicación

Cloudflare Pages, proyecto `mundobloque`: la rama `main` se publica en `https://mundobloque.pages.dev`, sin compilación y con la raíz del repositorio como salida. Cada otra rama tiene su vista previa en `https://<rama>.mundobloque.pages.dev`, con su propio guardado. Como la salida es la raíz, todo lo que hay en el repositorio queda publicado.

Antes se publicaba en GitHub Pages; ya no. Lo guardado va por dirección web, así que lo jugado allí no aparece aquí.

## Guardado y nube

Hoy todo se guarda en el aparato, a través de `guardado.js`. El guardado se sincronizará con **mundo-api**: un Worker aparte, con D1 y código de familia, compartido con mundojoor y otros juegos. Su diseño está en `docs/PLAN.md` del repositorio mundojoor.

En este repositorio no se implementa la nube. Cuando llegue, se enchufa dentro de `guardado.js` sin cambiar su interfaz: `guardar()` sigue escribiendo en el aparato al momento (el juego funciona sin conexión) y la sincronización va por detrás. El resto del juego no debe tocar `localStorage` directamente; `pruebas/sintaxis.js` lo comprueba.

La copia de seguridad (Ajustes → Copia de seguridad) es un JSON con `formato: "mundobloque"` y `version`. Si cambia lo que se guarda, sube `VERSION` en `guardado.js` y haz que `importar` siga aceptando las versiones anteriores.
