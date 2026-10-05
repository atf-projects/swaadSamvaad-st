/**
 * SWAAD SAMVAAD - Cart Page Controller
 * - AJAX Quantity Steppers, Item Removal
 * - Dynamic Free Shipping Progress Calculation
 * - Gift Note Saving
 * - Upsell Quick Adds
 */

(() => {
  const FREE_SHIPPING_THRESHOLD = 49900;

  const initCartPage = () => {
    const page = document.querySelector('[data-ss-cart-page]');
    if (!page) return;

    // 1. Steppers & Remove
    page.addEventListener('click', async (e) => {
      const stepper = e.target.closest('[data-page-stepper]');
      const removeBtn = e.target.closest('[data-page-remove]');
      const upsellBtn = e.target.closest('[data-ss-upsell-btn]');
      const saveNoteBtn = e.target.closest('[data-ss-save-note]');

      if (stepper) {
        e.preventDefault();
        const action = stepper.dataset.pageStepper;
        const line = parseInt(stepper.dataset.line, 10);
        const qty = parseInt(stepper.dataset.qty, 10);
        const newQty = action === 'plus' ? qty + 1 : Math.max(0, qty - 1);
        await updateCartLine(line, newQty);
      }

      if (removeBtn) {
        e.preventDefault();
        const line = parseInt(removeBtn.dataset.pageRemove, 10);
        await updateCartLine(line, 0);
      }

      if (upsellBtn) {
        e.preventDefault();
        const variantId = upsellBtn.dataset.upsellVariantId;
        if (variantId) {
          const originalContent = upsellBtn.innerHTML;
          upsellBtn.innerHTML = '<span>Adding...</span>';
          upsellBtn.disabled = true;
          try {
            const res = await fetch('/cart/add.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify({ id: variantId, quantity: 1 })
            });
            if (res.ok) {
              upsellBtn.innerHTML = '<span>Added ✓</span>';
              window.location.reload();
            } else {
              upsellBtn.innerHTML = originalContent;
              upsellBtn.disabled = false;
            }
          } catch (err) {
            upsellBtn.innerHTML = originalContent;
            upsellBtn.disabled = false;
          }
        }
      }

      if (saveNoteBtn) {
        e.preventDefault();
        const textarea = page.querySelector('[data-ss-cart-note]');
        if (textarea) {
          saveNoteBtn.textContent = 'Saving...';
          try {
            await fetch('/cart/update.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify({ note: textarea.value })
            });
            saveNoteBtn.textContent = 'Saved ✓';
            setTimeout(() => {
              saveNoteBtn.textContent = 'Save Note';
            }, 2000);
          } catch (err) {
            saveNoteBtn.textContent = 'Save Note';
          }
        }
      }
    });

    const updateCartLine = async (line, quantity) => {
      try {
        const res = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ line, quantity })
        });
        if (res.ok) {
          window.location.reload();
        }
      } catch (err) {
        console.error('Error updating cart line:', err);
      }
    };
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartPage, { once: true });
  } else {
    initCartPage();
  }
})();
