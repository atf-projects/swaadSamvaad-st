/**
 * Swaad Samvaad - Luxury Policy & General Page Scripts
 * File: assets/ss-main-page.js
 */

document.addEventListener('DOMContentLoaded', function () {
  initPageFaqAccordions();
  highlightActiveSidebarLink();
});

// 1. FAQ Accordion Toggle within page blocks
function initPageFaqAccordions() {
  const faqToggles = document.querySelectorAll('.ss-page-faq-toggle');
  if (!faqToggles.length) return;

  faqToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      const item = toggle.closest('.ss-page-faq-item');
      const content = item.querySelector('.ss-page-faq-content');
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        toggle.setAttribute('aria-expanded', 'false');
        content.hidden = true;
        item.classList.remove('is-active');
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        content.hidden = false;
        item.classList.add('is-active');
      }
    });
  });
}

// 2. Highlight Sidebar Active link based on Current URL pathname
function highlightActiveSidebarLink() {
  const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
  const navLinks = document.querySelectorAll('.ss-page-nav-link');

  navLinks.forEach(function (link) {
    const linkPath = link.getAttribute('href').toLowerCase().replace(/\/$/, '');
    if (currentPath === linkPath || (linkPath && currentPath.endsWith(linkPath))) {
      link.classList.add('is-active');
    }
  });
}
