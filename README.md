# Clínica Dental Vitacura — Sitio demo

Maqueta web **especulativa** (no oficial) para presentar a Clínica Dental Vitacura
en una reunión comercial. Construida con **Vite + HTML/CSS/JS vanilla**, **Tailwind CSS**,
**GSAP + ScrollTrigger** y **Lenis** (smooth scroll).

> Este sitio es una demostración. No es la web oficial de la clínica.

## 🚀 Cómo correrlo

```bash
npm install      # instala dependencias
npm run dev      # entorno de desarrollo (http://localhost:5173)
npm run build    # build de producción → carpeta /dist
npm run preview  # sirve el build de producción para revisarlo
```

## 🎨 Dónde cambiar cosas

| Quiero cambiar…            | Archivo                          | Dónde                                            |
|----------------------------|----------------------------------|--------------------------------------------------|
| Colores de marca           | `tailwind.config.js`             | sección `colors` (marfil / tinta / dorado)       |
| Tipografías                | `tailwind.config.js` + `index.html` | `fontFamily` y el `<link>` de Google Fonts    |
| Textos de cada sección     | `index.html`                     | cada sección está comentada y rotulada           |
| Descripciones de especialidades | `index.html`                | bloque `#especialidades` (tarjetas `.esp-card`)  |
| Décadas de la timeline     | `index.html`                     | bloque `#historia` (artículos `.tl-item`)        |
| Animaciones de scroll      | `src/main.js`                    | secciones 4 y 3                                   |
| Estilos / placeholders SVG | `src/style.css`                  | bloque "FONDOS Y PLACEHOLDERS VISUALES"          |

## 🟢 Qué es dato REAL y qué es PLACEHOLDER

**Datos reales (verificados, no tocar salvo corrección):**
- Nombre: Clínica Dental Vitacura
- Dirección: Av. Vitacura 3738, esquina Alonso de Córdova, Vitacura, Santiago
- Teléfono: +56 2 2228 8414 · WhatsApp: +56 9 9919 0394
- 8 especialidades reales
- 50+ años de trayectoria

**Placeholders (reemplazar antes de publicar):**
- 👥 **Equipo** (`#equipo`): siluetas y nombres genéricos `Dr./Dra. [Nombre]`.
  Buscar comentarios `<!-- FOTO REAL: ... -->` para las fotos profesionales.
- 💬 **Testimonios** (`#testimonios`): marcados como *"Testimonio de ejemplo"*.
  **No publicar como reales** — reemplazar con reseñas verificadas de Google/pacientes.
- 🕘 **Horarios** (`#ubicacion`): confirmar con la clínica.
- 🖼️ **Imágenes**: todas son placeholders generados con CSS/SVG. Buscar
  `<!-- FOTO REAL: ... -->` en `index.html` para ubicar dónde van las fotos reales.

## 🔌 Integración de agenda (pendiente)

El formulario de `#contacto` **simula** el envío (no hay backend). En el sitio real
se conecta con **Dentalink / AgendaPro / Reservo** para agenda online en vivo.

## ✅ Checklist de calidad incluido

- Mobile-first (probado a 375px) · WhatsApp flotante con número real
- SEO on-page: `title`, `meta description`, Open Graph, schema.org `Dentist`, un solo `<h1>`
- Accesibilidad: contraste AA, focus visible, respeta `prefers-reduced-motion`
- Performance: fuentes con `display=swap`, mapa con `loading="lazy"`, sin layout shift
