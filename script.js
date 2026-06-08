/* =========================================
   INDUSHREE S ACHAR — Portfolio JavaScript
   Particles · Typed · Tilt · Scroll · Glow
   ========================================= */

'use strict';

/* ──────────────────────────────────────────
   1. MOUSE GLOW TRACKER
   ────────────────────────────────────────── */
(function initMouseGlow() {
  const glow = document.getElementById('mouse-glow');
  if (!glow) return;
  let raf;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animate() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    raf = requestAnimationFrame(animate);
  }
  animate();
})();


/* ──────────────────────────────────────────
   2. PARTICLES BACKGROUND
   ────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };
  const COUNT = 80;
  const COLORS = ['#a855f7', '#3b82f6', '#06b6d4', '#8b5cf6', '#2dd4bf'];
  const CONNECTION_DIST = 140;
  const MOUSE_DIST = 120;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.02 + Math.random() * 0.02;
    }
    update() {
      this.pulse += this.pulseSpeed;
      this.x += this.vx;
      this.y += this.vy;
      /* mouse repel */
      if (mouse.x !== null) {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.8;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
      }
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    }
    draw() {
      const pulseAlpha = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.save();
      ctx.globalAlpha = pulseAlpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.25;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].color;
          ctx.lineWidth = 0.6;
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ──────────────────────────────────────────
   3. TYPED TEXT EFFECT
   ────────────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'AI Enthusiast',
    'Web Developer',
    'Data Science Learner',
    'ML Explorer',
    'Problem Solver',
  ];

  let phraseIdx = 0, charIdx = 0, isDeleting = false;
  const SPEED_TYPE  = 80;
  const SPEED_DEL   = 45;
  const PAUSE_FULL  = 2000;
  const PAUSE_EMPTY = 400;

  function tick() {
    const current = phrases[phraseIdx];
    if (!isDeleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE_FULL);
        return;
      }
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, PAUSE_EMPTY);
        return;
      }
    }
    setTimeout(tick, isDeleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(tick, 800);
})();


/* ──────────────────────────────────────────
   4. STICKY NAVBAR + ACTIVE LINK
   ────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const links     = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  });

  hamburger && hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    hamburger.classList.toggle('open');
    if (hamburger.classList.contains('open')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close menu on nav link click (mobile)
  links.forEach(l => l.addEventListener('click', () => {
    navLinks.classList.remove('open');
    if (hamburger.classList.contains('open')) {
      hamburger.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }));
})();


/* ──────────────────────────────────────────
   5. SCROLL-TRIGGERED AOS ANIMATIONS
   ────────────────────────────────────────── */
(function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay || 0;
        setTimeout(() => entry.target.classList.add('aos-animate'), parseInt(delay));
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────
   6. SKILL BAR ANIMATIONS
   ────────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.dataset.width + '%';
        setTimeout(() => { fill.style.width = width; }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(f => observer.observe(f));
})();


/* ──────────────────────────────────────────
   7. 3D TILT CARD EFFECT
   ────────────────────────────────────────── */
(function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  const MAX_TILT = 12;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * MAX_TILT;
      const rotY =  dx * MAX_TILT;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
      card.style.transition = 'transform 0.1s ease';

      // Glare
      let glare = card.querySelector('.tilt-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'tilt-glare';
        glare.style.cssText = `
          position:absolute;inset:0;border-radius:inherit;pointer-events:none;
          background:radial-gradient(circle at ${((dx+1)/2)*100}% ${((dy+1)/2)*100}%,
            rgba(255,255,255,0.08) 0%, transparent 60%);
          transition:background 0.1s ease;z-index:10;
        `;
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(glare);
      } else {
        glare.style.background = `radial-gradient(circle at ${((dx+1)/2)*100}% ${((dy+1)/2)*100}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
      const glare = card.querySelector('.tilt-glare');
      if (glare) glare.style.opacity = '0';
    });
  });
})();


/* ──────────────────────────────────────────
   8. CERTIFICATE CAROUSEL
   ────────────────────────────────────────── */
(function initCarousel() {
  const carousel = document.getElementById('cert-carousel');
  const prevBtn  = document.getElementById('cert-prev');
  const nextBtn  = document.getElementById('cert-next');
  const dotsWrap = document.getElementById('carousel-dots');
  if (!carousel) return;

  const cards = carousel.querySelectorAll('.cert-card');
  const total = cards.length;
  let current = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Certificate ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    current = (idx + total) % total;
    carousel.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
    resetAuto();
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Touch / swipe
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  resetAuto();
})();


/* ──────────────────────────────────────────
   9. CONTACT FORM SUBMISSION
   ────────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submit  = document.getElementById('contact-submit');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnText   = submit.querySelector('.btn-text');
    const btnLoader = submit.querySelector('.btn-loader');

    // Validate
    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email-input').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    if (!name || !email || !message) return shakeForm(form);

    // Show loader
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    submit.disabled = true;

    // Simulate send (replace with actual fetch/emailjs)
    await new Promise(r => setTimeout(r, 1800));

    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
    submit.disabled = false;
    success.classList.remove('hidden');
    form.reset();
    setTimeout(() => success.classList.add('hidden'), 5000);
  });

  function shakeForm(el) {
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }
})();


/* ──────────────────────────────────────────
   10. PARALLAX SCROLLING (hero orbs)
   ────────────────────────────────────────── */
(function initParallax() {
  const orbs = document.querySelectorAll('.hero-orb');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.15;
      orb.style.transform = `translateY(${sy * speed}px)`;
    });
  }, { passive: true });
})();


/* ──────────────────────────────────────────
   11. COUNTER ANIMATION (stats)
   ────────────────────────────────────────── */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.textContent) || 0;
      let start = 0;
      const dur = 1500;
      const step = Math.ceil(end / (dur / 16));
      const suffix = el.textContent.replace(/[0-9]/g, '');
      const timer = setInterval(() => {
        start = Math.min(start + step, end);
        el.textContent = start + suffix;
        if (start >= end) clearInterval(timer);
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.8 });

  nums.forEach(n => observer.observe(n));
})();


/* ──────────────────────────────────────────
   12. SECTION REVEAL WITH NEON LINE
   ────────────────────────────────────────── */
(function initSectionReveal() {
  const dividers = document.querySelectorAll('.section-divider');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'dividerGrow 0.8s cubic-bezier(0.25,0.8,0.25,1) forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });
  dividers.forEach(d => {
    d.style.width = '0';
    observer.observe(d);
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes dividerGrow {
      from { width: 0; }
      to   { width: 60px; }
    }
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%     { transform: translateX(-8px); }
      40%     { transform: translateX(8px); }
      60%     { transform: translateX(-6px); }
      80%     { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(style);
})();


/* ──────────────────────────────────────────
   13. FLOATING BADGE TOOLTIP ON HOVER
   ────────────────────────────────────────── */
(function initBadgeGlow() {
  const badges = document.querySelectorAll('.float-badge');
  badges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
      badge.style.transform = 'scale(1.15)';
      badge.style.transition = 'transform 0.3s ease';
      badge.style.zIndex = '10';
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.transform = '';
      badge.style.zIndex = '';
    });
  });
})();


/* ──────────────────────────────────────────
   14. GLOWING SECTION BACKGROUNDS ON SCROLL
   ────────────────────────────────────────── */
(function initScrollGlow() {
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.body.dataset.activeSection = entry.target.id;
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
})();


/* ──────────────────────────────────────────
   15. HERO AVATAR INTERACTIVE GLOW
   ────────────────────────────────────────── */
(function initAvatarInteraction() {
  const avatarFrame = document.querySelector('.avatar-frame');
  const avatarGlow  = document.querySelector('.avatar-glow');
  if (!avatarFrame || !avatarGlow) return;

  avatarFrame.addEventListener('mouseenter', () => {
    avatarGlow.style.opacity = '1';
    avatarGlow.style.transform = 'translate(-50%,-50%) scale(1.4)';
    avatarGlow.style.transition = 'all 0.4s ease';
  });
  avatarFrame.addEventListener('mouseleave', () => {
    avatarGlow.style.opacity = '';
    avatarGlow.style.transform = '';
  });
})();


/* ──────────────────────────────────────────
   16. CURSOR CUSTOM HIGHLIGHT (desktop)
   ────────────────────────────────────────── */
(function initCursorDot() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip mobile
  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  dot.style.cssText = `
    position:fixed;width:8px;height:8px;border-radius:50%;
    background:var(--purple,#a855f7);pointer-events:none;z-index:9999;
    transform:translate(-50%,-50%);transition:transform 0.1s ease,opacity 0.3s ease;
    mix-blend-mode:difference;opacity:0.8;
  `;
  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  ring.style.cssText = `
    position:fixed;width:32px;height:32px;border-radius:50%;
    border:1.5px solid rgba(168,85,247,0.5);pointer-events:none;z-index:9998;
    transform:translate(-50%,-50%);transition:left 0.15s ease,top 0.15s ease,
      width 0.3s ease,height 0.3s ease,opacity 0.3s ease;opacity:0.6;
  `;
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let rx = 0, ry = 0;
  document.addEventListener('mousemove', (e) => {
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';
    rx += (e.clientX - rx) * 0.18;
    ry += (e.clientY - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  });

  document.querySelectorAll('a,button,.tilt-card,.interest-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = 'rgba(6,182,212,0.6)';
      dot.style.transform = 'translate(-50%,-50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(168,85,247,0.5)';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
})();


/* ──────────────────────────────────────────
   17. SMOOTH SECTION ENTRY GLOW FLASH
   ────────────────────────────────────────── */
(function initNavGlowClick() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ──────────────────────────────────────────
   18. ORBIT TOOLTIP ON HOVER
   ────────────────────────────────────────── */
(function initOrbitTooltip() {
  const items = document.querySelectorAll('.orbit-item');
  items.forEach(item => {
    const icon = item.querySelector('i');
    if (!icon) return;
    const label = icon.getAttribute('title') || '';
    item.setAttribute('title', label);
  });
})();


/* ──────────────────────────────────────────
   19. PAGE LOAD TRANSITION
   ────────────────────────────────────────── */
(function initPageTransition() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;
    background:linear-gradient(135deg,#050812,#0d0a1a);
    z-index:99999;pointer-events:none;
    transition:opacity 0.8s ease;
  `;
  document.body.appendChild(overlay);
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 900);
    });
  });
})();

console.log('%c✨ Indushree S Achar — Portfolio Loaded', 'color:#a855f7;font-size:14px;font-weight:bold;');
console.log('%c🚀 AI · Web · Data Science', 'color:#06b6d4;font-size:12px;');
