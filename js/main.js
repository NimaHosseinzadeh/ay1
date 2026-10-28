/* ==========================================================================
   Aynim - main script (loaded on every site page)
   Each feature checks that its elements exist, so one file works everywhere.
   ========================================================================== */

'use strict';

/* Price like the markup uses it: 3,089,000 in Persian digits */
function formatPrice(number) {
  return number.toLocaleString('en-US').replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[digit]);
}

/* --------------------------------------------------------------------------
   Hero slider: autoplay, arrow and clickable dots
   -------------------------------------------------------------------------- */
function initHero() {
  const hero = document.querySelector('.hero');
  const dotsBox = document.querySelector('[data-dots]');
  if (!hero || !dotsBox) return;

  const slides = [...hero.querySelectorAll('.hero__slide')];
  const nextButton = hero.querySelector('.hero__next');
  let current = 0;
  let timer;

  // One dot per slide
  const dots = slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.className = 'dots__item';
    dot.setAttribute('aria-label', `اسلاید ${index + 1}`);
    dot.addEventListener('click', () => go(index));
    dotsBox.append(dot);
    return dot;
  });

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  }

  const play = () => { timer = setInterval(() => show(current + 1), 5000); };
  const pause = () => clearInterval(timer);

  // Manual change restarts the autoplay timer
  function go(index) {
    pause();
    show(index);
    play();
  }

  nextButton.addEventListener('click', () => go(current + 1));
  hero.addEventListener('mouseenter', pause);
  hero.addEventListener('mouseleave', play);

  show(0);
  play();
}

/* --------------------------------------------------------------------------
   Product rows: the arrow moves a window of visible cards
   -------------------------------------------------------------------------- */
function initShowcases() {
  document.querySelectorAll('.showcase').forEach((box) => {
    const cards = [...box.querySelectorAll('.card')];
    const nextButton = box.querySelector('.showcase__next');
    const promo = box.querySelector('.showcase__promo');
    let start = 0;

    // Visible cards = grid columns, minus the promo column when it is shown
    function visibleCount() {
      const columns = getComputedStyle(box).gridTemplateColumns.split(' ').length;
      const promoShown = promo && getComputedStyle(promo).display !== 'none';
      return columns - (promoShown ? 1 : 0);
    }

    function render() {
      const count = visibleCount();
      cards.forEach((card, index) => {
        const position = (index - start + cards.length) % cards.length;
        card.hidden = position >= count;
      });
    }

    nextButton.addEventListener('click', () => {
      start = (start + 1) % cards.length;
      render();

      // Replay the slide-in animation
      box.classList.remove('is-sliding');
      void box.offsetWidth;
      box.classList.add('is-sliding');
    });

    window.addEventListener('resize', render);
    render();
  });
}

/* --------------------------------------------------------------------------
   Reveal sections while scrolling
   -------------------------------------------------------------------------- */
function initReveal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.quick, .categories, .section, .banner, .duo, .brands').forEach((element) => {
    element.classList.add('reveal');
    observer.observe(element);
  });
}

/* --------------------------------------------------------------------------
   Wishlist: heart on the product page, remove button on the wishlist page
   -------------------------------------------------------------------------- */
function initWishlist() {
  const heart = document.querySelector('.buy__wish');

  if (heart) {
    heart.addEventListener('click', () => {
      const active = heart.classList.toggle('is-active');
      heart.querySelector('i').className = active ? 'ri-heart-fill' : 'ri-heart-line';
    });
  }

  document.querySelectorAll('.card__remove').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.card');
      const grid = card.parentElement;

      card.classList.add('is-removing');
      setTimeout(() => {
        card.remove();
        if (!grid.children.length) {
          grid.outerHTML = '<p class="empty">لیست علاقه‌مندی‌های شما خالی است.</p>';
        }
      }, 300);
    });
  });
}

/* --------------------------------------------------------------------------
   Product gallery: thumbnails change the main image
   -------------------------------------------------------------------------- */
function initGallery() {
  const main = document.querySelector('.gallery__main');
  const thumbs = document.querySelectorAll('.gallery__thumb');
  if (!main) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      main.src = thumb.querySelector('img').src;
      thumbs.forEach((item) => item.classList.toggle('is-active', item === thumb));
    });
  });
}

/* --------------------------------------------------------------------------
   FAQ: only one answer open at a time
   -------------------------------------------------------------------------- */
function initFaq() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach((other) => { if (other !== item) other.open = false; });
    });
  });
}

initHero();
initShowcases();
initReveal();
initWishlist();
initGallery();
initFaq();