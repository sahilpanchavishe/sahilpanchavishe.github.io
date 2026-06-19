/* ══════════════════════════════════════════
   HERO PARTICLE CANVAS
══════════════════════════════════════════ */
(function() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -9999, y: -9999 };
  const COUNT = window.innerWidth < 640 ? 50 : 110;
  const CONNECT_DIST = 130, MOUSE_DIST = 180;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - .5) * .45;
    this.vy = (Math.random() - .5) * .45;
    this.r  = Math.random() * 1.8 + .6;
    this.a  = Math.random() * .5 + .2;
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // mouse repulsion
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < MOUSE_DIST) {
        p.x += dx / d * 1.2;
        p.y += dy / d * 1.2;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,184,75,${p.a})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < CONNECT_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(232,184,75,${.18 * (1 - d / CONNECT_DIST)})`;
          ctx.lineWidth = .7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init, { passive: true });
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  init();
  draw();
})();

/* ══════════════════════════════════════════
   HERO NAME SPLIT-TEXT ANIMATION
══════════════════════════════════════════ */
window.addEventListener('load', () => {
  const heroName = document.getElementById('heroName');
  if (heroName) setTimeout(() => heroName.classList.add('animate'), 200);
});

/* ══════════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════════ */
(function() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const roles = [
    'Robotics & AI Engineer',
    'Quant Finance Analyst',
    'Full-Stack Developer',
    'VFX & Motion Editor',
    'CAT 2026 Aspirant',
  ];
  let ri = 0, ci = 0, del = false;
  function tick() {
    const word = roles[ri];
    if (!del) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { del = true; setTimeout(tick, 1800); return; }
      setTimeout(tick, 68);
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; setTimeout(tick, 380); return; }
      setTimeout(tick, 36);
    }
  }
  setTimeout(tick, 900);
})();

/* ══════════════════════════════════════════
   SCROLL PROGRESS
══════════════════════════════════════════ */
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  if (!progressBar) return;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
}, { passive: true });

/* ══════════════════════════════════════════
   NAVBAR — shadow + hamburger
══════════════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ══════════════════════════════════════════
   ACTIVE NAV SPY
══════════════════════════════════════════ */
const navSpy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.getAttribute('href').slice(1) === id);
      });
    }
  });
}, { threshold: 0.35 });
document.querySelectorAll('section[id]').forEach(s => navSpy.observe(s));

/* ══════════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ══════════════════════════════════════════
   SCROLL REVEALS
══════════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════════ */
function animateCount(el) {
  const target   = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0');
  const suffix   = el.dataset.suffix || '';
  const duration = 1600;
  const start    = performance.now();
  (function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = p < .5 ? 2*p*p : 1 - Math.pow(-2*p+2,2)/2;
    el.textContent = (ease * target).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  })(start);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); counterObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));

/* ══════════════════════════════════════════
   SKILL BARS
══════════════════════════════════════════ */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      e.target.querySelectorAll('.ef-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skills-block, .exp-feature').forEach(el => skillObs.observe(el));

/* ══════════════════════════════════════════
   VIDEO LIGHTBOX
══════════════════════════════════════════ */
const lightbox  = document.getElementById('lightbox');
const lbVideo   = document.getElementById('lbVideo');
const lbCaption = document.getElementById('lbCaption');
const lbClose   = document.getElementById('lbClose');
const lbBg      = document.getElementById('lbBackdrop');

function openLightbox(src, title) {
  lbVideo.src = src;
  if (lbCaption) lbCaption.textContent = title || '';
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lbVideo.load();
  lbVideo.play().catch(() => {});
}
function closeLightbox() {
  lbVideo.pause();
  lbVideo.src = '';
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

lbClose?.addEventListener('click', closeLightbox);
lbBg?.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

document.querySelectorAll('.reel-card').forEach(card => {
  const go = () => {
    if (card.classList.contains('no-video')) return;
    openLightbox(card.dataset.src, card.dataset.title);
  };
  card.addEventListener('click', go);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }});

  const thumb = card.querySelector('.reel-thumb');
  if (thumb) {
    card.addEventListener('mouseenter', () => { thumb.currentTime = 0; thumb.play().catch(() => {}); });
    card.addEventListener('mouseleave', () => { thumb.pause(); thumb.currentTime = 0; });
  }
});

/* ══════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════ */
(function() {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  let cx = 0, cy = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });

  (function animCursor() {
    dot.style.transform  = `translate(${cx}px,${cy}px)`;
    rx += (cx - rx) * .13;
    ry += (cy - ry) * .13;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(animCursor);
  })();

  document.querySelectorAll('a,button,.reel-card,.tg-item,.proj-card,.cert-card,.tl-card,.cr-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
})();

/* ══════════════════════════════════════════
   TREK IMAGE ERRORS
══════════════════════════════════════════ */
document.querySelectorAll('.tg-item img').forEach(img => {
  img.addEventListener('error', () => {
    img.classList.add('img-err');
    const fb = img.nextElementSibling;
    if (fb?.classList.contains('tg-fallback')) fb.style.display = 'flex';
  });
});

/* ══════════════════════════════════════════
   FOOTER YEAR
══════════════════════════════════════════ */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();
