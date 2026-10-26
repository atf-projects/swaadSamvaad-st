/**
 * Swaad Samvaad - Track Your Order Controller (assets/ss-track-order.js)
 * Real-Time Order Verification, Cancellation, Refund, Pending & Genuine Courier Tracking
 * 100% English Copy & Exact Shopify Lifecycle Integration
 */

(function () {
  'use strict';

  // Verified Store Orders Database (for Store & Demo Tracking)
  var VERIFIED_ORDERS = {
    '1001': {
      orderId: '#1001',
      status: 'in-transit',
      statusText: 'In Transit • Express Air Cargo',
      headline: 'Your Fresh Mithila Thekua is in Express Air Transit!',
      eta: 'Wednesday, Oct 28, 2026',
      financialStatus: 'Paid (₹899.00)',
      courier: 'BlueDart Air Express',
      awb: 'BD849201948IN',
      hasRealTracking: true,
      courierUrl: 'https://www.bluedart.com/tracking?trackNumber=BD849201948IN',
      destination: 'Patna, Bihar (800001)',
      activeStep: 4,
      isCancelled: false,
      isRefunded: false,
      stepTimes: {
        1: 'Oct 25, 10:15 AM',
        2: 'Oct 25, 02:30 PM',
        3: 'Oct 25, 06:00 PM',
        4: 'Oct 26, 08:30 AM',
        5: 'Expected Oct 28'
      },
      items: [
        {
          name: 'Pure Desi Ghee Gud Thekua (1 Kg)',
          qty: '1 x 1 Kg Family Box',
          price: 'Rs. 899.00',
          img: 'https://cdn.shopify.com/s/files/1/0951/9510/3517/files/ssBanner-1.webp?v=1729930000'
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
          time: 'Oct 25, 06:00 PM',
          status: 'Fresh batch airtight box packed & handover to BlueDart courier',
          location: 'Swaad Samvaad Darbhanga Rasoi HQ',
          isLatest: false
        }
      ]
    },
    '1002': {
      orderId: '#1002',
      status: 'out-for-delivery',
      statusText: 'Out for Delivery • Arriving Today',
      headline: 'The Delivery Executive is on the way with your Sacred Box!',
      eta: 'Arriving Today',
      financialStatus: 'Paid (₹1,798.00)',
      courier: 'Delhivery Express',
      awb: 'DEL99281744IN',
      hasRealTracking: true,
      courierUrl: 'https://www.delhivery.com/tracking?awb=DEL99281744IN',
      destination: 'South Delhi, Delhi NCR (110017)',
      activeStep: 5,
      isCancelled: false,
      isRefunded: false,
      stepTimes: {
        1: 'Oct 24, 03:20 PM',
        2: 'Oct 24, 07:45 PM',
        3: 'Oct 25, 09:00 AM',
        4: 'Oct 25, 04:15 PM',
        5: 'Out for Delivery Today'
      },
      items: [
        {
          name: 'Pure Desi Ghee Gud Thekua (1 Kg)',
          qty: '2 x 1 Kg Family Box',
          price: 'Rs. 1,798.00',
          img: 'https://cdn.shopify.com/s/files/1/0951/9510/3517/files/ssBanner-1.webp?v=1729930000'
        }
      ],
      logs: [
        {
          time: 'Today, 09:30 AM',
          status: 'Out for Delivery with Courier Executive',
          location: 'Hauz Khas Delivery Hub, New Delhi',
          isLatest: true
        }
      ]
    },
    '1003': {
      orderId: '#1003',
      status: 'crafting',
      statusText: 'Fresh Wood-Fire Crafting',
      headline: 'Our Master Rasoiya is currently wood-fire frying your batch!',
      eta: 'Friday, Oct 30, 2026',
      financialStatus: 'Paid (₹749.00)',
      courier: 'Not Assigned Yet (Pending Dispatch)',
      awb: 'Not Generated Yet',
      hasRealTracking: false,
      courierUrl: '#',
      destination: 'Bangalore, Karnataka (560001)',
      activeStep: 2,
      isCancelled: false,
      isRefunded: false,
      stepTimes: {
        1: 'Today, 08:45 AM',
        2: 'In Progress Now',
        3: 'Expected Today Evening',
        4: 'Expected Tomorrow',
        5: 'Expected Oct 30'
      },
      items: [
        {
          name: 'Pure Desi Ghee Chini Thekua (1 Kg)',
          qty: '1 x 1 Kg Family Box',
          price: 'Rs. 749.00',
          img: 'https://cdn.shopify.com/s/files/1/0951/9510/3517/files/ssBanner-7.webp?v=1729930000'
        }
      ],
      logs: [
        {
          time: 'Today, 11:30 AM',
          status: 'Slow-frying in Pure Desi Ghee on Mango Wood Fire',
          location: 'Swaad Samvaad Traditional Rasoi, Darbhanga',
          isLatest: true
        }
      ]
    }
  };

  function initTrackOrder() {
    var trackSection = document.querySelector('[data-ss-track-page]');
    if (!trackSection) return;

    var orderInput = trackSection.querySelector('#track-order-number');
    var trackForm = trackSection.querySelector('#ss-order-track-form');
    var submitBtn = trackSection.querySelector('[data-track-submit]');
    var resultsEl = trackSection.querySelector('#ss-track-results');
    var errorEl = trackSection.querySelector('#ss-track-error');
    var errorRetryBtn = trackSection.querySelector('[data-error-retry-btn]');

    // Check customer login status from Liquid data attributes
    var isLoggedIn = trackSection.dataset.customerLoggedIn === 'true';
    var loginUrl = trackSection.dataset.loginUrl || '/account/login';

    // Parse Customer Orders from Liquid embed if present
    var customerOrders = [];
    var custOrdersScript = document.getElementById('ss-customer-orders-data');
    if (custOrdersScript) {
      try {
        customerOrders = JSON.parse(custOrdersScript.textContent.trim()) || [];
      } catch (err) {
        console.warn('Could not parse customer orders:', err);
      }
    }

    // Auto-focus input and assist with hashtag
    if (orderInput) {
      orderInput.addEventListener('focus', function () {
        if (!orderInput.value) {
          orderInput.value = '#';
        }
      });

      orderInput.addEventListener('blur', function () {
        if (orderInput.value === '#') {
          orderInput.value = '';
        }
      });
    }

    // Retry Button Listener
    if (errorRetryBtn) {
      errorRetryBtn.addEventListener('click', function () {
        if (errorEl) errorEl.style.display = 'none';
        if (orderInput) {
          orderInput.value = '#';
          orderInput.focus();
        }
        trackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Form Submission Handler
    if (trackForm) {
      trackForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = (orderInput ? orderInput.value : '').trim();
        if (!val || val === '#') {
          if (orderInput) orderInput.focus();
          return;
        }
        executeTracking(val);
      });
    }

    // URL Query Parameter Support (?order_id=1001 or ?order=#1001)
    var urlParams = new URLSearchParams(window.location.search);
    var queryOrderId = urlParams.get('order_id') || urlParams.get('order');
    if (queryOrderId) {
      if (orderInput) orderInput.value = queryOrderId;
      executeTracking(queryOrderId);
    }

    // Execute Tracking Verification
    function executeTracking(query) {
      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        var btnText = submitBtn.querySelector('.ss-track-btn-text');
        if (btnText) btnText.textContent = 'Verifying Order...';
      }

      // Hide previous views
      if (resultsEl) resultsEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';

      // Normalize query (remove spaces, hashes, lowercase prefixes)
      var clean = query.replace(/[#\s]/g, '').trim().toUpperCase();
      var displayId = query.indexOf('#') === 0 ? query : '#' + query;

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.classList.remove('is-loading');
          var btnText = submitBtn.querySelector('.ss-track-btn-text');
          if (btnText) btnText.textContent = 'Track Order';
        }

        // 1. Search in logged-in Customer's real Shopify orders
        var matchedData = null;
        if (customerOrders && customerOrders.length > 0) {
          for (var i = 0; i < customerOrders.length; i++) {
            var co = customerOrders[i];
            var coName = (co.id || '').replace(/[#\s]/g, '').toUpperCase();
            var coNum = String(co.order_number || '').trim();

            // Match `#1006`, `1006`, `SSORDER1006`, `SS-1006`, etc.
            if (
              clean === coName ||
              clean === coNum ||
              clean === ('SSORDER' + coNum) ||
              clean === ('SS-' + coNum) ||
              ('SSORDER' + clean) === coName ||
              ('SS-' + clean) === coName ||
              clean.indexOf(coNum) !== -1 && clean.length <= coNum.length + 8
            ) {
              matchedData = formatCustomerOrder(co);
              break;
            }
          }
        }

        // 2. Search in Verified Orders Registry (Fallback for testing)
        if (!matchedData) {
          var cleanKey = clean.replace(/^(SSORDER|SS-?)/, '');
          if (VERIFIED_ORDERS[cleanKey]) {
            matchedData = VERIFIED_ORDERS[cleanKey];
          } else if (VERIFIED_ORDERS[clean]) {
            matchedData = VERIFIED_ORDERS[clean];
          }
        }

        // 3. Result Decision: Genuine vs Wrong Order ID vs Login Required
        if (matchedData) {
          renderTrackingResult(matchedData);
        } else if (!isLoggedIn) {
          // User is logged out: inform them that login is required to access their order
          showLoginRequiredError(displayId);
        } else {
          // User is logged in but ID doesn't match their account orders
          showWrongOrderError(displayId);
        }
      }, 300);
    }

    // Format Customer Shopify Order into Tracking Card Schema
    function formatCustomerOrder(co) {
      var isCancelled = Boolean(co.cancelled);
      var isRefunded = co.financial_status === 'refunded';
      var isPartiallyRefunded = co.financial_status === 'partially_refunded';
      var isPendingPayment = co.financial_status === 'pending' || co.financial_status === 'authorized';
      var isFulfilled = co.fulfillment_status === 'fulfilled';
      var hasTracking = Boolean(co.tracking_number && co.tracking_number.trim() !== '');

      var items = [];
      if (co.line_items && co.line_items.length > 0) {
        items = co.line_items.map(function (item) {
          return {
            name: item.title,
            qty: item.quantity + ' Pack',
            price: item.price,
            img: item.image || 'https://cdn.shopify.com/s/files/1/0951/9510/3517/files/ssBanner-1.webp?v=1729930000'
          };
        });
      }

      // Determine genuine state
      var statusKey = 'crafting';
      var statusBadgeText = 'Order Confirmed • Crafting in Rasoi';
      var headline = 'Your Order is Confirmed & Being Prepared!';
      var eta = 'Dispatching within 24 Hours';
      var financialStatusText = co.financial_status_label || 'Paid';
      var activeStep = 2;
      var alertBoxData = null;

      // Real Courier & AWB Assignment
      var courierName = 'Not Assigned Yet (Pending Dispatch)';
      var awbCode = 'Not Generated Yet';
      if (hasTracking) {
        courierName = co.tracking_company || 'Courier Partner';
        awbCode = co.tracking_number;
      } else if (co.tracking_company && co.tracking_company.trim() !== '') {
        courierName = co.tracking_company;
        awbCode = 'Awaiting Hub Scan';
      }

      if (isCancelled && isRefunded) {
        statusKey = 'cancelled-refunded';
        statusBadgeText = 'Cancelled & Refunded';
        headline = 'This order has been cancelled and refunded';
        eta = 'Not Applicable (Order Cancelled & Refunded)';
        financialStatusText = 'Refunded (' + (co.total_price || '') + ')';
        courierName = hasTracking ? co.tracking_company : 'None (Order Cancelled)';
        awbCode = hasTracking ? co.tracking_number : 'N/A';
        activeStep = 0;
        alertBoxData = {
          type: 'cancelled',
          icon: '🚫',
          title: 'Order Cancelled & 100% Refunded',
          desc: 'Order #' + co.order_number + ' was cancelled, and the full payment of ' + (co.total_price || '') + ' has been refunded to your original payment method. No items will be shipped.'
        };
      } else if (isCancelled) {
        statusKey = 'cancelled';
        statusBadgeText = 'Order Cancelled';
        headline = 'This order was cancelled on ' + (co.cancelled_at || co.created_at);
        eta = 'Not Applicable (Order Cancelled)';
        financialStatusText = 'Cancelled' + (isPartiallyRefunded ? ' (Partially Refunded)' : '');
        courierName = hasTracking ? co.tracking_company : 'None (Order Cancelled)';
        awbCode = hasTracking ? co.tracking_number : 'N/A';
        activeStep = 0;
        alertBoxData = {
          type: 'cancelled',
          icon: '🚫',
          title: 'Order Cancelled',
          desc: 'Order #' + co.order_number + ' has been cancelled' + (co.cancel_reason ? ' (Reason: ' + co.cancel_reason + ').' : '.') + ' No shipment is scheduled for this order.'
        };
      } else if (isRefunded) {
        statusKey = 'refunded';
        statusBadgeText = 'Payment Refunded';
        headline = 'Payment of ' + co.total_price + ' has been Refunded';
        eta = 'Payment Refunded to Original Source';
        financialStatusText = 'Refunded (' + co.total_price + ')';
        courierName = hasTracking ? co.tracking_company : 'N/A';
        awbCode = hasTracking ? co.tracking_number : 'N/A';
        activeStep = 0;
        alertBoxData = {
          type: 'refunded',
          icon: '💸',
          title: '100% Payment Refunded',
          desc: 'The total payment of ' + co.total_price + ' for this order has been successfully refunded to your original payment method.'
        };
      } else if (isPendingPayment) {
        statusKey = 'pending-payment';
        statusBadgeText = 'Payment Pending / On Hold';
        headline = 'Order Confirmed • Awaiting Payment Confirmation';
        eta = 'Pending Payment Clearance';
        financialStatusText = 'Payment Pending (' + (co.total_price || '') + ')';
        courierName = 'Not Assigned Yet';
        awbCode = 'Pending Payment';
        activeStep = 1;
        alertBoxData = {
          type: 'pending',
          icon: '⏳',
          title: 'Payment Awaited • Order on Hold',
          desc: 'Your order has been received, but payment confirmation is pending. Fresh batch preparation will begin once payment is verified.'
        };
      } else if (isFulfilled) {
        statusKey = 'in-transit';
        statusBadgeText = 'In Transit • Dispatched';
        headline = 'Your Sacred Mithila Parcel is on the way!';
        eta = 'Within 2-3 Working Days';
        financialStatusText = co.financial_status_label || 'Paid';
        activeStep = 4;
      }

      // Step timestamps
      var stepTimes = {
        1: co.created_at,
        2: (isCancelled || isPendingPayment) ? 'On Hold' : (isFulfilled ? 'Completed' : 'In Progress'),
        3: (isCancelled || isPendingPayment) ? 'N/A' : (isFulfilled ? 'Sealed' : 'Expected Today Evening'),
        4: (isCancelled || isPendingPayment) ? 'N/A' : (isFulfilled ? 'Dispatched' : 'Pending Dispatch'),
        5: (isCancelled || isPendingPayment) ? 'N/A' : 'Expected in 2-3 Days'
      };

      // Logs
      var logs = [];
      if (isCancelled) {
        logs.push({
          time: co.cancelled_at || 'Recent',
          status: 'Order Cancelled' + (co.cancel_reason ? ' (' + co.cancel_reason + ')' : ''),
          location: 'Shopify Store Admin',
          isLatest: true
        });
      }
      if (isRefunded || isPartiallyRefunded) {
        logs.push({
          time: co.cancelled_at || 'Recent',
          status: 'Refund of ' + co.total_price + ' Processed',
          location: 'Payment Gateway',
          isLatest: !isCancelled
        });
      }
      if (hasTracking) {
        logs.push({
          time: 'Dispatched',
          status: 'Handover to ' + co.tracking_company + ' (AWB: ' + co.tracking_number + ')',
          location: 'Air Cargo Logistics Hub',
          isLatest: !isCancelled && !isRefunded
        });
      }
      logs.push({
        time: co.created_at,
        status: 'Order Placed & Confirmed (' + (co.total_price || '') + ')',
        location: 'Online Storefront',
        isLatest: logs.length === 0
      });

      return {
        orderId: co.id || ('#' + co.order_number),
        status: statusKey,
        statusText: statusBadgeText,
        headline: headline,
        eta: eta,
        craftDate: financialStatusText,
        courier: courierName,
        awb: awbCode,
        hasRealTracking: hasTracking,
        courierUrl: co.tracking_url || co.order_status_url || '#',
        orderStatusUrl: co.order_status_url || '#',
        destination: co.destination || 'Customer Delivery Address',
        activeStep: activeStep,
        stepTimes: stepTimes,
        items: items,
        logs: logs,
        alertBox: alertBoxData,
        isCancelled: isCancelled,
        isRefunded: isRefunded
      };
    }

    // Render Genuine Tracking Card
    function renderTrackingResult(data) {
      if (errorEl) errorEl.style.display = 'none';
      if (!resultsEl) return;

      // 1. Meta Grid Values
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

      // 4. Special Alert Box (For Cancelled, Refunded, or On Hold Orders)
      var alertBox = resultsEl.querySelector('[data-order-alert-box]');
      if (alertBox) {
        if (data.alertBox) {
          alertBox.style.display = 'flex';
          alertBox.className = 'ss-track-order-alert-box';
          if (data.alertBox.type === 'pending') {
            alertBox.classList.add('is-pending-box');
          }
          var alertIconEl = alertBox.querySelector('[data-alert-icon]');
          var alertTitleEl = alertBox.querySelector('[data-alert-title]');
          var alertDescEl = alertBox.querySelector('[data-alert-desc]');
          if (alertIconEl) alertIconEl.textContent = data.alertBox.icon;
          if (alertTitleEl) alertTitleEl.textContent = data.alertBox.title;
          if (alertDescEl) alertDescEl.textContent = data.alertBox.desc;
        } else {
          alertBox.style.display = 'none';
        }
      }

      // 5. Stepper Behavior
      var stepperHeading = resultsEl.querySelector('[data-stepper-heading]');
      if (stepperHeading) {
        if (data.isCancelled) {
          stepperHeading.textContent = '✦ Order Status & Cancellation Timeline ✦';
        } else {
          stepperHeading.textContent = '✦ Sacred Journey of Your Delicacy ✦';
        }
      }

      var steps = resultsEl.querySelectorAll('.ss-track-step');
      steps.forEach(function (stepEl) {
        var stepNum = parseInt(stepEl.getAttribute('data-step'), 10);
        stepEl.className = 'ss-track-step';

        if (data.isCancelled) {
          if (stepNum === 1) {
            stepEl.classList.add('is-completed');
          } else if (stepNum === 2) {
            stepEl.classList.add('is-cancelled-step');
            var nameEl = stepEl.querySelector('.ss-track-step__name');
            var descEl = stepEl.querySelector('.ss-track-step__desc');
            if (nameEl) nameEl.textContent = '2. Order Cancelled';
            if (descEl) descEl.textContent = data.isRefunded ? '100% Refund Processed' : 'Order Closed in System';
          } else {
            stepEl.classList.add('is-pending');
            var nameEl = stepEl.querySelector('.ss-track-step__name');
            var descEl = stepEl.querySelector('.ss-track-step__desc');
            if (descEl) descEl.textContent = 'Cancelled (Not Dispatched)';
          }
        } else {
          // Restore default step names if modified
          if (stepNum === 2) {
            var nameEl = stepEl.querySelector('.ss-track-step__name');
            var descEl = stepEl.querySelector('.ss-track-step__desc');
            if (nameEl) nameEl.textContent = '2. Wood-Fire Crafted';
            if (descEl) descEl.textContent = 'Handmade on Shisham Molds';
          }

          if (stepNum < data.activeStep) {
            stepEl.classList.add('is-completed');
          } else if (stepNum === data.activeStep) {
            stepEl.classList.add('is-active');
          } else {
            stepEl.classList.add('is-pending');
          }
        }

        var timeEl = stepEl.querySelector('.ss-track-step__time');
        if (timeEl && data.stepTimes && data.stepTimes[stepNum]) {
          timeEl.textContent = data.stepTimes[stepNum];
        }
      });

      // 6. Activity Logs
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

      // 7. Items List
      var itemsList = resultsEl.querySelector('[data-items-list]');
      if (itemsList && data.items) {
        var itemHtml = '';
        data.items.forEach(function (item) {
          itemHtml += '<div class="ss-track-item-row">' +
            '<div class="ss-track-item-left">' +
            '<img src="' + item.img + '" onerror="this.src=\'https://cdn.shopify.com/s/files/1/0951/9510/3517/files/ssBanner-1.webp?v=1729930000\'" alt="" class="ss-track-item-thumb" width="44" height="44">' +
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

      // Show container & smooth scroll
      resultsEl.style.display = 'block';
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Show Login Required Error State (for Logged-out Guests)
    function showLoginRequiredError(displayId) {
      if (resultsEl) resultsEl.style.display = 'none';
      if (!errorEl) return;

      var badgeEl = errorEl.querySelector('[data-error-badge]');
      if (badgeEl) {
        badgeEl.textContent = 'Account Verification Required';
        badgeEl.style.background = '#FEF3C7';
        badgeEl.style.color = '#B45309';
      }

      var headingTextEl = errorEl.querySelector('[data-error-heading-text]');
      if (headingTextEl) {
        headingTextEl.textContent = 'Please Log In to Track';
      }

      var errorOrderIdEl = errorEl.querySelector('[data-error-order-id]');
      if (errorOrderIdEl) {
        errorOrderIdEl.textContent = displayId;
      }

      var descEl = errorEl.querySelector('[data-error-desc]');
      if (descEl) {
        descEl.innerHTML = 'To protect customer privacy and security, live order status for <strong>' + displayId + '</strong> can only be viewed by the verified account holder. Please log in using your registered mobile number or email.';
      }

      var loginBtn = errorEl.querySelector('[data-error-login-btn]');
      if (loginBtn) {
        loginBtn.style.display = 'inline-flex';
        loginBtn.href = loginUrl + '?return_to=' + encodeURIComponent(window.location.pathname + '?order_id=' + encodeURIComponent(displayId));
      }

      var waBtn = errorEl.querySelector('[data-error-wa-btn]');
      if (waBtn) {
        var msg = encodeURIComponent('Hello Swaad Samvaad team! I am trying to track Order ID: ' + displayId + ' but need assistance logging in.');
        waBtn.href = 'https://wa.me/917982006449?text=' + msg;
      }

      errorEl.style.display = 'flex';
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Show Wrong Order ID Error State (for Logged-in Customers whose ID doesn't match)
    function showWrongOrderError(displayId) {
      if (resultsEl) resultsEl.style.display = 'none';
      if (!errorEl) return;

      var badgeEl = errorEl.querySelector('[data-error-badge]');
      if (badgeEl) {
        badgeEl.textContent = 'Wrong Order ID';
        badgeEl.style.background = '#FEE8E6';
        badgeEl.style.color = 'var(--ss-track-deep-red)';
      }

      var headingTextEl = errorEl.querySelector('[data-error-heading-text]');
      if (headingTextEl) {
        headingTextEl.textContent = 'Order Not Found:';
      }

      var errorOrderIdEl = errorEl.querySelector('[data-error-order-id]');
      if (errorOrderIdEl) {
        errorOrderIdEl.textContent = displayId;
      }

      var descEl = errorEl.querySelector('[data-error-desc]');
      if (descEl) {
        descEl.innerHTML = 'No order found with this Order ID in your account. Please make sure you have entered the correct Order ID (e.g. <strong>#1001</strong> or <strong>#SS-1001</strong>) as mentioned in your order confirmation SMS or email.';
      }

      var loginBtn = errorEl.querySelector('[data-error-login-btn]');
      if (loginBtn) {
        loginBtn.style.display = 'none';
      }

      var waBtn = errorEl.querySelector('[data-error-wa-btn]');
      if (waBtn) {
        var msg = encodeURIComponent('Hello Swaad Samvaad team! I need assistance tracking my Order ID: ' + displayId);
        waBtn.href = 'https://wa.me/917982006449?text=' + msg;
      }

      errorEl.style.display = 'flex';
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // FAQ Accordion
    var faqItems = trackSection.querySelectorAll('.ss-track-faq-item');
    if (faqItems.length > 0) {
      faqItems.forEach(function (targetDetail) {
        if (!targetDetail.dataset.initialized) {
          targetDetail.dataset.initialized = 'true';
          targetDetail.addEventListener('toggle', function () {
            if (targetDetail.open) {
              faqItems.forEach(function (detail) {
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

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrackOrder);
  } else {
    initTrackOrder();
  }
})();
