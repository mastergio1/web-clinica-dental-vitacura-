// ─────────────────────────────────────────────────────────────────────
//  build-preview.mjs
//  Toma el resultado de `vite build` (carpeta dist/) y genera un único
//  archivo `preview.html` autónomo: el CSS y el JS quedan incrustados,
//  de modo que se puede abrir con doble clic en cualquier navegador
//  sin servidor. Las fuentes de Google se cargan por internet.
//
//  Uso:  npm run preview   (corre vite build y luego este script)
// ─────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

let html = readFileSync(join(dist, 'index.html'), 'utf8');
const assets = readdirSync(join(dist, 'assets'));
const cssFile = assets.find((f) => f.endsWith('.css'));
const jsFile = assets.find((f) => f.endsWith('.js'));
const css = readFileSync(join(dist, 'assets', cssFile), 'utf8');
const js = readFileSync(join(dist, 'assets', jsFile), 'utf8');

// Tags exactos que produce Vite en dist/index.html
const jsTag = `<script type="module" crossorigin src="/assets/${jsFile}"></script>`;
const cssTag = `<link rel="stylesheet" crossorigin href="/assets/${cssFile}">`;

if (!html.includes(jsTag)) throw new Error('No se encontró el <script> del bundle JS en dist/index.html');
if (!html.includes(cssTag)) throw new Error('No se encontró el <link> del bundle CSS en dist/index.html');

html = html.replace(cssTag, `<style>\n${css}\n</style>`);
// Reemplazo con función: evita que los `$` del JS minificado (GSAP) se interpreten.
html = html.replace(jsTag, () => `<script type="module">\n${js}\n</script>`);

writeFileSync(join(root, 'preview.html'), html);

const remaining = (html.match(/\/assets\/index-/g) || []).length;
console.log(`✓ preview.html generado (${(html.length / 1024).toFixed(1)} KB)`);
if (remaining > 0) {
  console.warn(`⚠ Quedan ${remaining} referencias a /assets/ sin incrustar`);
  process.exit(1);
}
