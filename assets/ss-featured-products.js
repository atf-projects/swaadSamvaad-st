/**
 * SWAAD SAMVAAD - Featured Products Component Controller
 * Supports category tabs filtering, empty state / coming soon handler,
 * interactive wishlist, Ajax Add to Cart, and On-Hover Carousel navigation.
 */

class SSFeaturedProducts extends HTMLElement {
  constructor() {
    super();
    this.sectionId = this.dataset.sectionId;
    this.activeCategory = 'all';
  }

  connectedCallback() {
    this.tabs = this.querySelectorAll('.ss-featured-prods__tab-btn');
    this.cards = this.querySelectorAll('.ss-prod-card');
    this.wishlistBtns = this.querySelectorAll('.ss-prod-card__wishlist-btn');
    this.addBtns = this.querySelectorAll('.ss-prod-card__add-btn');
    this.track = this.querySelector('.ss-featured-prods__track');
    this.carouselContainer = this.querySelector('.ss-featured-prods__carousel-container');
    this.carouselWrapper = this.querySelector('.ss-featured-prods__carousel-wrapper');
    this.emptyState = this.querySelector('.ss-featured-prods__empty-state');
    this.emptyStateBtn = this.querySelector('.ss-featured-prods__empty-btn');
    this.prevBtn = this.querySelector('.ss-featured-prods__nav-arrow--prev');
    this.nextBtn = this.querySelector('.ss-featured-prods__nav-arrow--next');

    this.initTabs();
    this.initCarousel();
    this.initWishlist();
    this.initAddToCart();
    this.initEmptyState();
  }

  /* --------------------------------------------------------------------------
     1. Carousel Navigation Arrows & Dynamic Overflow Handling
     -------------------------------------------------------------------------- */
  initCarousel() {
    if (!this.track) return;

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const cardWidth = this.getScrollStep();
        this.track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const cardWidth = this.getScrollStep();
        this.track.scrollBy({ left: cardWidth, behavior: 'smooth' });
      });
    }

    // Update disabled state on scroll
    this.track.addEventListener('scroll', () => {
      this.updateArrowStates();
    }, { passive: true });

    // Handle overflow check on window resize
    window.addEventListener('resize', () => {
      this.checkOverflow();
    }, { passive: true });

    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(() => {
        this.checkOverflow();
      });
      resizeObserver.observe(this.track);
    }

    // Initial check
    setTimeout(() => {
      this.checkOverflow();
    }, 50);
  }

  checkOverflow() {
    if (!this.track || !this.carouselContainer) return;
    // Determine if cards actually overflow the visible track width
    const hasOverflow = this.track.scrollWidth > this.track.clientWidth + 6;

    if (hasOverflow) {
      this.carouselContainer.classList.add('has-overflow');
      this.updateArrowStates();
    } else {
      this.carouselContainer.classList.remove('has-overflow');
    }
  }

  getScrollStep() {
    const firstCard = this.querySelector('.ss-prod-card:not([style*="display: none"])');
    if (firstCard) {
      const cardRect = firstCard.getBoundingClientRect();
      const style = window.getComputedStyle(this.track);
      const gap = parseFloat(style.gap) || 20;
      return cardRect.width + gap;
    }
    return 280;
  }

  updateArrowStates() {
    if (!this.track) return;
    const maxScrollLeft = this.track.scrollWidth - this.track.clientWidth;

    if (this.prevBtn) {
      this.prevBtn.disabled = this.track.scrollLeft <= 5;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.track.scrollLeft >= maxScrollLeft - 5;
    }
  }

  /* --------------------------------------------------------------------------
     2. Category Tabs Filtering & Coming Soon Handler
     -------------------------------------------------------------------------- */
  initTabs() {
    if (!this.tabs.length) return;

    this.tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetCategory = tab.dataset.category || 'all';

        // Update active tab class
        this.tabs.forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        this.filterCards(targetCategory);
      });
    });
  }

  filterCards(category) {
    this.activeCategory = category;
    let visibleCount = 0;

    this.cards.forEach((card) => {
      const cardCategory = (card.dataset.category || 'all').toLowerCase();
      const shouldShow = category === 'all' || cardCategory.includes(category.toLowerCase());

      if (shouldShow) {
        visibleCount++;
        card.style.display = 'flex';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.96)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 15);
      } else {
        card.style.display = 'none';
      }
    });

    // Handle Empty State / Coming Soon message
    if (visibleCount === 0) {
      if (this.carouselWrapper) this.carouselWrapper.style.display = 'none';
      if (this.carouselContainer) this.carouselContainer.classList.remove('has-overflow');
      if (this.emptyState) {
        this.emptyState.style.display = 'flex';
        const categoryNameEl = this.emptyState.querySelector('.ss-featured-prods__empty-category');
        if (categoryNameEl) {
          const formattedName = category.charAt(0).toUpperCase() + category.slice(1);
          categoryNameEl.textContent = formattedName;
        }
      }
    } else {
      if (this.carouselWrapper) this.carouselWrapper.style.display = 'block';
      if (this.emptyState) this.emptyState.style.display = 'none';

      if (this.track) {
        this.track.scrollTo({ left: 0, behavior: 'smooth' });
        setTimeout(() => {
          this.checkOverflow();
          this.updateArrowStates();
        }, 100);
      }
    }
  }

  initEmptyState() {
    if (this.emptyStateBtn) {
      this.emptyStateBtn.addEventListener('click', () => {
        const allTab = this.querySelector('.ss-featured-prods__tab-btn[data-category="all"]');
        if (allTab) {
          allTab.click();
        } else if (this.tabs[0]) {
          this.tabs[0].click();
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     3. Wishlist Toggle (Local Storage + Toast)
     -------------------------------------------------------------------------- */
  initWishlist() {
    const savedWishlist = JSON.parse(localStorage.getItem('ss_wishlist') || '[]');

    this.wishlistBtns.forEach((btn) => {
      const handle = btn.dataset.productHandle || btn.dataset.productId;
      if (handle && savedWishlist.includes(handle)) {
        btn.classList.add('is-active');
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const currentList = JSON.parse(localStorage.getItem('ss_wishlist') || '[]');
        const isAdded = btn.classList.toggle('is-active');

        if (isAdded) {
          if (!currentList.includes(handle)) currentList.push(handle);
          this.showToast('Added to Wishlist ❤️');
        } else {
          const index = currentList.indexOf(handle);
          if (index > -1) currentList.splice(index, 1);
          this.showToast('Removed from Wishlist');
        }

        localStorage.setItem('ss_wishlist', JSON.stringify(currentList));
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. Ajax Add to Cart
     -------------------------------------------------------------------------- */
  initAddToCart() {
    this.addBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const variantId = btn.dataset.variantId;
        if (!variantId) {
          const productUrl = btn.dataset.productUrl;
          if (productUrl) {
            window.location.href = productUrl;
          }
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        btn.classList.add('is-loading');
        btn.disabled = true;

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
            const data = await response.json();
            btn.classList.remove('is-loading');
            btn.classList.add('is-success');

            const textEl = btn.querySelector('.ss-prod-card__btn-text');
            const originalText = textEl ? textEl.textContent : 'ADD';
            if (textEl) textEl.textContent = 'ADDED ✓';

            this.showToast('Added to Cart! 🛒');

            // Dispatch global events
            document.dispatchEvent(new CustomEvent('cart:updated', { bubbles: true, detail: data }));
            document.dispatchEvent(new CustomEvent('theme:cart:change', { bubbles: true }));

            // Update cart bubble
            const cartBubbles = document.querySelectorAll('.cart-count-bubble, [data-cart-count]');
            cartBubbles.forEach(async (bubble) => {
              try {
                const cartRes = await fetch('/cart.js');
                const cartData = await cartRes.json();
                bubble.textContent = cartData.item_count;
                bubble.removeAttribute('hidden');
              } catch (err) {}
            });

            // Open cart drawer if present
            const cartDrawer = document.querySelector('cart-drawer-component, #cart-drawer, [id*="cart-drawer"]');
            if (cartDrawer && typeof cartDrawer.open === 'function') {
              cartDrawer.open();
            }

            setTimeout(() => {
              btn.classList.remove('is-success');
              btn.disabled = false;
              if (textEl) textEl.textContent = originalText;
            }, 2000);
          } else {
            throw new Error('Cart add failed');
          }
        } catch (err) {
          console.error('Error adding item to cart:', err);
          btn.classList.remove('is-loading');
          btn.disabled = false;
          this.showToast('Could not add to cart. Try opening product page.');
        }
      });
    });
  }

  showToast(message) {
    let toast = document.querySelector('.ss-fp-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'ss-fp-toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('is-visible');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2500);
  }
}

if (!customElements.get('ss-featured-products')) {
  customElements.define('ss-featured-products', SSFeaturedProducts);
}
