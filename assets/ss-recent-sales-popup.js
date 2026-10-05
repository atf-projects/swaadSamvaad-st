/**
 * SS RECENT SALES / RECENTLY BOUGHT POPUP (SOCIAL PROOF)
 * Continuous infinite loop across entire store - SweetCraft by ATF
 */

(function () {
  'use strict';

  function initRecentSalesPopup() {
    const popup = document.getElementById('ssSalesPopup');
    if (!popup) return;

    let rawProducts = [];
    try {
      rawProducts = JSON.parse(popup.getAttribute('data-products') || '[]');
    } catch (e) {
      rawProducts = [];
    }

    let cities = [];
    try {
      cities = JSON.parse(popup.getAttribute('data-cities') || '[]');
    } catch (e) {
      cities = ['Patna', 'Delhi', 'Mumbai', 'Bengaluru', 'Darbhanga', 'Pune', 'Kolkata', 'Hyderabad', 'Lucknow'];
    }

    let names = [];
    try {
      names = JSON.parse(popup.getAttribute('data-names') || '[]');
    } catch (e) {
      names = ['Anjali', 'Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Pooja', 'Rakesh', 'Sunita', 'Manoj'];
    }

    // Default fallback products if empty
    if (!rawProducts.length) {
      rawProducts = [
        { title: 'Pure Desi Ghee Gud Thekua 1 Kg', url: '/collections/all', image: '' },
        { title: 'Pure Desi Ghee Chini Thekua 1 Kg', url: '/collections/all', image: '' },
        { title: 'Pure Desi Ghee Gud Thekua 500g', url: '/collections/all', image: '' },
        { title: 'Pure Desi Ghee Chini Thekua 500g', url: '/collections/all', image: '' },
        { title: 'Traditional Mithila Festive Hamper', url: '/collections/all', image: '' }
      ];
    }

    const intervalSec = Math.max(3, parseInt(popup.getAttribute('data-interval') || '6', 10));
    const durationSec = Math.max(3, parseInt(popup.getAttribute('data-duration') || '5', 10));

    const imgEl = popup.querySelector('[data-popup-img]');
    const titleLink = popup.querySelector('[data-popup-title]');
    const mediaLink = popup.querySelector('[data-popup-media-link]');
    const buyerNameEl = popup.querySelector('[data-popup-name]');
    const cityEl = popup.querySelector('[data-popup-city]');
    const timeEl = popup.querySelector('[data-popup-time]');
    const closeBtn = popup.querySelector('[data-popup-close]');
    const progressBar = popup.querySelector('.ss-sales-popup__progress');

    let isHovered = false;
    let isTemporarilyPaused = false;
    let timerShow = null;
    let timerHide = null;
    let currentProdIndex = 0;

    const timeOptions = [
      'Just now',
      '1 minute ago',
      '2 minutes ago',
      '3 minutes ago',
      '4 minutes ago',
      '6 minutes ago',
      '8 minutes ago'
    ];

    function getRandomItem(arr) {
      if (!arr || !arr.length) return '';
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function showPopup() {
      if (isTemporarilyPaused) {
        scheduleNextShow();
        return;
      }

      // Pick next product in sequence (or loop)
      const product = rawProducts[currentProdIndex % rawProducts.length];
      currentProdIndex++;

      const randomName = getRandomItem(names) || 'A verified customer';
      const randomCity = getRandomItem(cities) || 'India';
      const randomTime = getRandomItem(timeOptions);

      // Populate DOM elements
      if (titleLink) {
        titleLink.textContent = product.title;
        titleLink.href = product.url || '/collections/all';
      }
      if (mediaLink) {
        mediaLink.href = product.url || '/collections/all';
      }
      if (imgEl) {
        if (product.image) {
          imgEl.src = product.image;
          imgEl.alt = product.title;
        }
      }
      if (buyerNameEl) {
        buyerNameEl.textContent = randomName;
      }
      if (cityEl) {
        cityEl.textContent = randomCity;
      }
      if (timeEl) {
        timeEl.textContent = randomTime;
      }

      // Reset and trigger progress bar animation
      if (progressBar) {
        progressBar.style.animation = 'none';
        void progressBar.offsetWidth; // Trigger reflow to restart CSS animation
        progressBar.style.animation = `ssSalesProgress ${durationSec}s linear forwards`;
      }

      // Make popup active
      popup.classList.add('is-active');

      // Clear existing hide timer and schedule hide
      clearTimeout(timerHide);
      timerHide = setTimeout(function () {
        if (!isHovered) {
          hidePopup();
        }
      }, durationSec * 1000);
    }

    function hidePopup() {
      popup.classList.remove('is-active');
      scheduleNextShow();
    }

    function scheduleNextShow() {
      clearTimeout(timerShow);
      timerShow = setTimeout(function () {
        showPopup();
      }, intervalSec * 1000);
    }

    // Pause on hover
    popup.addEventListener('mouseenter', function () {
      isHovered = true;
    });

    popup.addEventListener('mouseleave', function () {
      isHovered = false;
      if (popup.classList.contains('is-active')) {
        clearTimeout(timerHide);
        timerHide = setTimeout(hidePopup, 1500);
      }
    });

    // Close button: temporarily dismiss for 20s then resume loop
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        popup.classList.remove('is-active');
        isTemporarilyPaused = true;
        clearTimeout(timerHide);
        clearTimeout(timerShow);
        setTimeout(function () {
          isTemporarilyPaused = false;
          scheduleNextShow();
        }, 20000); // Resume after 20 seconds
      });
    }

    // Initial launch after 2 seconds
    clearTimeout(timerShow);
    timerShow = setTimeout(function () {
      showPopup();
    }, 2000);
  }

  // Self-execute on DOM ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRecentSalesPopup);
  } else {
    initRecentSalesPopup();
  }
})();
