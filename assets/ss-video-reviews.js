/**
 * Swaad Samvaad - SS Video Reviews & Reel Carousel Component
 * Handles:
 * - Next/Prev carousel navigation with dynamic overflow detection
 * - Native touch swipe momentum support
 * - Video modal player popups (Shopify video MP4, external video, etc.)
 */
(function() {
  function initVideoReviews() {
    const sections = document.querySelectorAll('.ss-video-reviews');
    if (!sections.length) return;

    sections.forEach((section) => {
      const carouselWrap = section.querySelector('[data-ss-video-slider]');
      const track = section.querySelector('[data-slider-track]');
      const prevBtn = section.querySelector('[data-nav-direction="prev"]');
      const nextBtn = section.querySelector('[data-nav-direction="next"]');
      const modal = section.querySelector('[data-ss-video-modal]');
      const mediaContainer = section.querySelector('[data-modal-media-container]');
      const triggers = section.querySelectorAll('[data-video-modal-trigger]');

      if (!carouselWrap || !track) return;

      // 1. Check Overflow to toggle nav visibility
      function checkOverflow() {
        const isOverflowing = track.scrollWidth > track.clientWidth + 8;
        if (isOverflowing) {
          carouselWrap.classList.add('has-overflow');
        } else {
          carouselWrap.classList.remove('has-overflow');
        }

        // Update disabled states
        if (prevBtn) {
          prevBtn.disabled = track.scrollLeft <= 4;
          prevBtn.setAttribute('aria-disabled', prevBtn.disabled ? 'true' : 'false');
        }
        if (nextBtn) {
          const maxScroll = track.scrollWidth - track.clientWidth - 4;
          nextBtn.disabled = track.scrollLeft >= maxScroll;
          nextBtn.setAttribute('aria-disabled', nextBtn.disabled ? 'true' : 'false');
        }
      }

      checkOverflow();
      window.addEventListener('resize', checkOverflow, { passive: true });
      track.addEventListener('scroll', checkOverflow, { passive: true });

      // 2. Nav Button Click Handlers
      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const item = track.querySelector('.ss-video-reviews__item');
          const step = item ? item.offsetWidth + 22 : 300;
          track.scrollBy({ left: -step, behavior: 'smooth' });
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const item = track.querySelector('.ss-video-reviews__item');
          const step = item ? item.offsetWidth + 22 : 300;
          track.scrollBy({ left: step, behavior: 'smooth' });
        });
      }

      // 3. Video Modal Trigger
      if (modal && mediaContainer && triggers.length) {
        function openModal(src, type) {
          mediaContainer.innerHTML = '';
          if (src) {
            if (src.includes('youtube.com') || src.includes('youtu.be') || src.includes('vimeo.com')) {
              // Iframe embed
              let embedUrl = src;
              if (src.includes('youtube.com/watch?v=')) {
                embedUrl = src.replace('watch?v=', 'embed/') + '?autoplay=1&rel=0';
              } else if (src.includes('youtu.be/')) {
                embedUrl = src.replace('youtu.be/', 'www.youtube.com/embed/') + '?autoplay=1&rel=0';
              }
              const iframe = document.createElement('iframe');
              iframe.src = embedUrl;
              iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
              iframe.allowFullscreen = true;
              mediaContainer.appendChild(iframe);
            } else {
              // HTML5 MP4 Video
              const video = document.createElement('video');
              video.src = src;
              video.controls = true;
              video.autoplay = true;
              video.playsInline = true;
              mediaContainer.appendChild(video);
            }
          }
          modal.classList.add('is-active');
          modal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }

        function closeModal() {
          modal.classList.remove('is-active');
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
          mediaContainer.innerHTML = '';
        }

        triggers.forEach((trigger) => {
          trigger.addEventListener('click', () => {
            const src = trigger.getAttribute('data-video-src');
            const type = trigger.getAttribute('data-video-type');
            if (src) {
              openModal(src, type);
            }
          });

          trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              trigger.click();
            }
          });
        });

        const closeBtns = modal.querySelectorAll('[data-modal-close]');
        closeBtns.forEach((btn) => {
          btn.addEventListener('click', closeModal);
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && modal.classList.contains('is-active')) {
            closeModal();
          }
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoReviews);
  } else {
    initVideoReviews();
  }

  document.addEventListener('shopify:section:load', initVideoReviews);
})();
