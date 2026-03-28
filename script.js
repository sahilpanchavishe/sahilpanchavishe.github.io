/* ═══════════════════════════════════════════
   SCROLL-TRIGGERED REVEALS
═══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

/* ═══════════════════════════════════════════
   NAVBAR — scroll state + hamburger
═══════════════════════════════════════════ */
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Scroll shadow
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Mobile menu toggle
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ═══════════════════════════════════════════
   ACTIVE NAV LINK HIGHLIGHT (scroll spy)
═══════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach((link) => {
          const href = link.getAttribute('href').replace('#', '');
          link.style.color = href === id
            ? 'var(--text-primary)'
            : '';
          link.style.fontWeight = href === id ? '500' : '';
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach((section) => sectionObserver.observe(section));

/* ═══════════════════════════════════════════
   TREK IMAGE ERROR HANDLER
   (shows error label when img fails)
═══════════════════════════════════════════ */
document.querySelectorAll('.trek-img').forEach((img) => {
  img.addEventListener('error', () => {
    img.classList.add('img-error');
    const label = img.nextElementSibling;
    if (label && label.classList.contains('trek-img-error-label')) {
      label.textContent = img.alt || img.src.split('/').pop();
    }
  });
});

/* ═══════════════════════════════════════════
   SMOOTH SCROLL POLYFILL (for older iOS)
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
