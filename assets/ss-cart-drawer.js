/**
 * SWAAD SAMVAAD - Cart Drawer (Basket Sidebar) Controller
 * - AJAX Cart Fetch, Add, Update & Remove
 * - Dynamic Free Shipping Progress Calculation
 * - Mithila Combo Upsell Integration
 * - Global Cart Drawer Open/Close/Refresh API
 */

(() => {
  const DRAWER_ID = 'SwaadCartDrawer';
  const FREE_SHIPPING_THRESHOLD = 49900; // in cents/paise (₹499.00)

  class SwaadCartDrawerController {
    constructor() {
      this.drawer = document.getElementById(DRAWER_ID);
      if (!this.drawer) return;

      this.backdrop = this.drawer.querySelector('.ss-cart-drawer__backdrop');
      this.closeBtns = this.drawer.querySelectorAll('[data-ss-cart-close]');
      this.itemsContainer = this.drawer.querySelector('[data-ss-cart-items]');
      this.emptyState = this.drawer.querySelector('[data-ss-cart-empty]');
      this.footer = this.drawer.querySelector('[data-ss-cart-footer]');
      this.subtotalEl = this.drawer.querySelector('[data-ss-cart-subtotal]');
      this.shippingText = this.drawer.querySelector('[data-ss-shipping-text]');
      this.progressFill = this.drawer.querySelector('[data-ss-progress-fill]');
      this.upsellBtn = this.drawer.querySelector('[data-ss-upsell-btn]');

      this.initEvents();
    }

    initEvents() {
      // Close button & backdrop
      this.closeBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.close();
        });
      });

      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
      });

      // Cart Trigger Buttons across store
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.ss-cart-btn, [data-ss-cart-trigger], a[href="/cart"]:not(.ss-cart-drawer__view-cart-btn)');
        if (trigger) {
          // If on /cart page itself, let navigation work, otherwise open drawer
          if (window.location.pathname === '/cart') return;
          e.preventDefault();
          e.stopPropagation();
          this.open();
        }
      });

      // Quantity buttons & remove actions inside drawer
      if (this.drawer) {
        this.drawer.addEventListener('click', async (e) => {
          const stepperBtn = e.target.closest('[data-stepper-action]');
          const removeBtn = e.target.closest('[data-remove-action]');
          const upsellAdd = e.target.closest('[data-ss-upsell-btn]');

          if (stepperBtn) {
            e.preventDefault();
            const action = stepperBtn.dataset.stepperAction;
            const lineIndex = parseInt(stepperBtn.dataset.line, 10);
            const currentQty = parseInt(stepperBtn.dataset.qty, 10);
            const newQty = action === 'plus' ? currentQty + 1 : Math.max(0, currentQty - 1);
            await this.updateItemQuantity(lineIndex, newQty);
          }

          if (removeBtn) {
            e.preventDefault();
            const lineIndex = parseInt(removeBtn.dataset.line, 10);
            await this.updateItemQuantity(lineIndex, 0);
          }

          if (upsellAdd) {
            e.preventDefault();
            const variantId = upsellAdd.dataset.upsellVariantId;
            if (variantId) {
              await this.addUpsellItem(variantId, upsellAdd);
            }
          }
        });
      }

      // Listen to external cart update events
      document.addEventListener('cart:updated', () => this.refresh());
      document.addEventListener('cart:refresh', () => this.refresh());
      document.addEventListener('theme:cart:change', () => this.refresh());
    }

    isOpen() {
      return this.drawer.classList.contains('is-open');
    }

    open() {
      if (!this.drawer) return;
      this.drawer.removeAttribute('hidden');
      requestAnimationFrame(() => {
        this.drawer.classList.add('is-open');
      });
      document.body.style.overflow = 'hidden';
      this.refresh();
    }

    close() {
      if (!this.drawer) return;
      this.drawer.classList.remove('is-open');
      setTimeout(() => {
        if (!this.isOpen()) {
          this.drawer.setAttribute('hidden', '');
          document.body.style.overflow = '';
        }
      }, 300);
    }

    formatMoney(cents) {
      const rupees = (cents / 100).toFixed(0);
      return `₹${rupees}`;
    }

    updateHeaderCount(count) {
      const badges = document.querySelectorAll('.ss-cart-count-badge, .cart-count-bubble, [data-cart-count]');
      badges.forEach((b) => {
        b.textContent = count;
        if (count > 0) {
          b.removeAttribute('hidden');
        }
      });
    }

    async refresh() {
      try {
        const res = await fetch('/cart.js');
        if (!res.ok) return;
        const cart = await res.json();
        this.renderCart(cart);
      } catch (err) {
        console.error('Error refreshing Swaad cart drawer:', err);
      }
    }

    async updateItemQuantity(line, quantity) {
      try {
        const res = await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ line, quantity })
        });

        if (res.ok) {
          const cart = await res.json();
          this.renderCart(cart);
          document.dispatchEvent(new CustomEvent('cart:updated', { bubbles: true, detail: cart }));
        }
      } catch (err) {
        console.error('Error updating item quantity:', err);
      }
    }

    async addUpsellItem(variantId, btn) {
      if (btn) {
        btn.textContent = 'Adding...';
        btn.disabled = true;
      }
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
          if (btn) btn.textContent = 'Added ✓';
          await this.refresh();
          document.dispatchEvent(new CustomEvent('cart:updated', { bubbles: true }));
          setTimeout(() => {
            if (btn) {
              btn.textContent = 'Add';
              btn.disabled = false;
            }
          }, 1500);
        }
      } catch (err) {
        console.error('Error adding upsell item:', err);
        if (btn) {
          btn.textContent = 'Add';
          btn.disabled = false;
        }
      }
    }

    renderCart(cart) {
      this.updateHeaderCount(cart.item_count);

      // 1. Subtotal & Savings
      if (this.subtotalEl) {
        this.subtotalEl.textContent = this.formatMoney(cart.total_price);
      }

      const savingsBadge = this.drawer.querySelector('[data-ss-cart-savings]');
      let totalSavings = cart.total_discount || 0;
      if (cart.items) {
        cart.items.forEach((item) => {
          if (item.original_line_price > item.final_line_price) {
            totalSavings += (item.original_line_price - item.final_line_price);
          }
        });
      }
      if (savingsBadge) {
        if (totalSavings > 0) {
          savingsBadge.style.display = 'block';
          savingsBadge.innerHTML = `<span>🎉 You save ${this.formatMoney(totalSavings)} on this order</span>`;
        } else {
          savingsBadge.style.display = 'none';
        }
      }

      // 2. Free Delivery Goal Bar
      const subtotal = cart.total_price;
      const threshold = FREE_SHIPPING_THRESHOLD;
      if (this.shippingText && this.progressFill) {
        if (subtotal >= threshold) {
          this.shippingText.innerHTML = `🎉 You've unlocked <strong>FREE Delivery!</strong>`;
          this.progressFill.style.width = '100%';
        } else {
          const diff = threshold - subtotal;
          const pct = Math.min(100, Math.max(0, (subtotal / threshold) * 100));
          this.shippingText.innerHTML = `Add <strong>${this.formatMoney(diff)}</strong> more for <strong>FREE Delivery!</strong>`;
          this.progressFill.style.width = `${pct}%`;
        }
      }

      // 3. Toggle Empty / Filled State
      if (cart.item_count === 0) {
        if (this.emptyState) this.emptyState.classList.remove('ss-cart-drawer__empty--hidden');
        if (this.itemsContainer) this.itemsContainer.classList.add('ss-cart-drawer__items-list--hidden');
        if (this.footer) this.footer.classList.add('ss-cart-drawer__footer--hidden');
        return;
      }

      if (this.emptyState) this.emptyState.classList.add('ss-cart-drawer__empty--hidden');
      if (this.itemsContainer) this.itemsContainer.classList.remove('ss-cart-drawer__items-list--hidden');
      if (this.footer) this.footer.classList.remove('ss-cart-drawer__footer--hidden');

      // 4. Render Items
      if (this.itemsContainer) {
        this.itemsContainer.innerHTML = cart.items.map((item, index) => {
          const lineIndex = index + 1;
          const imageSrc = item.featured_image?.url || item.image || '';
          const variantText = (item.variant_title && item.variant_title !== 'Default Title')
            ? `${item.variant_title} · Fried in Pure Desi Ghee`
            : 'Traditional Recipe · Fried in Pure Desi Ghee';

          return `
            <div class="ss-cart-item" data-line-key="${item.key}" data-line-index="${lineIndex}">
              <div class="ss-cart-item__media">
                ${imageSrc ? `<img src="${imageSrc}" alt="${item.title}" class="ss-cart-item__img" width="70" height="70" loading="lazy">` : `<div class="ss-cart-item__img-placeholder">🍪</div>`}
              </div>

              <div class="ss-cart-item__info">
                <div class="ss-cart-item__top-row">
                  <h4 class="ss-cart-item__title">
                    <a href="${item.url}">${item.product_title || item.title}</a>
                  </h4>
                  <div class="ss-cart-item__price">${this.formatMoney(item.final_line_price)}</div>
                </div>

                <div class="ss-cart-item__variant-text">${variantText}</div>

                <div class="ss-cart-item__bottom-row">
                  <div class="ss-cart-stepper">
                    <button type="button" class="ss-cart-stepper__btn ss-cart-stepper__btn--minus" data-stepper-action="minus" data-line="${lineIndex}" data-qty="${item.quantity}" aria-label="Decrease quantity">−</button>
                    <span class="ss-cart-stepper__val">${item.quantity}</span>
                    <button type="button" class="ss-cart-stepper__btn ss-cart-stepper__btn--plus" data-stepper-action="plus" data-line="${lineIndex}" data-qty="${item.quantity}" aria-label="Increase quantity">+</button>
                  </div>
                  <button type="button" class="ss-cart-item__remove-btn" data-line="${lineIndex}" data-remove-action>Remove</button>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  // Initialize and attach to window
  const init = () => {
    window.SwaadCartDrawer = new SwaadCartDrawerController();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
