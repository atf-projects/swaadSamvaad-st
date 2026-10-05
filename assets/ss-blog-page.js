/**
 * SWAAD SAMVAAD - Blog Page Controller (assets/ss-blog-page.js)
 * - Category/Tag chip interaction
 * - Smooth scroll & micro-interactions
 */

(() => {
  const initBlogPage = () => {
    const blogSection = document.querySelector('[data-ss-blog-page]');
    if (!blogSection) return;

    // Filter Chips Active State (if buttons are used)
    const filterChips = blogSection.querySelectorAll('.ss-blog-filter-chip');
    filterChips.forEach((chip) => {
      chip.addEventListener('click', (e) => {
        // If it is an <a> tag, standard Shopify navigation takes place
        if (chip.tagName.toLowerCase() === 'button') {
          e.preventDefault();
          filterChips.forEach((c) => c.classList.remove('is-active'));
          chip.classList.add('is-active');
        }
      });
    });
    // Featured Products Add-to-Basket Integration
    const addButtons = blogSection.querySelectorAll('[data-ss-blog-add-cart]');
    addButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const variantId = btn.getAttribute('data-variant-id');
        if (!variantId) return;

        const originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `
          <svg class="ss-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;animation:ssSpin 0.8s linear infinite;">
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
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogPage, { once: true });
  } else {
    initBlogPage();
  }
})();
