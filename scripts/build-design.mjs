// ─────────────────────────────────────────────────────────────────────
//  build-design.mjs
//  Genera un ÚNICO archivo HTML autónomo y EDITABLE pensado para pegar
//  en el entorno de diseño de Claude (https://claude.ai/design) o en un
//  Artifact. A diferencia de preview.html (bundle minificado), este usa
//  Tailwind / GSAP / Lenis por CDN y mantiene el CSS y JS legibles.
//
//  Uso:  npm run design   →   genera  clinica-vitacura.design.html
// ─────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

let html = readFileSync(join(root, 'index.html'), 'utf8');
let css = readFileSync(join(root, 'src', 'style.css'), 'utf8');
let js = readFileSync(join(root, 'src', 'main.js'), 'utf8');

// 1) El CSS: quitar las directivas @tailwind (Play CDN las inyecta solo).
css = css.replace(/^\s*@tailwind[^;]*;\s*$/gm, '').trim();

// 2) El JS: cambiar imports de módulo por los globales que exponen los CDN.
js = js.replace(
  /import\s+'\.\/style\.css';\s*[\r\n]+import\s+Lenis\s+from\s+'lenis';\s*[\r\n]+import\s+\{\s*gsap\s*\}\s+from\s+'gsap';\s*[\r\n]+import\s+\{\s*ScrollTrigger\s*\}\s+from\s+'gsap\/ScrollTrigger';/,
  `// Librerías cargadas por CDN (ver <head> / antes de </body>)\n` +
    `const { gsap, Lenis } = window;\n` +
    `const { ScrollTrigger } = window;`
);

// 3) Config de Tailwind (espejo de tailwind.config.js) para el Play CDN.
const headInject = `
  <!-- ── Tailwind (Play CDN) + paleta de marca ── -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            marfil: '#FAF7F2', 'marfil-2': '#F2ECE2',
            tinta: '#13294B', 'tinta-soft': '#2A4570',
            dorado: '#C9A86A', 'dorado-soft': '#E3D2AD',
          },
          fontFamily: {
            serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
            sans: ['Inter', 'system-ui', 'sans-serif'],
          },
          maxWidth: { contenido: '1180px' },
          letterSpacing: { ancho: '0.18em' },
          transitionTimingFunction: { suave: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        },
      },
    };
  </script>
  <!-- Estilos del proyecto (Play CDN procesa @apply y theme() aquí dentro) -->
  <style type="text/tailwindcss">
${css}
  </style>
</head>`;

html = html.replace('</head>', headInject);

// 4) Reemplazar el <script type="module" src="/src/main.js"> por CDNs + JS inline.
const bodyInject = `  <!-- ── Librerías de animación por CDN ── -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>
  <script>
${js}
  </script>`;

html = html.replace(/<script type="module" src="\/src\/main\.js"><\/script>/, bodyInject);

// Aviso si algo no se reemplazó (evita entregar un archivo roto).
if (html.includes('/src/main.js')) throw new Error('No se reemplazó el <script> de main.js');
if (/@tailwind/.test(html)) throw new Error('Quedaron directivas @tailwind sin limpiar');

const out = join(root, 'clinica-vitacura.design.html');
writeFileSync(out, html);
console.log(`✓ clinica-vitacura.design.html generado (${(html.length / 1024).toFixed(1)} KB)`);
