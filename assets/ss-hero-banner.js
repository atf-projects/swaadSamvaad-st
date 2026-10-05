/**
 * SWAAD SAMVAAD - Full-Width Hero Banner Slider Controller
 * - Multiple Slideshow slider support (Images + Videos)
 * - Auto-switch slideshow (every 5s)
 * - Prev / Next navigation arrow buttons
 * - Dot indicator navigation
 * - Touch swipe gesture support for mobile/tablets
 * - Auto-pause on hover / touch
 */
(() => {
  const ROOT_SELECTOR = '.ss-hero';

  const initSlider = (section) => {
    const slider = section.querySelector('[data-ss-hero-slider]');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.ss-hero__bg-slide, .ss-hero__slide'));
    const dots = Array.from(section.querySelectorAll('.ss-hero__dot'));
    const prevBtn = section.querySelector('[data-slide-nav="prev"]');
    const nextBtn = section.querySelector('[data-slide-nav="next"]');

    if (slides.length <= 1) return;

    let currentIndex = 0;
    let timer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    const handleVideoPlayback = (slide, isActive) => {
      const video = slide.querySelector('video');
      if (video) {
        if (isActive) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    };

    const showSlide = (index) => {
      // Normalize index
      if (index < 0) {
        index = slides.length - 1;
      } else if (index >= slides.length) {
        index = 0;
      }

      slides.forEach((slide, i) => {
        const isActive = i === index;
        slide.classList.toggle('ss-hero__bg-slide--active', isActive);
        slide.classList.toggle('ss-hero__slide--active', isActive);
        handleVideoPlayback(slide, isActive);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('ss-hero__dot--active', i === index);
      });

      currentIndex = index;
    };

    const nextSlide = () => {
      showSlide(currentIndex + 1);
    };

    const prevSlide = () => {
      showSlide(currentIndex - 1);
    };

    const startTimer = () => {
      stopTimer();
      timer = setInterval(nextSlide, 5000);
    };

    const stopTimer = () => {
      if (timer) clearInterval(timer);
    };

    // Prev / Next button listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        startTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        startTimer();
      });
    }

    // Dots listeners
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        showSlide(idx);
        startTimer();
      });
    });

    // Touch swipe support for mobile
    const touchArea = section.querySelector('[data-ss-hero-slider-wrap]') || section;

    touchArea.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopTimer();
    }, { passive: true });

    touchArea.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diffX = touchEndX - touchStartX;
      if (Math.abs(diffX) > 40) {
        if (diffX < 0) {
          nextSlide(); // Swipe Left -> Next
        } else {
          prevSlide(); // Swipe Right -> Prev
        }
      }
      startTimer();
    }, { passive: true });

    // Hover pause
    touchArea.addEventListener('mouseenter', stopTimer);
    touchArea.addEventListener('mouseleave', startTimer);

    // Initial state
    showSlide(0);
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
