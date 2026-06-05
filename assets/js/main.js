/* TAIGEN — main.js v2 */

// ── Scroll reveal ──
const revealObs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Active nav link ──
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

// ── Mobile menu ──
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobile-nav');
if (burger && mobileNav) {
  const toggle = open => {
    mobileNav.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggle(!mobileNav.classList.contains('open')));
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
}

// ── Hero parallax ──
const heroImg = document.querySelector('.hero__img img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    heroImg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
  }, { passive: true });
}

// ── Gallery strip drag ──
const strip = document.querySelector('.gstrip__track');
if (strip) {
  let down = false, startX, startScroll;
  strip.addEventListener('mousedown', e => {
    down = true; strip.classList.add('grabbing');
    startX = e.pageX - strip.offsetLeft;
    startScroll = strip.scrollLeft;
  });
  const end = () => { down = false; strip.classList.remove('grabbing'); };
  strip.addEventListener('mouseleave', end);
  strip.addEventListener('mouseup', end);
  strip.addEventListener('mousemove', e => {
    if (!down) return;
    e.preventDefault();
    strip.scrollLeft = startScroll - (e.pageX - strip.offsetLeft - startX) * 1.6;
  });
}

// ── Lightbox ──
const lb = document.getElementById('lightbox');
if (lb) {
  const lbImg   = lb.querySelector('.lightbox__img');
  const lbCount = lb.querySelector('.lb-count');
  const imgs    = Array.from(document.querySelectorAll('.g-grid__item img, .masonry__item img'));
  let cur = 0;

  const show = i => {
    cur = ((i % imgs.length) + imgs.length) % imgs.length;
    lbImg.src = imgs[cur].src;
    if (lbCount) lbCount.textContent = `${cur + 1} / ${imgs.length}`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const hide = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };

  imgs.forEach((img, i) => img.parentElement.addEventListener('click', () => show(i)));
  lb.querySelector('.lb-close').addEventListener('click', hide);
  lb.querySelector('.lb-prev').addEventListener('click', () => show(cur - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', e => { if (e.target === lb) hide(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     hide();
    if (e.key === 'ArrowLeft')  show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
}

// ── Smooth anchor scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth' });
  });
});
