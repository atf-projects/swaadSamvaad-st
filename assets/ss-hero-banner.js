/**
 * SWAAD SAMVAAD - Hero Banner Controller
 * - Video Play/Pause toggle
 * - Multiple Slideshow slider support (Dots navigation & auto switch)
 */
(() => {
  const ROOT_SELECTOR = '.ss-hero';

  const initSlider = (section) => {
    const slider = section.querySelector('[data-ss-hero-slider]');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.ss-hero__slide'));
    const dots = Array.from(section.querySelectorAll('.ss-hero__dot'));
    if (slides.length <= 1) return;

    let currentIndex = 0;
    let timer = null;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('ss-hero__slide--active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('ss-hero__dot--active', i === index);
      });
      currentIndex = index;
    };

    const nextSlide = () => {
      let next = (currentIndex + 1) % slides.length;
      showSlide(next);
    };

    const startTimer = () => {
      stopTimer();
      timer = setInterval(nextSlide, 5000);
    };

    const stopTimer = () => {
      if (timer) clearInterval(timer);
    };

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startTimer();
      });
    });

    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);

    startTimer();
  };

  const initAll = () => {
    for (const section of document.querySelectorAll(ROOT_SELECTOR)) {
      if (section instanceof HTMLElement) {
        initSlider(section);
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', initAll);
})();
