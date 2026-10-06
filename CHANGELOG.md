# Changelog — SweetCraft Shopify OS 2.0 Theme

All notable changes to the **SweetCraft** theme by **ATF by Rahul kumar (Art-Tech Fuzion)** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-10-06

### ⭐ Added
- **Judge.me Official App Integration (`snippets/ss-judgeme-badge.liquid`)**:
  - Out-of-the-box support for the official *Judge.me: Product Reviews* app across the entire storefront.
  - Interactive Judge.me review widget on Single Product Page (`sections/ss-product-page.liquid`) with rating breakdown, photo reviews, verified buyer badges, and submission form.
  - Review badges rendered on all product cards (Homepage, Shop/Collection page, Search results, Cart upsells, and Blog recommendations).
- **Smart 0-Review Fallback System**:
  - Independent custom rating component (`.ss-empty-rating-badge`) displaying 5 elegant muted SVG stars and `"0 reviews"` when a product has 0 reviews in Judge.me.
  - Dynamic client-side switcher automatically toggles between fallback and live Judge.me ratings in real time.
- **Article Real Publish Time**:
  - Added actual publication time (`%I:%M %p` format e.g., `10:30 AM`) with clock icon across both Single Article (`sections/ss-article-page.liquid`) and Blog Listing (`sections/ss-blog-page.liquid`) pages.

### 🧹 Removed
- **Blog Native Comments**:
  - Completely removed legacy "Conversations & Reflections" and comment submission form from Single Blog Post Page (`sections/ss-article-page.liquid`).
  - Purged all associated dead CSS rules, form styling, and media queries from `assets/ss-article-page.css`.

### ⚡ Optimized
- Enhanced `.ss-rating-badge-container` styling in `assets/base.css` with zero CSS framework dependency.
- Fixed product card alignment so 0-review products maintain exact height parity with reviewed products.

---

## [1.1.0] - 2026-10-05

### ⭐ Added
- **Single Blog Post Editorial Page (`sections/ss-article-page.liquid`)**:
  - Mithila heritage storytelling header with Madhubani motifs, author bio, social share pills (WhatsApp direct share & copy link), sticky product recommendations sidebar, and next/prev story navigation.
- **Blog Listing & Recipes Hub (`sections/ss-blog-page.liquid`)**:
  - Category pill filters, spotlight featured article hero, responsive articles grid, and newsletter subscription banner.
- **Live Sales Notification Toast (`snippets/ss-recent-sales-popup.liquid`)**:
  - Social proof toast popup cycling through store products, Indian cities, and buyer names with animated progress bar.
- **Dedicated Track Order Page (`sections/ss-track-order.liquid`)**:
  - Interactive order status lookup portal with real-time visual shipment timeline.
- **Contact & Feedback Page (`sections/ss-contact-page.liquid`)**:
  - WhatsApp direct support card, customer query form, and Mithila kitchen operating hours.

### ⚡ Improved
- **PDP (Product Detail Page)**:
  - Added sticky bottom Add-to-Cart bar for mobile viewports.
  - Added FSSAI quality trust badge section and accordion ingredient details.
  - Dynamic variant price and discount calculator.
- **Cart Experience**:
  - Free delivery progress threshold bar in Slide-out Cart Drawer (`ss-cart-drawer.liquid`) and 2-Column Cart Page (`ss-cart-page.liquid`).

---

## [1.0.0] - 2026-10-04

### 🚀 Initial Release
- **Shopify Online Store 2.0 (OS 2.0) Architecture**:
  - Fully modular JSON templates (`index.json`, `product.json`, `collection.json`, `cart.json`, `search.json`, `blog.json`, `article.json`, `404.json`).
- **Brand Aesthetic & Design System**:
  - Authentic Mithila color palette (Terracotta Maroon `#B4552B`, Desi Ghee Gold `#C27D38`, Deep Earthen Brown `#2B1A10`, Warm Cream `#FFFDF9`).
  - 100% custom scoped CSS without Tailwind/Bootstrap.
  - Pure Vanilla JavaScript without jQuery.
- **Core Commerce Pages**:
  - **Homepage**: Hero banner slider with swipe support, USP trust ribbon, featured products grid, comparison table matrix, heritage story section, customer video reels marquee, infinite review wall, and FAQ accordion.
  - **Collection Page**: Multi-category filter tabs, price/title sorting, delicacy counter, and quick add-to-cart.
  - **Search Engine**: Search drawer + dedicated search page with query categorization (Chini vs Gud items).
  - **Header & Navigation**: Sticky header, mega menu navigation, search trigger, and WhatsApp QR scan modal.
  - **Footer**: Cultural motifs, quick links, trust seals, newsletter signup, and copyright branding.
