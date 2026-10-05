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
      // 1. Gather Selected Collections
      const selectedCollections = Array.from(
        searchSection.querySelectorAll('input[name="filter_collection"]:checked')
      ).map(i => (i.value || '').toLowerCase().trim()).filter(Boolean);

      // 2. Gather Selected Tag Groups (grouped by data-filter-group)
      const activeTagGroups = {};
      searchSection.querySelectorAll('input[data-filter-group]:checked').forEach(input => {
        const groupId = input.getAttribute('data-filter-group');
        const tagVal = (input.value || '').toLowerCase().trim();
        if (groupId && tagVal) {
          if (!activeTagGroups[groupId]) activeTagGroups[groupId] = [];
          activeTagGroups[groupId].push(tagVal);
        }
      });

      const maxPrice = priceSlider ? parseInt(priceSlider.value, 10) : MAX_PRICE;

      // Calculate total active filter rules
      const totalCheckedTags = Object.values(activeTagGroups).reduce((acc, tags) => acc + tags.length, 0);
      let totalActiveRules = selectedCollections.length + totalCheckedTags;
      if (maxPrice < MAX_PRICE) {
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
        const title = (card.dataset.title || card.getAttribute('data-title') || '').toLowerCase();
        const tags = (card.dataset.tags || card.getAttribute('data-tags') || '').toLowerCase();
        const type = (card.dataset.type || card.getAttribute('data-type') || '').toLowerCase();
        const cardCollections = (card.dataset.collections || card.getAttribute('data-collections') || '').toLowerCase().split(' ').map(c => c.trim()).filter(Boolean);
        const rawPriceCents = parseInt(card.dataset.price || card.getAttribute('data-price') || '0', 10);
        const priceRupees = rawPriceCents / 100;

        // A. Price Match
        const matchesPrice = priceRupees <= maxPrice;

        // B. Collection Filter Check
        let matchesCollection = true;
        if (selectedCollections.length > 0) {
          matchesCollection = selectedCollections.some(selCol => {
            const normalizedKeyword = selCol.replace(/-/g, ' ');
            return cardCollections.includes(selCol) || title.includes(normalizedKeyword);
          });
        }

        // C. Tag Groups Filter Check (AND between different groups, OR within same group)
        let matchesTagGroups = true;
        for (const groupId in activeTagGroups) {
          const selectedTagsInGroup = activeTagGroups[groupId];
          const matchesThisGroup = selectedTagsInGroup.some(tagVal => {
            const normalizedTag = tagVal.replace(/-/g, ' ');
            return (
              tags.includes(tagVal) ||
              title.includes(tagVal) ||
              type.includes(tagVal) ||
              tags.includes(normalizedTag) ||
              title.includes(normalizedTag)
            );
          });

          if (!matchesThisGroup) {
            matchesTagGroups = false;
            break;
          }
        }

        // Overall Visibility
        if (matchesPrice && matchesCollection && matchesTagGroups) {
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
