/**
 * SWAAD SAMVAAD - Single Blog Article Controller (assets/ss-article-page.js)
 * - Copy Link with feedback
 * - AJAX Add to Basket integration with Cart Drawer
 */

(() => {
  const initArticlePage = () => {
    const articleSection = document.querySelector('[data-ss-article-page]');
    if (!articleSection) return;

    // 1. Copy Article Link handler
    const copyButtons = articleSection.querySelectorAll('[data-ss-copy-url]');
    copyButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const urlToCopy = btn.getAttribute('data-ss-copy-url') || window.location.href;

        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(urlToCopy);
          } else {
            // Fallback for older browsers
            const tempInput = document.createElement('input');
            tempInput.value = urlToCopy;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
          }

          const copyTextSpan = btn.querySelector('.ss-copy-text');
          if (copyTextSpan) {
            const orig = copyTextSpan.textContent;
            copyTextSpan.textContent = 'Copied! ✓';
            setTimeout(() => {
              copyTextSpan.textContent = orig;
            }, 2500);
          } else {
            btn.classList.add('is-copied');
            setTimeout(() => {
              btn.classList.remove('is-copied');
            }, 2500);
          }
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
      });
    });

    // 2. Add to Basket Integration (Sidebar + Bottom Products)
    const addButtons = articleSection.querySelectorAll('[data-ss-article-add-cart]');
    addButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const variantId = btn.getAttribute('data-variant-id');
        if (!variantId) return;

        const originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `
          <svg class="ss-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;animation:ssArtSpin 0.8s linear infinite;">
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
    document.addEventListener('DOMContentLoaded', initArticlePage, { once: true });
  } else {
    initArticlePage();
  }
})();
