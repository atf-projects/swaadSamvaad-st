/**
 * Swaad Samvaad - Single Product Page Interactive JavaScript
 * File: assets/ss-product-page.js
 * 100% Vanilla JS - Modular, Performant & Robust
 */

(function () {
  "use strict";

  function initSingleProductPage() {
    const section = document.querySelector("[data-ss-product-page]");
    if (!section) return;

    // Elements
    const mainImg = section.querySelector("[data-ss-main-img]");
    const thumbBtns = section.querySelectorAll(".ss-prod-thumb-btn");
    const variantChips = section.querySelectorAll(".ss-prod-weight-chip");
    const selectedWeightName = section.querySelector(
      "[data-ss-selected-weight]",
    );
    const currentPriceEl = section.querySelector("[data-ss-current-price]");
    const comparePriceEl = section.querySelector("[data-ss-compare-price]");
    const savingsPill = section.querySelector("[data-ss-savings-pill]");
    const savingsAmt = section.querySelector("[data-ss-savings-amt]");
    const savingsPct = section.querySelector("[data-ss-savings-pct]");
    const discountBadge = section.querySelector("[data-ss-discount-badge]");

    const qtyInput = section.querySelector("[data-ss-qty-input]");
    const qtyBtns = section.querySelectorAll("[data-qty-change]");
    const addBasketBtn = section.querySelector("[data-ss-prod-add-basket]");
    const buyNowBtn = section.querySelector("[data-ss-prod-buy-now]");
    const wishlistBtn = section.querySelector(".ss-prod-gallery__wishlist-btn");

    const pincodeInput = section.querySelector("[data-ss-pincode-input]");
    const pincodeBtn = section.querySelector("[data-ss-pincode-check]");
    const pincodeResult = section.querySelector("[data-ss-pincode-result]");

    const stickyBar = section.querySelector("[data-ss-sticky-bar]");
    const stickyPrice = section.querySelector("[data-ss-sticky-price]");
    const stickyAddBtn = section.querySelector("[data-ss-sticky-add]");

    // Tabs
    const tabBtns = section.querySelectorAll(".ss-prod-tab-btn");
    const tabPanes = section.querySelectorAll(".ss-prod-tab-pane");

    let activeVariantId = addBasketBtn
      ? addBasketBtn.getAttribute("data-variant-id")
      : "1";

    // 1. Gallery Thumbnail Switcher
    if (thumbBtns.length > 0 && mainImg) {
      thumbBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          thumbBtns.forEach((b) => b.classList.remove("is-active"));
          btn.classList.add("is-active");
          const newSrc = btn.getAttribute("data-img-src");
          if (newSrc) {
            mainImg.style.opacity = "0.4";
            setTimeout(() => {
              mainImg.src = newSrc;
              mainImg.style.opacity = "1";
            }, 120);
          }
        });
      });
    }

    // 2. Variant Weight Chips Switcher
    if (variantChips.length > 0) {
      variantChips.forEach((chip) => {
        chip.addEventListener("click", () => {
          variantChips.forEach((c) => c.classList.remove("is-active"));
          chip.classList.add("is-active");

          const variantId = chip.getAttribute("data-variant-id");
          const price = chip.getAttribute("data-price");
          const compare = chip.getAttribute("data-compare");
          const rawPrice = parseFloat(chip.getAttribute("data-raw-price")) || 0;
          const rawCompare =
            parseFloat(chip.getAttribute("data-raw-compare")) || 0;
          const weightTitle = chip.getAttribute("data-weight-title");

          activeVariantId = variantId;

          // Update Titles & Buttons
          if (selectedWeightName && weightTitle) {
            selectedWeightName.textContent = weightTitle;
          }
          if (addBasketBtn)
            addBasketBtn.setAttribute("data-variant-id", variantId);
          if (buyNowBtn) buyNowBtn.setAttribute("data-variant-id", variantId);
          if (stickyAddBtn)
            stickyAddBtn.setAttribute("data-variant-id", variantId);

          // Update Price Displays
          if (currentPriceEl && price) currentPriceEl.textContent = price;
          if (stickyPrice && price) stickyPrice.textContent = price;

          if (rawCompare > rawPrice) {
            if (comparePriceEl) {
              comparePriceEl.textContent = compare;
              comparePriceEl.style.display = "inline";
            }
            const savings = rawCompare - rawPrice;
            const pct = Math.round((savings / rawCompare) * 100);

            if (savingsPill) {
              savingsPill.style.display = "inline-block";
              if (savingsAmt)
                savingsAmt.textContent = comparePriceEl
                  ? `Rs. ${(savings / 100).toFixed(2)}`
                  : "";
              if (savingsPct) savingsPct.textContent = `${pct}% OFF`;
            }
            if (discountBadge) {
              discountBadge.textContent = `${pct}% OFF`;
              discountBadge.style.display = "block";
            }
          } else {
            if (comparePriceEl) comparePriceEl.style.display = "none";
            if (savingsPill) savingsPill.style.display = "none";
            if (discountBadge) discountBadge.style.display = "none";
          }
        });
      });
    }

    // 3. Quantity Stepper
    if (qtyBtns.length > 0 && qtyInput) {
      qtyBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const delta = parseInt(btn.getAttribute("data-qty-change"), 10) || 0;
          let currentVal = parseInt(qtyInput.value, 10) || 1;
          currentVal = Math.max(1, Math.min(20, currentVal + delta));
          qtyInput.value = currentVal;
        });
      });
    }

    // 4. Horizontal Product Information Tabs Switcher
    if (tabBtns.length > 0) {
      tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const targetSelector = btn.getAttribute("data-tab-target");
          const targetPane = section.querySelector(targetSelector);

          tabBtns.forEach((b) => {
            b.classList.remove("is-active");
            b.setAttribute("aria-selected", "false");
          });
          tabPanes.forEach((p) => p.classList.remove("is-active"));

          btn.classList.add("is-active");
          btn.setAttribute("aria-selected", "true");

          if (targetPane) {
            targetPane.classList.add("is-active");
          }
        });
      });
    }

    // 5. AJAX Add to Basket helper
    async function addToCart(
      variantId,
      quantity = 1,
      isBuyNow = false,
      triggerBtn = null,
    ) {
      try {
        const payload = {
          items: [
            {
              id: parseInt(variantId, 10),
              quantity: parseInt(quantity, 10),
            },
          ],
        };

        const response = await fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          if (isBuyNow) {
            window.location.href = "/checkout";
            return;
          }

          // Trigger Drawer or Cart Updates
          if (
            window.SwaadCartDrawer &&
            typeof window.SwaadCartDrawer.open === "function"
          ) {
            window.SwaadCartDrawer.open();
          } else {
            document.dispatchEvent(
              new CustomEvent("cart:updated", { bubbles: true }),
            );
          }

          // Visual Feedback on Button
          const btnToAnimate = triggerBtn || addBasketBtn;
          if (btnToAnimate) {
            const originalHTML = btnToAnimate.innerHTML;
            btnToAnimate.innerHTML = "<span>✓ ADDED!</span>";
            btnToAnimate.style.background = "#2E7D32";
            btnToAnimate.style.borderColor = "#2E7D32";
            setTimeout(() => {
              btnToAnimate.innerHTML = originalHTML;
              btnToAnimate.style.background = "";
              btnToAnimate.style.borderColor = "";
            }, 1800);
          }
        } else {
          if (isBuyNow) {
            window.location.href = "/checkout";
          }
        }
      } catch (err) {
        console.warn("Cart Add Exception, redirecting:", err);
        if (isBuyNow) window.location.href = "/checkout";
      }
    }

    // Add To Basket Handler
    if (addBasketBtn) {
      addBasketBtn.addEventListener("click", () => {
        const vId =
          addBasketBtn.getAttribute("data-variant-id") || activeVariantId;
        const q = qtyInput ? qtyInput.value : 1;
        addToCart(vId, q, false, addBasketBtn);
      });
    }

    // Sticky Bar Add Handler
    if (stickyAddBtn) {
      stickyAddBtn.addEventListener("click", () => {
        const vId =
          stickyAddBtn.getAttribute("data-variant-id") || activeVariantId;
        const q = qtyInput ? qtyInput.value : 1;
        addToCart(vId, q, false, stickyAddBtn);
      });
    }

    // Buy It Now Handler
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        const vId =
          buyNowBtn.getAttribute("data-variant-id") || activeVariantId;
        const q = qtyInput ? qtyInput.value : 1;
        addToCart(vId, q, true);
      });
    }

    // Related Products Add To Basket handler
    const relAddBtns = section.querySelectorAll("[data-ss-rec-add-cart]");
    if (relAddBtns.length > 0) {
      relAddBtns.forEach((rBtn) => {
        rBtn.addEventListener("click", () => {
          const vId = rBtn.getAttribute("data-variant-id") || "1";
          addToCart(vId, 1, false, rBtn);
        });
      });
    }

    // Wishlist Toggle (Main + Related)
    const allWishlistBtns = section.querySelectorAll(
      ".ss-prod-gallery__wishlist-btn, .ss-prod-rec-card__wishlist-btn, .ss-prod-card__wishlist-btn",
    );
    if (allWishlistBtns.length > 0) {
      allWishlistBtns.forEach((wBtn) => {
        wBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          wBtn.classList.toggle("is-active");
        });
      });
    }

    // 8. Pincode Delivery Estimator Checker
    if (pincodeBtn && pincodeInput && pincodeResult) {
      pincodeBtn.addEventListener("click", () => {
        const val = pincodeInput.value.trim();
        if (/^\d{6}$/.test(val)) {
          pincodeResult.innerHTML = `✓ Express Delivery available to <strong>${val}</strong> in <strong>3-4 Business Days</strong>! Free Shipping Eligible.`;
          pincodeResult.style.display = "block";
          pincodeResult.style.color = "var(--ss-prod-green)";
          pincodeResult.style.background = "#E8F5E9";
          pincodeResult.style.borderColor = "var(--ss-prod-green)";
        } else {
          pincodeResult.innerHTML = `⚠ Please enter a valid 6-digit Indian PIN code.`;
          pincodeResult.style.display = "block";
          pincodeResult.style.color = "#C62828";
          pincodeResult.style.background = "#FFEBEE";
          pincodeResult.style.borderColor = "#C62828";
        }
      });
    }

    // 9. Mobile Sticky Bottom Bar Scroll Observer
    if (stickyBar && addBasketBtn) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              stickyBar.classList.add("is-visible");
              stickyBar.setAttribute("aria-hidden", "false");
            } else {
              stickyBar.classList.remove("is-visible");
              stickyBar.setAttribute("aria-hidden", "true");
            }
          });
        },
        { threshold: 0.1 },
      );

      observer.observe(addBasketBtn);
    }

    // 10. Live Urgency Social Proof Randomizer
    const urgencyEl = section.querySelector("[data-ss-urgency-content]");
    if (urgencyEl) {
      const currentUrl = window.location.pathname;
      const storageKey = "ss_urgency_" + encodeURIComponent(currentUrl);
      let count;

      try {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
          count = parseInt(stored, 10);
        }
      } catch (e) {}

      if (!count || isNaN(count) || count < 80 || count > 250) {
        // Generate realistic initial number between 118 and 172
        count = Math.floor(Math.random() * (172 - 118 + 1)) + 118;
        try {
          sessionStorage.setItem(storageKey, count.toString());
        } catch (e) {}
      }

      function updateUrgencyDisplay(val, animate) {
        const currentHtml = urgencyEl.innerHTML;
        // Match any 1-4 digit number and replace with dynamic val
        if (/\d+/.test(currentHtml)) {
          urgencyEl.innerHTML = currentHtml.replace(/\d+/, val);
          if (animate) {
            urgencyEl.style.transition = "transform 0.3s ease, color 0.3s ease";
            urgencyEl.style.color = "var(--ss-prod-terracotta)";
            urgencyEl.style.transform = "scale(1.02)";
            setTimeout(() => {
              urgencyEl.style.color = "";
              urgencyEl.style.transform = "none";
            }, 600);
          }
        }
      }

      updateUrgencyDisplay(count, false);

      // Periodically increment count (every 20-35s) for live realism
      const liveInterval = setInterval(() => {
        if (!document.body.contains(urgencyEl)) {
          clearInterval(liveInterval);
          return;
        }
        // 60% chance to increment by 1
        if (Math.random() > 0.4) {
          count += 1;
          try {
            sessionStorage.setItem(storageKey, count.toString());
          } catch (e) {}
          updateUrgencyDisplay(count, true);
        }
      }, Math.floor(Math.random() * (35000 - 20000 + 1)) + 20000);
    }
  }

  // Initialize on DOMContentLoaded and Shopify section load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSingleProductPage);
  } else {
    initSingleProductPage();
  }

  document.addEventListener("shopify:section:load", (event) => {
    if (event.target.querySelector("[data-ss-product-page]")) {
      initSingleProductPage();
    }
  });
})();
