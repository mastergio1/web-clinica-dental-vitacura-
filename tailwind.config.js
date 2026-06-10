/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts}'],
  theme: {
    extend: {
      // ── PALETA DE MARCA ──────────────────────────────────────────
      // Cámbiala aquí para reestilizar todo el sitio de una sola vez.
      colors: {
        marfil: '#FAF7F2',   // fondo base, crema cálido
        'marfil-2': '#F2ECE2', // marfil un punto más oscuro para bloques
        tinta: '#13294B',    // azul profundo: texto y acentos
        'tinta-soft': '#2A4570',
        dorado: '#C9A86A',   // dorado suave: solo detalles finos
        'dorado-soft': '#E3D2AD',
      },
      fontFamily: {
        // Serif elegante para titulares · Sans humanista para texto.
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        contenido: '1180px',
      },
      letterSpacing: {
        ancho: '0.18em',
      },
      transitionTimingFunction: {
        suave: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
