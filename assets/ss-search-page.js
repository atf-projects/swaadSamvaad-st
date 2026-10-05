/**
 * SWAAD SAMVAAD - Search Results Page Controller (assets/ss-search-page.js)
 * Features:
 * - Slide-Over Filter Sidebar (Drawer) from Right with Blur Overlay
 * - Interactive Price Range Slider Bar
 * - Live Multi-criteria Filter Matching (Sweetener & Weight)
 * - Live Product Counter & Empty State Handler
 * - Variant Weight Chip Switcher
 * - LocalStorage Wishlist Persistence
 * - AJAX Add to Basket with Cart Drawer Event Trigger
 * - Real-time Grid Sorting
 */

(() => {
  const initSearchPage = () => {
    const searchSection = document.querySelector('[data-ss-search-page]');
    if (!searchSection) return;

    const cards = Array.from(searchSection.querySelectorAll('[data-ss-search-card]'));
    const visibleCountElem = searchSection.querySelector('[data-ss-visible-count]');
    const emptyStateElem = searchSection.querySelector('[data-ss-search-empty-state]');
    const gridElem = searchSection.querySelector('[data-ss-search-grid]');
    const filterOpenBtn = searchSection.querySelector('[data-ss-filter-open]');
    const filterCloseBtn = searchSection.querySelector('[data-ss-filter-close]');
    const filterOverlay = searchSection.querySelector('[data-ss-filter-overlay]');
    const filterDrawer = searchSection.querySelector('[data-ss-filter-drawer]');
    const activeBadge = searchSection.querySelector('[data-ss-active-filter-badge]');
    const clearBtns = searchSection.querySelectorAll('[data-ss-filter-clear]');
    const checkboxes = searchSection.querySelectorAll('.ss-filter-checkbox');
    const priceSlider = searchSection.querySelector('[data-ss-price-slider]');
    const priceValDisplay = searchSection.querySelector('[data-ss-price-val]');
    const sortSelect = searchSection.querySelector('[data-ss-search-sort]');

    // Max slider limit
    const MAX_PRICE = priceSlider ? parseInt(priceSlider.getAttribute('max') || '2000', 10) : 2000;
    const MIN_PRICE = priceSlider ? parseInt(priceSlider.getAttribute('min') || '200', 10) : 200;

    // State
    let filterState = {
      maxPrice: MAX_PRICE,
      types: [],
      weights: []
    };

    // Initialize visible count
    if (visibleCountElem) {
      visibleCountElem.textContent = `${cards.length} Delicacies Found`;
    }

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
      priceSlider.style.background = `linear-gradient(to right, var(--ss-sp-terracotta) 0%, var(--ss-sp-terracotta) ${percentage}%, #EADFD5 ${percentage}%, #EADFD5 100%)`;
    };

    // 3. Multi-Criteria Card Matching & Visibility
    const applyFilters = () => {
      filterState.types = Array.from(searchSection.querySelectorAll('input[name="filter_type"]:checked')).map(i => i.value);
      filterState.weights = Array.from(searchSection.querySelectorAll('input[name="filter_weight"]:checked')).map(i => i.value);
      filterState.maxPrice = priceSlider ? parseInt(priceSlider.value, 10) : MAX_PRICE;

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
        const title = (card.dataset.title || '').toLowerCase();
        const tags = (card.dataset.tags || '').toLowerCase();
        const type = (card.dataset.type || '').toLowerCase();
        const rawPriceCents = parseInt(card.dataset.price || '0', 10);
        const priceRupees = rawPriceCents / 100;

        // A. Price Match
        const matchesPrice = priceRupees <= filterState.maxPrice;

        // B. Type / Sweetener Match
        let matchesType = true;
        if (filterState.types.length > 0) {
          matchesType = filterState.types.some((selectedType) => {
            if (selectedType === 'gud') {
              return title.includes('gud') || title.includes('jaggery') || tags.includes('gud') || tags.includes('jaggery') || type.includes('gud');
            }
            if (selectedType === 'sugar' || selectedType === 'chini') {
              return title.includes('sugar') || title.includes('chini') || title.includes('khandsari') || tags.includes('sugar') || tags.includes('chini') || type.includes('sugar');
            }
            if (selectedType === 'dryfruit') {
              return title.includes('dry') || title.includes('fruit') || title.includes('kaju') || tags.includes('dry') || tags.includes('fruit');
            }
            if (selectedType === 'festive') {
              return title.includes('festive') || title.includes('chhath') || title.includes('combo') || title.includes('gift') || tags.includes('festive');
            }
            return false;
          });
        }

        // C. Weight / Pack Size Match
        let matchesWeight = true;
        if (filterState.weights.length > 0) {
          matchesWeight = filterState.weights.some((selectedWeight) => {
            if (selectedWeight === '500g') {
              return title.includes('500g') || title.includes('500 g') || tags.includes('500g');
            }
            if (selectedWeight === '1kg') {
              return title.includes('1kg') || title.includes('1 kg') || tags.includes('1kg');
            }
            return false;
          });
        }

        // Overall Visibility
        if (matchesPrice && matchesType && matchesWeight) {
          card.style.display = '';
          visibleCount += 1;
        } else {
          card.style.display = 'none';
        }
      });

      // Update visible count pill
      if (visibleCountElem) {
        visibleCountElem.textContent = `${visibleCount} Delicacies Found`;
      }

      // Empty State Toggle
      if (emptyStateElem && gridElem) {
        if (visibleCount === 0 && cards.length > 0) {
          emptyStateElem.style.display = 'block';
          gridElem.style.display = 'none';
        } else {
          emptyStateElem.style.display = 'none';
          gridElem.style.display = 'grid';
        }
      }
    };

    // 4. Price Slider Input Handler
    if (priceSlider && priceValDisplay) {
      updateSliderFill(parseInt(priceSlider.value, 10));
      priceSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        priceValDisplay.textContent = val.toLocaleString('en-IN');
        updateSliderFill(val);
        applyFilters();
      });
    }

    // 5. Checkbox Change Listeners
    checkboxes.forEach((cb) => {
      cb.addEventListener('change', applyFilters);
    });

    // 6. Reset Filters Action
    clearBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = false);
        if (priceSlider && priceValDisplay) {
          priceSlider.value = MAX_PRICE;
          priceValDisplay.textContent = MAX_PRICE.toLocaleString('en-IN');
          updateSliderFill(MAX_PRICE);
        }
        applyFilters();
      });
    });

    // 7. Real-Time In-Page Sorting
    if (sortSelect && gridElem) {
      sortSelect.addEventListener('change', (e) => {
        const sortMode = e.target.value;
        const visibleCards = Array.from(gridElem.querySelectorAll('[data-ss-search-card]'));

        visibleCards.sort((a, b) => {
          const priceA = parseInt(a.dataset.price || '0', 10);
          const priceB = parseInt(b.dataset.price || '0', 10);
          const titleA = (a.dataset.title || '').toLowerCase();
          const titleB = (b.dataset.title || '').toLowerCase();

          if (sortMode === 'price-ascending') return priceA - priceB;
          if (sortMode === 'price-descending') return priceB - priceA;
          if (sortMode === 'title-ascending') return titleA.localeCompare(titleB);
          return 0; // relevance / default
        });

        visibleCards.forEach(card => gridElem.appendChild(card));
      });
    }

    // 8. Variant Weight Chips Switcher
    searchSection.addEventListener('click', (e) => {
      const chip = e.target.closest('.ss-sp-variant-chip');
      if (!chip) return;

      const card = chip.closest('.ss-sp-card');
      if (!card) return;

      const variantId = chip.dataset.variantId;
      const priceText = chip.dataset.variantPrice;
      const compareText = chip.dataset.variantCompare;
      const available = chip.dataset.variantAvailable === 'true';
      const rawPrice = chip.dataset.rawPrice;

      // Toggle chip active class
      const allChips = card.querySelectorAll('.ss-sp-variant-chip');
      allChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      // Update card dataset price
      if (rawPrice) card.dataset.price = rawPrice;

      // Update price DOM
      const priceElem = card.querySelector('[data-card-price]');
      if (priceElem && priceText) priceElem.textContent = priceText;

      const compareElem = card.querySelector('[data-card-compare-price]');
      if (compareElem) {
        if (compareText && compareText !== priceText) {
          compareElem.textContent = compareText;
          compareElem.style.display = 'inline';
        } else {
          compareElem.style.display = 'none';
        }
      }

      // Update Add Button
      const addBtn = card.querySelector('[data-ss-search-add-cart]');
      if (addBtn) {
        addBtn.dataset.variantId = variantId;
        const desktopLabel = addBtn.querySelector('.ss-sp-btn-text--desktop');
        const mobileLabel = addBtn.querySelector('.ss-sp-btn-text--mobile');

        if (available) {
          addBtn.removeAttribute('disabled');
          if (desktopLabel) desktopLabel.textContent = '+ ADD TO BASKET';
          if (mobileLabel) mobileLabel.textContent = '+ ADD';
        } else {
          addBtn.setAttribute('disabled', 'disabled');
          if (desktopLabel) desktopLabel.textContent = 'SOLD OUT';
          if (mobileLabel) mobileLabel.textContent = 'SOLD OUT';
        }
      }
    });

    // 9. Instant AJAX Add to Cart
    searchSection.addEventListener('click', async (e) => {
      const addBtn = e.target.closest('[data-ss-search-add-cart]');
      if (!addBtn || addBtn.disabled || addBtn.classList.contains('is-loading')) return;

      e.preventDefault();
      const variantId = addBtn.dataset.variantId;
      if (!variantId) return;

      const desktopLabel = addBtn.querySelector('.ss-sp-btn-text--desktop');
      const mobileLabel = addBtn.querySelector('.ss-sp-btn-text--mobile');
      const prevDesktopText = desktopLabel ? desktopLabel.textContent : '+ ADD TO BASKET';
      const prevMobileText = mobileLabel ? mobileLabel.textContent : '+ ADD';

      // Set loading state
      addBtn.classList.add('is-loading');
      if (desktopLabel) desktopLabel.textContent = 'Adding...';
      if (mobileLabel) mobileLabel.textContent = '...';

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        });

        if (res.ok) {
          addBtn.classList.remove('is-loading');
          addBtn.classList.add('is-success');
          if (desktopLabel) desktopLabel.textContent = 'Added ✓';
          if (mobileLabel) mobileLabel.textContent = 'Added ✓';
          
          // Trigger global cart drawer if available
          if (window.SwaadCartDrawer && typeof window.SwaadCartDrawer.open === 'function') {
            if (typeof window.SwaadCartDrawer.fetchAndRenderCart === 'function') {
              window.SwaadCartDrawer.fetchAndRenderCart();
            }
            window.SwaadCartDrawer.open();
          } else {
            document.dispatchEvent(new CustomEvent('cart:updated', { bubbles: true }));
            document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
          }

          setTimeout(() => {
            addBtn.classList.remove('is-success');
            if (desktopLabel) desktopLabel.textContent = prevDesktopText;
            if (mobileLabel) mobileLabel.textContent = prevMobileText;
          }, 1600);
        } else {
          addBtn.classList.remove('is-loading');
          if (desktopLabel) desktopLabel.textContent = 'Error';
          if (mobileLabel) mobileLabel.textContent = 'Error';
          setTimeout(() => {
            if (desktopLabel) desktopLabel.textContent = prevDesktopText;
            if (mobileLabel) mobileLabel.textContent = prevMobileText;
          }, 1600);
        }
      } catch (err) {
        console.error('Error adding to basket:', err);
        addBtn.classList.remove('is-loading');
        if (desktopLabel) desktopLabel.textContent = prevDesktopText;
        if (mobileLabel) mobileLabel.textContent = prevMobileText;
      }
    });

    // 10. LocalStorage Wishlist Handler
    const WISHLIST_KEY = 'ss_mithila_wishlist';
    const getWishlist = () => {
      try {
        return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
      } catch {
        return [];
      }
    };
    const setWishlist = (list) => {
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
      } catch (err) {
        console.error(err);
      }
    };

    // Initialize wishlist state on page load
    const savedWishlist = getWishlist();
    searchSection.querySelectorAll('[data-wishlist-id]').forEach((btn) => {
      const prodId = btn.dataset.wishlistId;
      if (savedWishlist.includes(prodId)) {
        btn.classList.add('is-active');
      }
    });

    searchSection.addEventListener('click', (e) => {
      const wishBtn = e.target.closest('[data-wishlist-id]');
      if (!wishBtn) return;

      e.preventDefault();
      e.stopPropagation();

      const prodId = wishBtn.dataset.wishlistId;
      let currentWishlist = getWishlist();

      if (currentWishlist.includes(prodId)) {
        currentWishlist = currentWishlist.filter(id => id !== prodId);
        wishBtn.classList.remove('is-active');
      } else {
        currentWishlist.push(prodId);
        wishBtn.classList.add('is-active');
      }

      setWishlist(currentWishlist);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchPage);
  } else {
    initSearchPage();
  }
})();
