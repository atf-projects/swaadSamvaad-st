/**
 * SWAAD SAMVAAD - Collection / Shop Page Controller (assets/ss-collection-page.js)
 * Features:
 * - Slide-Over Filter Sidebar (Drawer) from Right with Blur Overlay
 * - Interactive Price Range Slider Bar at TOP of Drawer
 * - Multi-criteria Filter Matching (Sweetener & Weight)
 * - Live Product Counter & Empty State Handler
 * - Variant Weight Chip Switcher
 * - LocalStorage Wishlist Persistence
 * - AJAX Add to Basket with Cart Drawer Event Trigger
 * - Real-time Grid Sorting
 */

(() => {
  const initCollectionPage = () => {
    const colSection = document.querySelector('[data-ss-collection-page]');
    if (!colSection) return;

    const cards = Array.from(colSection.querySelectorAll('[data-ss-col-card]'));
    const visibleCountElem = colSection.querySelector('[data-ss-visible-count]');
    const emptyStateElem = colSection.querySelector('[data-ss-col-empty-state]');
    const gridElem = colSection.querySelector('[data-ss-collection-grid]');
    const filterOpenBtn = colSection.querySelector('[data-ss-filter-open]');
    const filterCloseBtn = colSection.querySelector('[data-ss-filter-close]');
    const filterOverlay = colSection.querySelector('[data-ss-filter-overlay]');
    const filterDrawer = colSection.querySelector('[data-ss-filter-drawer]');
    const activeBadge = colSection.querySelector('[data-ss-active-filter-badge]');
    const clearBtns = colSection.querySelectorAll('[data-ss-filter-clear]');
    const checkboxes = colSection.querySelectorAll('.ss-filter-checkbox');
    const priceSlider = colSection.querySelector('[data-ss-price-slider]');
    const priceValDisplay = colSection.querySelector('[data-ss-price-val]');

    // Max slider limit
    const MAX_PRICE = priceSlider ? parseInt(priceSlider.getAttribute('max') || '2000', 10) : 2000;
    const MIN_PRICE = priceSlider ? parseInt(priceSlider.getAttribute('min') || '200', 10) : 200;

    // State
    let filterState = {
      maxPrice: MAX_PRICE,
      types: [],
      weights: []
    };

    // 1. Filter Drawer Open / Close Logic
    const openDrawer = () => {
      if (filterDrawer && filterOverlay) {
        filterDrawer.classList.add('is-open');
        filterOverlay.classList.add('is-open');
        filterDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    };

    const closeDrawer = () => {
      if (filterDrawer && filterOverlay) {
        filterDrawer.classList.remove('is-open');
        filterOverlay.classList.remove('is-open');
        filterDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    };

    if (filterOpenBtn) filterOpenBtn.addEventListener('click', openDrawer);
    if (filterCloseBtn) filterCloseBtn.addEventListener('click', closeDrawer);
    if (filterOverlay) filterOverlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && filterDrawer && filterDrawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    // 2. Update Price Slider Track Background Fill
    const updateSliderFill = (val) => {
      if (!priceSlider) return;
      const percentage = ((val - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
      priceSlider.style.background = `linear-gradient(to right, var(--ss-col-terracotta) 0%, var(--ss-col-terracotta) ${percentage}%, #EADFD5 ${percentage}%, #EADFD5 100%)`;
    };

    // 3. Multi-Criteria Card Matching & Visibility
    const applyFilters = () => {
      // Gather active checkboxes
      filterState.types = Array.from(colSection.querySelectorAll('input[name="filter_type"]:checked')).map(i => i.value);
      filterState.weights = Array.from(colSection.querySelectorAll('input[name="filter_weight"]:checked')).map(i => i.value);
      filterState.maxPrice = priceSlider ? parseInt(priceSlider.value, 10) : MAX_PRICE;

      // Calculate total active filter rules
      let totalActiveRules = filterState.types.length + filterState.weights.length;
      if (filterState.maxPrice < MAX_PRICE) {
        totalActiveRules += 1;
      }

      if (activeBadge) {
        if (totalActiveRules > 0) {
          activeBadge.textContent = totalActiveRules;
          activeBadge.style.display = 'inline-flex';
        } else {
          activeBadge.style.display = 'none';
        }
      }

      let visibleCount = 0;

      cards.forEach((card) => {
        const title = (card.getAttribute('data-title') || '').toLowerCase();
        const tags = (card.getAttribute('data-tags') || '').toLowerCase();
        const priceNum = parseInt(card.getAttribute('data-price') || '0', 10) / 100; // in Rupees

        // Price Filter Check
        let matchesPrice = priceNum <= filterState.maxPrice;

        // Type Filter Check
        let matchesType = true;
        if (filterState.types.length > 0) {
          matchesType = filterState.types.some((t) => {
            if (t === 'gud') return title.includes('gud') || tags.includes('gud') || tags.includes('jaggery');
            if (t === 'sugar') return title.includes('sugar') || tags.includes('sugar') || tags.includes('khandsari');
            if (t === 'dryfruit') return title.includes('dry') || tags.includes('dry') || tags.includes('kaju') || title.includes('kaju');
            if (t === 'festive') return title.includes('festive') || tags.includes('festive') || tags.includes('gift');
            return true;
          });
        }

        // Weight Filter Check
        let matchesWeight = true;
        if (filterState.weights.length > 0) {
          matchesWeight = filterState.weights.some((w) => {
            if (w === '500g') return title.includes('500g') || tags.includes('500g') || tags.includes('500 g');
            if (w === '1kg') return title.includes('1 kg') || title.includes('1kg') || tags.includes('1kg') || tags.includes('1 kg');
            return true;
          });
        }

        const isVisible = matchesPrice && matchesType && matchesWeight;

        if (isVisible) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (visibleCountElem) {
        visibleCountElem.textContent = visibleCount;
      }

      if (emptyStateElem) {
        if (visibleCount === 0) {
          emptyStateElem.style.display = 'block';
          if (gridElem) gridElem.style.display = 'none';
        } else {
          emptyStateElem.style.display = 'none';
          if (gridElem) gridElem.style.display = '';
        }
      }
    };

    // 4. Price Slider Input Events
    if (priceSlider) {
      updateSliderFill(priceSlider.value);

      priceSlider.addEventListener('input', () => {
        const currentVal = parseInt(priceSlider.value, 10);
        if (priceValDisplay) {
          priceValDisplay.textContent = currentVal.toLocaleString('en-IN');
        }
        updateSliderFill(currentVal);
        applyFilters();
      });
    }

    // 5. Checkbox Change Listeners
    checkboxes.forEach((cb) => {
      cb.addEventListener('change', applyFilters);
    });

    // 6. Clear All Filters
    clearBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Reset checkboxes
        checkboxes.forEach((cb) => {
          cb.checked = false;
        });

        // Reset price slider
        if (priceSlider) {
          priceSlider.value = MAX_PRICE;
          if (priceValDisplay) {
            priceValDisplay.textContent = MAX_PRICE.toLocaleString('en-IN');
          }
          updateSliderFill(MAX_PRICE);
        }

        applyFilters();
      });
    });

    // 7. Wishlist Persistence
    const getWishlist = () => {
      try {
        return JSON.parse(localStorage.getItem('ss_wishlist_items') || '[]');
      } catch (e) {
        return [];
      }
    };

    const saveWishlist = (items) => {
      try {
        localStorage.setItem('ss_wishlist_items', JSON.stringify(items));
      } catch (e) {}
    };

    let wishlist = getWishlist();
    const wishlistBtns = colSection.querySelectorAll('[data-wishlist-id]');

    wishlistBtns.forEach((btn) => {
      const prodId = btn.getAttribute('data-wishlist-id');
      if (wishlist.includes(prodId)) {
        btn.classList.add('is-active');
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (wishlist.includes(prodId)) {
          wishlist = wishlist.filter((id) => id !== prodId);
          btn.classList.remove('is-active');
        } else {
          wishlist.push(prodId);
          btn.classList.add('is-active');
        }
        saveWishlist(wishlist);
      });
    });

    // 8. Variant Chip Selector on Cards
    cards.forEach((card) => {
      const variantChips = card.querySelectorAll('.ss-col-card__variant-chip');
      const addBtn = card.querySelector('[data-ss-col-add-cart]');
      const priceElem = card.querySelector('.ss-col-card__price');
      const compareElem = card.querySelector('.ss-col-card__compare-price');

      variantChips.forEach((chip) => {
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          variantChips.forEach((c) => c.classList.remove('is-active'));
          chip.classList.add('is-active');

          const variantId = chip.getAttribute('data-variant-id');
          const newPrice = chip.getAttribute('data-price');
          const newCompare = chip.getAttribute('data-compare');

          if (addBtn && variantId) {
            addBtn.setAttribute('data-variant-id', variantId);
          }
          if (priceElem && newPrice) {
            priceElem.textContent = newPrice;
          }
          if (compareElem && newCompare) {
            compareElem.textContent = newCompare;
          }
        });
      });
    });

    // 9. AJAX Add to Basket Integration
    const addButtons = colSection.querySelectorAll('[data-ss-col-add-cart]');
    addButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const variantId = btn.getAttribute('data-variant-id');
        if (!variantId) return;

        const originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `
          <svg class="ss-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;animation:ssColSpin 0.8s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          <span>Adding...</span>
        `;

        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              id: variantId,
              quantity: 1
            })
          });

          if (response.ok) {
            btn.innerHTML = `<span>Added ✓</span>`;

            // Trigger cart drawer if available
            if (window.SwaadCartDrawer && typeof window.SwaadCartDrawer.open === 'function') {
              window.SwaadCartDrawer.open();
            } else {
              document.dispatchEvent(new CustomEvent('cart:updated'));
            }

            setTimeout(() => {
              btn.disabled = false;
              btn.innerHTML = originalHtml;
            }, 2000);
          } else {
            throw new Error('Failed to add product');
          }
        } catch (err) {
          btn.disabled = false;
          btn.innerHTML = originalHtml;
          console.error('Error adding to cart:', err);
        }
      });
    });

    // 10. Real-time Grid Sorting
    const sortSelect = colSection.querySelector('[data-ss-collection-sort]');
    if (sortSelect && gridElem) {
      sortSelect.addEventListener('change', () => {
        const sortVal = sortSelect.value;
        const currentCards = Array.from(gridElem.querySelectorAll('[data-ss-col-card]'));

        currentCards.sort((a, b) => {
          const priceA = parseInt(a.getAttribute('data-price') || '0', 10);
          const priceB = parseInt(b.getAttribute('data-price') || '0', 10);
          const titleA = (a.getAttribute('data-title') || '').toLowerCase();
          const titleB = (b.getAttribute('data-title') || '').toLowerCase();

          if (sortVal === 'price-ascending') {
            return priceA - priceB;
          } else if (sortVal === 'price-descending') {
            return priceB - priceA;
          } else if (sortVal === 'best-selling') {
            return titleA.localeCompare(titleB);
          } else {
            return 0;
          }
        });

        currentCards.forEach((c) => gridElem.appendChild(c));
      });
    }

    // Initial filter apply
    applyFilters();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollectionPage, { once: true });
  } else {
    initCollectionPage();
  }
})();
