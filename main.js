/* ─── NAVBAR: scroll state ─── */
const navbar = document.getElementById('navbar');

const updateNav = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ─── MOBILE MENU ─── */
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

// Close on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

/* ─── SCROLL REVEAL ─── */
const revealEls = document.querySelectorAll(
  '#about, #portfolio .section-header, .pf-item, .pg-item, ' +
  '.testimonial-card, .pricing-card, .contact-info, .contact-form, ' +
  '.about-text, .about-images'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-delay-1');
  if (i % 3 === 2) el.classList.add('reveal-delay-2');
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ─── TESTIMONIALS SLIDER ─── */
const track = document.getElementById('testimonialsTrack');
const dotsContainer = document.getElementById('testimonialsDots');
const cards = track ? Array.from(track.children) : [];

if (cards.length && dotsContainer) {
  // Build dots
  cards.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    if (i === 0) btn.classList.add('active');
    btn.addEventListener('click', () => scrollToCard(i));
    dotsContainer.appendChild(btn);
  });

  const dots = Array.from(dotsContainer.children);

  const scrollToCard = (index) => {
    cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  // Update active dot on scroll
  const updateDots = () => {
    const trackLeft = track.getBoundingClientRect().left;
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === closest));
  };

  track.addEventListener('scroll', updateDots, { passive: true });

  // Auto-advance every 6s
  let autoInterval = setInterval(() => {
    const active = dots.findIndex(d => d.classList.contains('active'));
    scrollToCard((active + 1) % cards.length);
  }, 6000);

  track.addEventListener('pointerdown', () => {
    clearInterval(autoInterval);
    autoInterval = null;
  });
}

/* ─── CONTACT FORM ─── */
const form = document.getElementById('contactForm');
const successEl = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation highlight
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderBottomColor = '#c0392b';
        valid = false;
      } else {
        field.style.borderBottomColor = '';
      }
    });

    if (!valid) return;

    // Simulate send (replace with real endpoint / EmailJS / Formspree)
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      successEl.textContent = 'Thank you! I'll be in touch within 48 hours.';
      form.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }, 1200);
  });

  // Remove error highlight on input
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderBottomColor = '';
    });
  });
}
