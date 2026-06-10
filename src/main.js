import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ¿El usuario prefiere menos movimiento? Si es así, desactivamos
// smooth scroll y animaciones de scroll (requisito de accesibilidad).
const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ════════════════════════════════════════════════════════════════
   1 · SMOOTH SCROLL (Lenis) + sincronía con GSAP ScrollTrigger
   ════════════════════════════════════════════════════════════════ */
let lenis = null;
if (!prefiereMenosMovimiento) {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ════════════════════════════════════════════════════════════════
   2 · NAVEGACIÓN: fondo al hacer scroll, menú móvil y anclas suaves
   ════════════════════════════════════════════════════════════════ */
const nav = document.getElementById('nav');
const onScrollNav = () => {
  const y = window.scrollY;
  nav.classList.toggle('bg-marfil/85', y > 40);
  nav.classList.toggle('backdrop-blur', y > 40);
  nav.classList.toggle('shadow-sm', y > 40);
  nav.classList.toggle('shadow-tinta/5', y > 40);
};
onScrollNav();
window.addEventListener('scroll', onScrollNav, { passive: true });

// Menú móvil
const menuToggle = document.getElementById('menu-toggle');
const menuMovil = document.getElementById('menu-movil');
menuToggle?.addEventListener('click', () => {
  const abierto = menuMovil.classList.toggle('hidden') === false;
  menuToggle.setAttribute('aria-expanded', String(abierto));
});

// Anclas con scroll suave (vía Lenis cuando está disponible)
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id.length <= 1) return;
    const destino = document.querySelector(id);
    if (!destino) return;
    e.preventDefault();
    menuMovil?.classList.add('hidden'); // cierra menú móvil
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (lenis) {
      lenis.scrollTo(destino, { offset: -70 });
    } else {
      destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ════════════════════════════════════════════════════════════════
   3 · ANIMACIONES DE ENTRADA (IntersectionObserver, ligero)
   ════════════════════════════════════════════════════════════════ */
if (!prefiereMenosMovimiento) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sutil entre elementos hermanos visibles a la vez.
          entry.target.style.transitionDelay = `${Math.min(i * 60, 240)}ms`;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );
  document
    .querySelectorAll('.reveal, .tl-item, .esp-card, .valor-card, .trust-item')
    .forEach((el) => io.observe(el));
} else {
  document
    .querySelectorAll('.reveal, .tl-item, .esp-card, .valor-card, .trust-item')
    .forEach((el) => el.classList.add('is-visible'));
}

/* ════════════════════════════════════════════════════════════════
   4 · TIMELINE "50 AÑOS" — animación dirigida por scroll (GSAP)
   La línea dorada se "dibuja" a medida que avanzas por la sección.
   ════════════════════════════════════════════════════════════════ */
if (!prefiereMenosMovimiento) {
  const progreso = document.getElementById('timeline-progress');
  const timeline = document.getElementById('timeline');
  if (progreso && timeline) {
    gsap.to(progreso, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: timeline,
        start: 'top 65%',
        end: 'bottom 75%',
        scrub: 0.6,
      },
    });
  }

  // Parallax muy sutil del arte de cada década.
  gsap.utils.toArray('.tl-art').forEach((art) => {
    gsap.fromTo(
      art,
      { y: 26 },
      {
        y: -26,
        ease: 'none',
        scrollTrigger: {
          trigger: art,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
}

/* ════════════════════════════════════════════════════════════════
   5 · CARRUSEL DE TESTIMONIOS (placeholder)
   ════════════════════════════════════════════════════════════════ */
(() => {
  const slides = document.getElementById('testi-slides');
  if (!slides) return;
  const total = slides.children.length;
  const dotsWrap = document.getElementById('testi-dots');
  let actual = 0;

  // Genera los puntos indicadores
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.className = 'h-1.5 w-1.5 rounded-full bg-marfil/30 transition-all';
    dotsWrap?.appendChild(dot);
  }
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

  const render = () => {
    slides.style.transform = `translateX(-${actual * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('bg-dorado', i === actual);
      d.classList.toggle('w-4', i === actual);
      d.classList.toggle('bg-marfil/30', i !== actual);
    });
  };
  const ir = (n) => { actual = (n + total) % total; render(); };

  document.getElementById('testi-next')?.addEventListener('click', () => ir(actual + 1));
  document.getElementById('testi-prev')?.addEventListener('click', () => ir(actual - 1));
  render();

  // Auto-avance (se pausa si el usuario prefiere menos movimiento)
  if (!prefiereMenosMovimiento) {
    let timer = setInterval(() => ir(actual + 1), 6000);
    slides.parentElement?.addEventListener('mouseenter', () => clearInterval(timer));
    slides.parentElement?.addEventListener('mouseleave', () => {
      timer = setInterval(() => ir(actual + 1), 6000);
    });
  }
})();

/* ════════════════════════════════════════════════════════════════
   6 · FORMULARIO DE AGENDA (demo: simula el envío, sin backend)
   ════════════════════════════════════════════════════════════════ */
(() => {
  const form = document.getElementById('form-agenda');
  if (!form) return;
  const exito = document.getElementById('form-exito');
  const label = form.querySelector('.btn-label');
  const spinner = form.querySelector('.btn-spinner');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validación mínima en cliente
    let valido = true;
    form.querySelectorAll('[required]').forEach((campo) => {
      const ok = campo.value.trim() !== '' && (campo.type !== 'email' || /.+@.+\..+/.test(campo.value));
      campo.classList.toggle('invalido', !ok);
      if (!ok) valido = false;
    });
    if (!valido) return;

    // Simula "enviando..."
    spinner?.classList.remove('hidden');
    label.textContent = 'Enviando…';
    submitBtn.disabled = true;

    setTimeout(() => {
      spinner?.classList.add('hidden');
      submitBtn.classList.add('hidden');
      form.reset();
      exito?.classList.remove('hidden');
      exito?.classList.add('flex');
      // Animación de aparición del mensaje de éxito
      if (!prefiereMenosMovimiento && exito) {
        gsap.fromTo(exito, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      }
    }, 1100);
  });
})();

/* ════════════════════════════════════════════════════════════════
   7 · DIENTE MOLAR 3D DEL HERO
   Extrusión por capas (marfil → dorado → tinta) generada en runtime.
   Flota, brilla y gira en 3D siguiendo el cursor. Decorativo.
   ════════════════════════════════════════════════════════════════ */
(() => {
  const scene = document.getElementById('tooth3d-scene');
  if (!scene) return;

  // Contorno del molar (corona + dos raíces) en viewBox 100×120.
  const TOOTH_PATH =
    'M50 8 C33 8 20 19 20 38 C20 52 25 60 27 74 C28 84 29 112 37 112 ' +
    'C43 112 45 90 50 86 C55 90 57 112 63 112 C71 112 72 84 73 74 ' +
    'C75 60 80 52 80 38 C80 19 67 8 50 8 Z';

  // Paleta de marca para la extrusión (de atrás hacia adelante).
  const TINTA = [19, 41, 75];     // profundidad
  const DORADO = [201, 168, 106]; // pared dorada
  const MARFIL = [250, 247, 242]; // esmalte frontal
  const lerp = (a, b, t) => Math.round(a + (b - a) * t);
  const mix = (c1, c2, t) => `rgb(${lerp(c1[0], c2[0], t)},${lerp(c1[1], c2[1], t)},${lerp(c1[2], c2[2], t)})`;

  const LAYERS = 20;     // nº de "rebanadas" del extruido
  const DEPTH = 60;      // profundidad total en px (translateZ)
  const SVGNS = 'http://www.w3.org/2000/svg';

  for (let i = 0; i < LAYERS; i++) {
    const t = i / (LAYERS - 1);          // 0 = atrás, 1 = frente
    const z = -DEPTH + t * DEPTH;        // de -DEPTH a 0

    // Color: atrás tinta → dorado (60%) → marfil al frente.
    const color = t < 0.6 ? mix(TINTA, DORADO, t / 0.6) : mix(DORADO, MARFIL, (t - 0.6) / 0.4);
    const isFront = i === LAYERS - 1;

    const layer = document.createElement('div');
    layer.className = 'tooth3d__layer';
    layer.style.transform = `translateZ(${z.toFixed(1)}px)`;

    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 120');
    const p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('d', TOOTH_PATH);
    p.setAttribute('fill', color);
    if (isFront) {
      p.setAttribute('stroke', 'rgba(201,168,106,0.9)');
      p.setAttribute('stroke-width', '1.5');
    }
    svg.appendChild(p);
    layer.appendChild(svg);
    scene.appendChild(layer);
  }

  // Brillo especular al frente del esmalte.
  const shine = document.createElement('div');
  shine.className = 'tooth3d__shine';
  shine.style.transform = `translateZ(${(DEPTH * 0).toFixed(1)}px)`;
  scene.appendChild(shine);

  // ── Giro 3D: leve auto-giro (idle) + seguimiento del cursor ──
  if (prefiereMenosMovimiento) {
    scene.style.setProperty('--rx', '-8deg');
    scene.style.setProperty('--ry', '-20deg');
    return;
  }

  let targetRx = -6, targetRy = -16; // reposo apuntando ligeramente a la izq.
  let curRx = targetRx, curRy = targetRy;
  let pointerActive = false;

  window.addEventListener(
    'pointermove',
    (e) => {
      pointerActive = true;
      const nx = e.clientX / window.innerWidth - 0.5;   // -0.5 … 0.5
      const ny = e.clientY / window.innerHeight - 0.5;
      targetRy = nx * 38;        // gira hasta ±19°
      targetRx = -ny * 26;       // inclina hasta ±13°
    },
    { passive: true }
  );

  const start = performance.now();
  const tick = (now) => {
    // Sin cursor, oscila suavemente solo (vida propia).
    if (!pointerActive) {
      const s = (now - start) / 1000;
      targetRy = -16 + Math.sin(s * 0.6) * 12;
      targetRx = -6 + Math.cos(s * 0.5) * 6;
    }
    curRx += (targetRx - curRx) * 0.06;  // suavizado
    curRy += (targetRy - curRy) * 0.06;
    scene.style.setProperty('--rx', `${curRx.toFixed(2)}deg`);
    scene.style.setProperty('--ry', `${curRy.toFixed(2)}deg`);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();

/* ════════════════════════════════════════════════════════════════
   8 · Año dinámico en el footer
   ════════════════════════════════════════════════════════════════ */
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
