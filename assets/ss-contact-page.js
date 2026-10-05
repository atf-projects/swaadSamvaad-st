/**
 * Swaad Samvaad - Contact Page Interactive JavaScript
 * File: assets/ss-contact-page.js
 * 100% Vanilla JS - Modular, Performant & Robust
 */

(function () {
  'use strict';

  function initContactPage() {
    const section = document.querySelector('[data-ss-contact-page]');
    if (!section) return;

    // 1. Form Submit State Indicator
    const contactForm = section.querySelector('#ss-main-contact-form');
    if (contactForm && !contactForm.dataset.initialized) {
      contactForm.dataset.initialized = 'true';
      contactForm.addEventListener('submit', () => {
        const submitBtn = contactForm.querySelector('.ss-contact-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Sending Message... ⏳</span>';
          submitBtn.style.opacity = '0.7';
        }
      });
    }

    // 2. FAQ Accordion Single Open Behavior
    const faqDetails = section.querySelectorAll('.ss-contact-faq-item');
    if (faqDetails.length > 0) {
      faqDetails.forEach((targetDetail) => {
        if (!targetDetail.dataset.initialized) {
          targetDetail.dataset.initialized = 'true';
          targetDetail.addEventListener('toggle', () => {
            if (targetDetail.open) {
              faqDetails.forEach((detail) => {
                if (detail !== targetDetail && detail.open) {
                  detail.open = false;
                }
              });
            }
          });
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactPage);
  } else {
    initContactPage();
  }

  document.addEventListener('shopify:section:load', (event) => {
    if (event.target.querySelector('[data-ss-contact-page]')) {
      initContactPage();
    }
  });
})();
