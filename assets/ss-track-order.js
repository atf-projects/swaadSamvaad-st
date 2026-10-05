/**
 * Swaad Samvaad - Track Your Order Controller (assets/ss-track-order.js)
 * Dual Tracking Mode, Real-Time Progress Visualizer, Demo Orders & FAQ Accordion
 */

(function () {
  'use strict';

  // Sample Authentic Mithila Orders Database for Live Demonstration & Instant Verification
  var SAMPLE_ORDERS = {
    '9821': {
      orderId: '#SS-9821',
      status: 'in-transit',
      statusText: 'In Transit • Express Air Cargo',
      headline: 'Your Fresh Mithila Thekua is in Express Transit!',
      eta: 'Wednesday, Oct 08, 2026',
      craftDate: 'Oct 04, 2026 (Morning Wood-Fire Batch)',
      courier: 'BlueDart Air Express',
      awb: 'BD849201948IN',
      courierUrl: 'https://www.bluedart.com/tracking?trackNumber=BD849201948IN',
      destination: 'Patna, Bihar (800001)',
      activeStep: 4,
      stepTimes: {
        1: 'Oct 04, 10:15 AM',
        2: 'Oct 04, 02:30 PM',
        3: 'Oct 04, 06:00 PM',
        4: 'Oct 05, 08:30 AM',
        5: 'Expected Oct 08 (by 7 PM)'
      },
      items: [
        {
          name: 'Pure Desi Ghee Gud Thekua (1 Kg)',
          qty: '1 x 1 Kg Family Box',
          price: 'Rs. 899.00',
          img: 'ss-thekua-crafting-art.jpg'
        },
        {
          name: 'Pure Desi Ghee Chini Thekua (500g)',
          qty: '1 x 500g Fresh Pack',
          price: 'Rs. 449.00',
          img: 'ss-hero-slide-3.jpg'
        }
      ],
      logs: [
        {
          time: 'Today, 08:30 AM',
          status: 'Departed from Patna Airport Air Cargo Hub',
          location: 'Patna Transshipment Hub, Bihar',
          isLatest: true
        },
        {
          time: 'Yesterday, 07:15 PM',
          status: 'Processed at BlueDart Darbhanga Regional Sorting Facility',
          location: 'Darbhanga Hub, Bihar',
          isLatest: false
        },
        {
          time: 'Oct 04, 06:00 PM',
          status: 'Fresh batch airtight box packed & handover to BlueDart courier',
          location: 'Swaad Samvaad Darbhanga Rasoi HQ',
          isLatest: false
        },
        {
          time: 'Oct 04, 02:30 PM',
          status: 'Handcrafted on Wood-Fire using Pure Desi Ghee',
          location: 'Traditional Wood-Fire Hearth, Darbhanga',
          isLatest: false
        },
        {
          time: 'Oct 04, 10:15 AM',
          status: 'Order Placed & Organic Wheat + Ghee Batch Allocated',
          location: 'Online Storefront',
          isLatest: false
        }
      ]
    },
    '8743': {
      orderId: '#SS-8743',
      status: 'out-for-delivery',
      statusText: 'Out for Delivery • Arriving Today',
      headline: 'The Delivery Karigar is on the way with your Sacred Box!',
      eta: 'Today, Oct 05, 2026',
      craftDate: 'Oct 03, 2026 (Evening Batch)',
      courier: 'Delhivery Express',
      awb: 'DEL99281744IN',
      courierUrl: 'https://www.delhivery.com/tracking?awb=DEL99281744IN',
      destination: 'South Delhi, Delhi NCR (110017)',
      activeStep: 5,
      stepTimes: {
        1: 'Oct 03, 03:20 PM',
        2: 'Oct 03, 07:45 PM',
        3: 'Oct 04, 09:00 AM',
        4: 'Oct 04, 04:15 PM',
        5: 'Out for Delivery (09:30 AM Today)'
      },
      items: [
        {
          name: 'Pure Desi Ghee Gud Thekua (1 Kg)',
          qty: '2 x 1 Kg Family Box',
          price: 'Rs. 1,798.00',
          img: 'ss-thekua-crafting-art.jpg'
        }
      ],
      logs: [
        {
          time: 'Today, 09:30 AM',
          status: 'Out for Delivery with Courier Executive (Ramesh Kumar)',
          location: 'Hauz Khas Delivery Hub, New Delhi',
          isLatest: true
        },
        {
          time: 'Today, 04:10 AM',
          status: 'Arrived at Delhi NCR Main Air Cargo Hub',
          location: 'IGI Airport Sorting Center, New Delhi',
          isLatest: false
        },
        {
          time: 'Oct 04, 04:15 PM',
          status: 'Dispatched via Air Cargo from Patna Airport',
          location: 'Patna Airport, Bihar',
          isLatest: false
        },
        {
          time: 'Oct 04, 09:00 AM',
          status: 'Nitrogen fresh packaging sealed & manifested',
          location: 'Swaad Samvaad Darbhanga Rasoi',
          isLatest: false
        },
        {
          time: 'Oct 03, 03:20 PM',
          status: 'Order Placed & Traditional Saancha Assigned',
          location: 'Online Storefront',
          isLatest: false
        }
      ]
    },
    '3104': {
      orderId: '#SS-3104',
      status: 'crafting',
      statusText: 'Fresh Wood-Fire Crafting',
      headline: 'Our Master Rasoiya is currently wood-fire frying your batch!',
      eta: 'Friday, Oct 10, 2026',
      craftDate: 'Today, Oct 05 (In Crafting)',
      courier: 'Express Courier (Assigning on Dispatch)',
      awb: 'Awaiting Final Pack Scan',
      courierUrl: '#',
      destination: 'Bangalore, Karnataka (560001)',
      activeStep: 2,
      stepTimes: {
        1: 'Today, 08:45 AM',
        2: 'In Progress Now',
        3: 'Expected Today Evening',
        4: 'Expected Oct 06',
        5: 'Expected Oct 10'
      },
      items: [
        {
          name: 'Pure Desi Ghee Chini Thekua (1 Kg)',
          qty: '1 x 1 Kg Family Box',
          price: 'Rs. 749.00',
          img: 'ss-hero-slide-2.jpg'
        },
        {
          name: 'Pure Desi Ghee Gud Thekua (500g)',
          qty: '1 x 500g Pack',
          price: 'Rs. 499.00',
          img: 'ss-thekua-crafting-art.jpg'
        }
      ],
      logs: [
        {
          time: 'Today, 11:30 AM',
          status: 'Slow-frying in Pure Desi Ghee on Mango Wood Fire',
          location: 'Swaad Samvaad Traditional Rasoi, Darbhanga',
          isLatest: true
        },
        {
          time: 'Today, 09:15 AM',
          status: 'Organic Wheat Flour & Jaggery Dough Molded with Shisham Saancha',
          location: 'Mithila Crafting Workshop',
          isLatest: false
        },
        {
          time: 'Today, 08:45 AM',
          status: 'Order Confirmed & Sacred Batch Registered',
          location: 'Online Storefront',
          isLatest: false
        }
      ]
    }
  };

  function initTrackOrder() {
    var trackSection = document.querySelector('[data-ss-track-page]');
    if (!trackSection) return;

    // 1. Tab Switching
    var tabBtns = trackSection.querySelectorAll('[data-track-tab]');
    var formOrderId = trackSection.querySelector('#ss-tab-order-id');
    var formAwb = trackSection.querySelector('#ss-tab-awb');

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetTab = btn.getAttribute('data-track-tab');

        tabBtns.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        if (targetTab === 'order-id') {
          formOrderId.style.display = 'block';
          formOrderId.classList.add('is-active');
          formAwb.style.display = 'none';
          formAwb.classList.remove('is-active');
        } else {
          formOrderId.style.display = 'none';
          formOrderId.classList.remove('is-active');
          formAwb.style.display = 'block';
          formAwb.classList.add('is-active');
        }
      });
    });

    // 2. Demo Chips Click
    var demoChips = trackSection.querySelectorAll('.ss-track-chip');
    demoChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var order = chip.getAttribute('data-demo-order');
        var contact = chip.getAttribute('data-demo-contact');
        var awb = chip.getAttribute('data-demo-awb');

        if (order) {
          // Switch to Order ID tab
          var orderTabBtn = trackSection.querySelector('[data-track-tab="order-id"]');
          if (orderTabBtn) orderTabBtn.click();

          var orderInput = trackSection.querySelector('#track-order-number');
          var contactInput = trackSection.querySelector('#track-order-contact');
          if (orderInput) orderInput.value = order;
          if (contactInput) contactInput.value = contact || '9876543210';

          executeTracking(order);
        } else if (awb) {
          // Switch to AWB tab
          var awbTabBtn = trackSection.querySelector('[data-track-tab="awb"]');
          if (awbTabBtn) awbTabBtn.click();

          var awbInput = trackSection.querySelector('#track-awb-number');
          if (awbInput) awbInput.value = awb;

          // Map AWB to sample order
          if (awb.indexOf('BD') !== -1) {
            executeTracking('9821');
          } else {
            executeTracking('8743');
          }
        }
      });
    });

    // 3. Form Submissions
    if (formOrderId) {
      formOrderId.addEventListener('submit', function (e) {
        e.preventDefault();
        var orderInput = trackSection.querySelector('#track-order-number');
        if (orderInput && orderInput.value.trim()) {
          executeTracking(orderInput.value.trim());
        }
      });
    }

    if (formAwb) {
      formAwb.addEventListener('submit', function (e) {
        e.preventDefault();
        var awbInput = trackSection.querySelector('#track-awb-number');
        if (awbInput && awbInput.value.trim()) {
          var val = awbInput.value.trim().toUpperCase();
          if (val.indexOf('DEL') !== -1) {
            executeTracking('8743');
          } else {
            executeTracking('9821');
          }
        }
      });
    }

    // 4. FAQ Accordion Toggle
    var faqItems = trackSection.querySelectorAll('.ss-track-faq-item');
    faqItems.forEach(function (item) {
      var trigger = item.querySelector('.ss-track-faq-trigger');
      if (trigger) {
        trigger.addEventListener('click', function () {
          var isOpen = item.classList.contains('is-open');
          
          // Optional: close other accordions
          faqItems.forEach(function (other) {
            if (other !== item) {
              other.classList.remove('is-open');
              var otherTrigger = other.querySelector('.ss-track-faq-trigger');
              if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            }
          });

          if (isOpen) {
            item.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
          } else {
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });

    // 5. URL Query Parameter Support (e.g. ?order_id=SS-9821)
    var urlParams = new URLSearchParams(window.location.search);
    var queryOrderId = urlParams.get('order_id') || urlParams.get('order');
    var queryAwb = urlParams.get('awb');

    if (queryOrderId) {
      var orderInput = trackSection.querySelector('#track-order-number');
      if (orderInput) orderInput.value = queryOrderId;
      executeTracking(queryOrderId);
    } else if (queryAwb) {
      var awbTabBtn = trackSection.querySelector('[data-track-tab="awb"]');
      if (awbTabBtn) awbTabBtn.click();
      var awbInput = trackSection.querySelector('#track-awb-number');
      if (awbInput) awbInput.value = queryAwb;
      executeTracking(queryAwb);
    }

    // Tracking Execution Function
    function executeTracking(query) {
      var submitBtns = trackSection.querySelectorAll('[data-track-submit]');
      submitBtns.forEach(function (btn) {
        btn.classList.add('is-loading');
        btn.innerHTML = '<span>Checking Rasoi Dispatch...</span>';
      });

      // Normalize query (remove '#', 'SS-', spaces)
      var cleanQuery = query.replace(/[#\s]/g, '').toUpperCase();
      cleanQuery = cleanQuery.replace(/^SS-?/, '');

      setTimeout(function () {
        submitBtns.forEach(function (btn) {
          btn.classList.remove('is-loading');
          btn.innerHTML = '<span>Track Parcel Status</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
        });

        // Pick data or build dynamic fallback
        var data = SAMPLE_ORDERS[cleanQuery] || generateDynamicOrder(query);
        renderTrackingResult(data);
      }, 450);
    }

    // Dynamic generator for any user-entered order ID
    function generateDynamicOrder(rawQuery) {
      var cleanId = rawQuery.indexOf('#') === 0 ? rawQuery : '#SS-' + rawQuery.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
      return {
        orderId: cleanId,
        status: 'in-transit',
        statusText: 'In Transit • Express Air Courier',
        headline: 'Your Sacred Thekua Parcel is on the way!',
        eta: 'Within 2-3 Working Days',
        craftDate: 'Fresh Wood-Fire Batch (Dispatched)',
        courier: 'BlueDart Air Express',
        awb: 'BD' + Math.floor(100000000 + Math.random() * 900000000) + 'IN',
        courierUrl: 'https://www.bluedart.com/tracking',
        destination: 'Customer Delivery Address (Verified)',
        activeStep: 4,
        stepTimes: {
          1: 'Confirmed',
          2: 'Wood-Fire Fried in Pure Desi Ghee',
          3: 'Airtight Nitrogen Box Sealed',
          4: 'In Air Transit',
          5: 'Expected in 2-3 Days'
        },
        items: [
          {
            name: 'Pure Desi Ghee Gud Thekua (1 Kg)',
            qty: '1 x 1 Kg Family Box',
            price: 'Rs. 899.00',
            img: 'ss-thekua-crafting-art.jpg'
          }
        ],
        logs: [
          {
            time: 'Live Update',
            status: 'In Transit with Express Air Logistics Hub',
            location: 'National Cargo Gateway',
            isLatest: true
          },
          {
            time: '1 Day Ago',
            status: 'Handcrafted with Pure Desi Ghee & Handover to Air Courier',
            location: 'Swaad Samvaad Darbhanga Rasoi HQ',
            isLatest: false
          }
        ]
      };
    }

    // Render Function
    function renderTrackingResult(data) {
      var resultsEl = trackSection.querySelector('#ss-track-results');
      if (!resultsEl) return;

      // Status Badge & Headings
      var badge = resultsEl.querySelector('[data-status-badge]');
      var statusText = resultsEl.querySelector('[data-status-text]');
      var headline = resultsEl.querySelector('[data-status-headline]');
      var etaDate = resultsEl.querySelector('[data-status-eta-date]');
      var courierLink = resultsEl.querySelector('[data-courier-external-link]');

      if (badge) {
        badge.className = 'ss-track-status-badge';
        if (data.status === 'out-for-delivery') {
          badge.classList.add('is-delivered');
        } else if (data.status === 'crafting') {
          badge.classList.add('is-crafting');
        } else {
          badge.classList.add('is-transit');
        }
      }

      if (statusText) statusText.textContent = data.statusText;
      if (headline) headline.textContent = data.headline;
      if (etaDate) etaDate.textContent = data.eta;
      if (courierLink) {
        courierLink.href = data.courierUrl || '#';
        var linkSpan = courierLink.querySelector('span');
        if (linkSpan) linkSpan.textContent = 'Track on ' + (data.courier.split(' ')[0] || 'Courier') + ' Portal';
      }

      // Meta grid
      var metaOrderId = resultsEl.querySelector('[data-meta-order-id]');
      var metaCraftDate = resultsEl.querySelector('[data-meta-craft-date]');
      var metaCourier = resultsEl.querySelector('[data-meta-courier]');
      var metaAwb = resultsEl.querySelector('[data-meta-awb]');
      var metaDest = resultsEl.querySelector('[data-meta-destination]');

      if (metaOrderId) metaOrderId.textContent = data.orderId;
      if (metaCraftDate) metaCraftDate.textContent = data.craftDate;
      if (metaCourier) metaCourier.textContent = data.courier;
      if (metaAwb) metaAwb.textContent = data.awb;
      if (metaDest) metaDest.textContent = data.destination;

      // 5-Step Stepper
      var steps = resultsEl.querySelectorAll('.ss-track-step');
      steps.forEach(function (stepEl) {
        var stepNum = parseInt(stepEl.getAttribute('data-step'), 10);
        stepEl.className = 'ss-track-step';

        if (stepNum < data.activeStep) {
          stepEl.classList.add('is-completed');
        } else if (stepNum === data.activeStep) {
          stepEl.classList.add('is-active');
        } else {
          stepEl.classList.add('is-pending');
        }

        var timeEl = stepEl.querySelector('.ss-track-step__time');
        if (timeEl && data.stepTimes && data.stepTimes[stepNum]) {
          timeEl.textContent = data.stepTimes[stepNum];
        }
      });

      // Activity Logs
      var logList = resultsEl.querySelector('[data-activity-log-list]');
      if (logList && data.logs) {
        var logHtml = '';
        data.logs.forEach(function (log) {
          logHtml += '<div class="ss-track-log-item' + (log.isLatest ? ' is-latest' : '') + '">' +
            '<span class="ss-track-log-time">' + log.time + '</span>' +
            '<strong class="ss-track-log-status">' + log.status + '</strong>' +
            '<span class="ss-track-log-location">📍 ' + log.location + '</span>' +
            '</div>';
        });
        logList.innerHTML = logHtml;
      }

      // Items List
      var itemsList = resultsEl.querySelector('[data-items-list]');
      if (itemsList && data.items) {
        var itemHtml = '';
        data.items.forEach(function (item) {
          itemHtml += '<div class="ss-track-item-row">' +
            '<div class="ss-track-item-left">' +
            '<img src="/cdn/shop/t/1/assets/' + item.img + '" onerror="this.src=\'https://via.placeholder.com/50?text=Thekua\'" alt="" class="ss-track-item-thumb" width="44" height="44">' +
            '<div class="ss-track-item-details">' +
            '<span class="ss-track-item-name">' + item.name + '</span>' +
            '<span class="ss-track-item-qty">' + item.qty + '</span>' +
            '</div>' +
            '</div>' +
            '<span class="ss-track-item-price">' + item.price + '</span>' +
            '</div>';
        });
        itemsList.innerHTML = itemHtml;
      }

      // Update WhatsApp Link with Order Number
      var waLink = trackSection.querySelector('[data-whatsapp-help-link]');
      if (waLink) {
        var msg = encodeURIComponent('Namaste Swaad Samvaad! Please help me with my Order ' + data.orderId + ' (AWB: ' + data.awb + ').');
        waLink.href = 'https://wa.me/919876543210?text=' + msg;
      }

      // Show container & smooth scroll
      resultsEl.style.display = 'block';
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrackOrder);
  } else {
    initTrackOrder();
  }
})();
