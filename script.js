/**
 * PORTFOLIO — Backend Developer
 * script.js
 * Funcionalidades: navbar, animaciones scroll, terminal, skill bars, menú mobile
 */

/* ============================================================
   1. NAVBAR — scroll y menú mobile
   ============================================================ */
(function initNavbar() {
  const navbar  = document.querySelector('.navbar');
  const toggle  = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  // Clase scrolled al bajar
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Estado inicial

  // Toggle menú mobile
  toggle?.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar al hacer click en link (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Cerrar menú al hacer click fuera
  document.addEventListener('click', (e) => {
    if (navList.classList.contains('open') &&
        !navbar.contains(e.target)) {
      navList.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Resaltar link activo según sección visible
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY  = window.scrollY + window.innerHeight * 0.35;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);

      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }
})();


/* ============================================================
   2. REVEAL ON SCROLL — IntersectionObserver
   ============================================================ */
(function initReveal() {
  const targets = document.querySelectorAll(
    '.reveal-up, .reveal-right, .reveal-fade, .section-label'
  );

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Solo animar una vez
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
})();


/* ============================================================
   3. SKILL BARS — animar al entrar en viewport
   ============================================================ */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.dataset.width || '0';
        // Pequeño retraso para que la animación sea más visible
        requestAnimationFrame(() => {
          setTimeout(() => { fill.style.width = width + '%'; }, 150);
        });
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => observer.observe(el));
})();


/* ============================================================
   4. TERMINAL TYPEWRITER — efecto de escritura en hero
   ============================================================ */
(function initTerminal() {
  const output = document.getElementById('terminal-type');
  if (!output) return;

  // Colores sintáticos inline (sin dependencias)
  const C = {
    kw:      (s) => `<span style="color:#c792ea">${s}</span>`,   // keyword
    str:     (s) => `<span style="color:#c3e88d">${s}</span>`,   // string
    fn:      (s) => `<span style="color:#82aaff">${s}</span>`,   // function
    cm:      (s) => `<span style="color:#546e7a;font-style:italic">${s}</span>`, // comment
    acc:     (s) => `<span style="color:#76da93">${s}</span>`,   // accent green
    num:     (s) => `<span style="color:#f78c6c">${s}</span>`,   // number
    ann:     (s) => `<span style="color:#ffcb6b">${s}</span>`,   // annotation
    dim:     (s) => `<span style="color:#546e7a">${s}</span>`,   // dimmed
  };

  // Contenido a escribir (líneas)
  const lines = [
    `${C.ann('@RestController')}`,
    `${C.ann('@RequestMapping')}(${C.str('"/api/developer"')})`,
    `${C.kw('public class')} ${C.acc('BackendDev')} {`,
    ``,
    `  ${C.cm('// Skills cargadas ✓')}`,
    `  ${C.kw('private')} String[] stack = {`,
    `    ${C.str('"Java 17"')}, ${C.str('"Spring Boot"')},`,
    `    ${C.str('"Docker"')}, ${C.str('"Azure"')},`,
    `    ${C.str('"REST APIs"')}, ${C.str('"JUnit 5"')}`,
    `  };`,
    ``,
    `  ${C.ann('@GetMapping')}(${C.str('"/hire"')})`,
    `  ${C.kw('public')} Response ${C.fn('hireMe')}() {`,
    `    ${C.kw('return')} Response.ok()`,
    `      .body(${C.str('"Disponible ahora"')});`,
    `  }`,
    ``,
    `}`,
    ``,
    `${C.dim('// Compilado exitosamente ✓')}`,
  ];

  // Aplanar líneas en caracteres (con marcas HTML preservadas)
  // Escribimos línea a línea con retraso
  let lineIndex = 0;
  const LINE_DELAY  = 80;   // ms entre líneas
  const CHAR_DELAY  = 22;   // ms entre caracteres

  function typeLine(line, cb) {
    // Separar el HTML de los caracteres visibles para no escribir tags char a char
    // Simplificación: insertar líneas completas con fade-in
    const span = document.createElement('span');
    span.style.opacity = '0';
    span.style.transition = 'opacity 0.18s ease';
    span.innerHTML = line + '\n';
    output.appendChild(span);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        span.style.opacity = '1';
        setTimeout(cb, CHAR_DELAY * Math.max(1, stripTags(line).length * 0.4));
      });
    });
  }

  function stripTags(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  function typeNext() {
    if (lineIndex >= lines.length) return;
    typeLine(lines[lineIndex], () => {
      lineIndex++;
      setTimeout(typeNext, LINE_DELAY);
    });
  }

  // Iniciar con un pequeño delay
  setTimeout(typeNext, 900);
})();


/* ============================================================
   5. AÑO EN FOOTER
   ============================================================ */
(function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ============================================================
   6. SMOOTH SCROLL OFFSET — compensar navbar fija
   ============================================================ */
(function initSmoothScrollOffset() {
  const NAV_H = 70; // mismo que --nav-h en CSS

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   7. STAGGER para tool-tags (efecto entrada escalonada)
   ============================================================ */
(function initToolTagsStagger() {
  const tags = document.querySelectorAll('.tool-tag');
  tags.forEach((tag, i) => {
    tag.style.setProperty('--delay', `${0.05 + i * 0.05}s`);
    tag.classList.add('reveal-up');
  });

  // Re-observar (el IntersectionObserver ya los tomará)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  tags.forEach(el => observer.observe(el));
})();