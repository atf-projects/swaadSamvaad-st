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

    // 1. Subject Chips Handler
    const chips = section.querySelectorAll('.ss-contact-chip');
    const subjectInput = section.querySelector('#ss-contact-subject-input');

    if (chips.length > 0 && subjectInput) {
      chips.forEach((chip) => {
        chip.addEventListener('click', () => {
          chips.forEach((c) => c.classList.remove('is-active'));
          chip.classList.add('is-active');
          const subject = chip.getAttribute('data-subject');
          if (subject) {
            subjectInput.value = subject;
          }
        });
      });
    }

    // 2. Form Submit State
    const contactForm = section.querySelector('#ss-main-contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', () => {
        const submitBtn = contactForm.querySelector('.ss-contact-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Sending Message... ⏳</span>';
          submitBtn.style.opacity = '0.7';
        }
      });
    }

    // 3. FAQ Accordion Single Open Behavior (Optional Enhancement)
    const faqDetails = section.querySelectorAll('.ss-contact-faq-item');
    if (faqDetails.length > 0) {
      faqDetails.forEach((targetDetail) => {
        targetDetail.addEventListener('toggle', () => {
          if (targetDetail.open) {
            faqDetails.forEach((detail) => {
              if (detail !== targetDetail && detail.open) {
                detail.open = false;
              }
            });
          }
        });
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
