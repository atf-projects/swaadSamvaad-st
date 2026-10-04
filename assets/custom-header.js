/**
 * SWAAD SAMVAAD - Custom Header Interactive JavaScript
 * Handles Rotating Announcement Slider, Search Popup, Scan Order Modal, Mobile Drawer & Predictive Search
 */

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const headerSection = document.querySelector('.ss-header-section');
  const announcementBar = document.querySelector('.ss-announcement-bar');
  const searchTriggers = document.querySelectorAll('[data-ss-trigger="search"]');
  const searchModal = document.getElementById('SwaadSearchModal');
  const searchCloseBtns = document.querySelectorAll('[data-ss-close="search"]');
  const searchField = searchModal ? searchModal.querySelector('.ss-search-field') : null;
  const searchForm = searchModal ? searchModal.querySelector('.ss-search-form') : null;
  const popularPills = document.querySelectorAll('.ss-popular-pill-tag');
  const predictiveResultsContainer = searchModal ? searchModal.querySelector('.ss-predictive-results') : null;

  const scanTriggers = document.querySelectorAll('[data-ss-trigger="scan"]');
  const scanModal = document.getElementById('SwaadScanModal');
  const scanCloseBtns = document.querySelectorAll('[data-ss-close="scan"]');

  const mobileToggleBtn = document.querySelector('[data-ss-trigger="mobile-drawer"]');
  const mobileDrawer = document.getElementById('SwaadMobileDrawer');
  const mobileDrawerCloseBtns = document.querySelectorAll('[data-ss-close="mobile-drawer"]');

  // Utility - Body Scroll Lock
  function setScrollLock(lock) {
    if (lock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // ==========================================
  // 1. Rotating Announcement Slider Animation
  // ==========================================
  if (announcementBar) {
    const slides = announcementBar.querySelectorAll('.ss-announcement-slide');
    if (slides.length > 1) {
      let currentSlide = 0;
      const speed = parseInt(announcementBar.dataset.ssAnnouncementSpeed, 10) || 4000;
      let intervalId = null;

      function goToSlide(nextIndex) {
        if (nextIndex === currentSlide) return;
        const prevSlide = currentSlide;
        slides[prevSlide].classList.remove('is-active');
        slides[prevSlide].classList.add('is-exiting');

        setTimeout(() => {
          slides[prevSlide].classList.remove('is-exiting');
        }, 500);

        slides[nextIndex].classList.add('is-active');
        currentSlide = nextIndex;
      }

      function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
      }

      function startSlider() {
        if (!intervalId) {
          intervalId = setInterval(nextSlide, speed);
        }
      }

      function stopSlider() {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }

      startSlider();

      // Pause on mouse hover / touch
      announcementBar.addEventListener('mouseenter', stopSlider);
      announcementBar.addEventListener('mouseleave', startSlider);
      announcementBar.addEventListener('touchstart', stopSlider, { passive: true });
      announcementBar.addEventListener('touchend', startSlider, { passive: true });
    }
  }

  // ==========================================
  // 2. Search Modal Open/Close Logic
  // ==========================================
  function openSearchModal() {
    if (!searchModal) return;
    // Close mobile drawer if open
    if (mobileDrawer && mobileDrawer.classList.contains('is-active')) {
      closeMobileDrawer();
    }
    searchModal.classList.add('is-active');
    searchModal.removeAttribute('hidden');
    setScrollLock(true);
    if (searchField) {
      setTimeout(() => searchField.focus(), 150);
    }
  }

  function closeSearchModal() {
    if (!searchModal) return;
    searchModal.classList.remove('is-active');
    searchModal.setAttribute('hidden', '');
    setScrollLock(false);
    if (searchField) searchField.value = '';
    if (predictiveResultsContainer) {
      predictiveResultsContainer.innerHTML = '';
      predictiveResultsContainer.setAttribute('hidden', '');
    }
  }

  searchTriggers.forEach(trigger => {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openSearchModal();
    });
  });

  searchCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeSearchModal);
  });

  // Popular Pill Click Handler
  popularPills.forEach(pill => {
    pill.addEventListener('click', function () {
      const queryText = this.getAttribute('data-query') || this.textContent.trim();
      if (searchField && searchForm) {
        searchField.value = queryText;
        searchForm.submit();
      } else {
        window.location.href = `/search?q=${encodeURIComponent(queryText)}`;
      }
    });
  });

  // Predictive Search API Integration
  let debounceTimeout = null;
  if (searchField) {
    searchField.addEventListener('input', function () {
      const query = this.value.trim();
      clearTimeout(debounceTimeout);

      if (query.length < 2) {
        if (predictiveResultsContainer) {
          predictiveResultsContainer.innerHTML = '';
          predictiveResultsContainer.setAttribute('hidden', '');
        }
        return;
      }

      debounceTimeout = setTimeout(() => {
        fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=4`)
          .then(res => res.json())
          .then(data => {
            if (!predictiveResultsContainer) return;
            const products = data.resources?.results?.products || [];

            if (products.length === 0) {
              predictiveResultsContainer.innerHTML = `<div style="padding:10px; font-size:13px; color:#888;">No results found for "${query}"</div>`;
              predictiveResultsContainer.removeAttribute('hidden');
              return;
            }

            let html = '<div style="font-size:12px; font-weight:700; color:#8C6D53; margin:10px 0 6px 0; text-transform:uppercase;">Products</div>';
            products.forEach(product => {
              html += `
                <a href="${product.url}" class="ss-predictive-item">
                  <img src="${product.image || 'https://via.placeholder.com/50'}" alt="${product.title}" class="ss-predictive-img" />
                  <div class="ss-predictive-info">
                    <span class="ss-predictive-title">${product.title}</span>
                    <span class="ss-predictive-price">${product.price || ''}</span>
                  </div>
                </a>
              `;
            });

            predictiveResultsContainer.innerHTML = html;
            predictiveResultsContainer.removeAttribute('hidden');
          })
          .catch(err => console.error('Predictive search error:', err));
      }, 250);
    });
  }

  // ==========================================
  // 3. Scan Order Modal Open/Close Logic
  // ==========================================
  function openScanModal() {
    if (!scanModal) return;
    // Close mobile drawer if open
    if (mobileDrawer && mobileDrawer.classList.contains('is-active')) {
      closeMobileDrawer();
    }
    scanModal.classList.add('is-active');
    scanModal.removeAttribute('hidden');
    setScrollLock(true);
  }

  function closeScanModal() {
    if (!scanModal) return;
    scanModal.classList.remove('is-active');
    scanModal.setAttribute('hidden', '');
    setScrollLock(false);
  }

  scanTriggers.forEach(trigger => {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openScanModal();
    });
  });

  scanCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeScanModal);
  });

  // ==========================================
  // 4. Mobile Navigation Drawer Logic
  // ==========================================
  function openMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('is-active');
    mobileDrawer.removeAttribute('hidden');
    setScrollLock(true);
  }

  function closeMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-active');
    mobileDrawer.setAttribute('hidden', '');
    setScrollLock(false);
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', openMobileDrawer);
  }

  mobileDrawerCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeMobileDrawer);
  });

  // Global Backdrop Click & Escape Key Listeners
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSearchModal();
      closeScanModal();
      closeMobileDrawer();
    }
  });

  // Sticky Header Scroll Effect
  if (headerSection && headerSection.classList.contains('ss-header-section--sticky')) {
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        headerSection.classList.add('is-scrolled');
      } else {
        headerSection.classList.remove('is-scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }
});
