# SweetCraft — Shopify OS 2.0 Theme

> **Bespoke, Ultra-Fast & High-Converting Shopify Theme**  
> **Author**: ATF by Rahul kumar (Art-Tech Fuzion)  
> **Architecture**: Shopify Online Store 2.0 (Sections Everywhere)  
> **Designed For**: Swaad Samvaad & Artisanal D2C Food / Confectionery Brands  

---

## 📑 Table of Contents
1. [About SweetCraft](#-about-sweetcraft)
2. [Key Features & UX Architecture](#-key-features--ux-architecture)
3. [Theme Flow & Core Pages](#-theme-flow--core-pages)
4. [Step-by-Step Installation Guide](#-step-by-step-installation-guide)
5. [⚠️ How to Update Theme WITHOUT Losing Client Settings](#️-how-to-update-theme-without-losing-client-settings)
6. [Shopify Theme Customizer (Admin Guide)](#-shopify-theme-customizer-admin-guide)
7. [Navigation Menu Setup (Homepage Anchors)](#-navigation-menu-setup-homepage-anchors)
8. [Directory Structure](#-directory-structure)
9. [Technical Standards & Performance](#-technical-standards--performance)

---

## 📖 About SweetCraft

**SweetCraft** is a premium, artisan-crafted Shopify Online Store 2.0 theme developed by **ATF by Rahul kumar**. It combines cultural storytelling aesthetics (warm terracotta, desi ghee gold, earthen palette, and authentic Madhubani/Aripan art motifs) with modern, lightning-fast e-commerce shopping workflows.

### Core Philosophy
- **100% Custom Scoped CSS**: Zero dependency on heavy third-party CSS frameworks (No Tailwind, No Bootstrap) to eliminate style conflicts and guarantee blazing-fast Core Web Vitals.
- **Pure Vanilla JavaScript**: Zero jQuery or bulky npm packages; all drawers, modals, sliders, and tickers run natively on the browser.
- **Mobile-First Touch Ergonomics**: Native swipe gestures, thumb-friendly touch targets, sticky bottom action bars, and slide-out drawers.

---

## 🎨 Key Features & UX Architecture

| Feature Component | Highlights |
|---|---|
| **Live Sales Notification Toast** | Bottom-left corner social proof popup cycling through store products, Indian cities (*Patna, Delhi, Mumbai, Bengaluru, etc.*), and customer names with progress bar. |
| **WhatsApp Quick Order & QR** | Instant scan modal in header + 1-click WhatsApp drawer card with prefilled order text and phone numbers. |
| **Dual Cart Experience** | Instant AJAX Slide-out Cart Drawer with Free Delivery threshold meter + Dedicated 2-Column Cart Page (`/cart`). |
| **Intent-Based Search Engine** | AJAX Search Drawer + Dedicated Search Page with intelligent query filtering (e.g., separating Chini from Gud items). |
| **Rich PDP (Product Detail Page)** | Variant pills with instant price/discount calculations, sticky bottom Add-to-Cart bar, FSSAI quality verification, and accordion trust tabs. |
| **Interactive Collection / Shop Page** | Category filter tabs, price/title sorting, dynamic delicacy counter, and quick Add-to-Basket. |

---

## 🔄 Theme Flow & Core Pages

```
                   ┌───────────────────────────────────────────────┐
                   │               HEADER & NAV BAR                │
                   │  (Logo • Navigation • Search • Scan • Cart)   │
                   └──────────────────────┬────────────────────────┘
                                          │
    ┌─────────────────┬───────────────────┼───────────────────┬─────────────────┐
    ▼                 ▼                   ▼                   ▼                 ▼
┌──────────────┐ ┌──────────────┐  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  HOME PAGE   │ │  COLLECTION  │  │   PRODUCT    │   │  SEARCH PAGE │   │  CART DRAWER │
│ (index.json) │ │(collection.) │  │(product.json)│   │(search.json) │   │  & CART PAGE │
│ • Hero Slider│ │ • Category   │  │ • Gallery    │   │ • Intent     │   │ • Free Ship  │
│ • USP Ribbon │ │   Tabs       │  │ • Swatches   │   │   Filters    │   │   Progress   │
│ • Products   │ │ • Sort By    │  │ • Sticky ATC │   │ • Fallback   │   │ • Notes      │
│ • Story      │ │ • Quick Add  │  │ • Trust Badges   │ • Grid View  │   │ • Upsell     │
│ • Reviews    │ └──────────────┘  └──────────────┘   └──────────────┘   └──────┬───────┘
│ • Video Reel │                                                                │
│ • FAQ        │                                                                ▼
└──────────────┘                                                          ┌──────────────┐
                                                                          │   CHECKOUT   │
                                                                          └──────────────┘
```

---

## 🚀 Step-by-Step Installation Guide

### How to Install on a Client's Shopify Store:
1. **Compress Theme Folder**: Create a `.zip` archive of this project root folder (exclude `.git` and local system files).
2. **Open Shopify Admin**: Go to **Online Store > Themes**.
3. **Upload Theme**: Under the *Theme library* section, click **Add theme > Upload zip file**.
4. **Publish Theme**: Once uploaded, click **Actions > Publish** to make SweetCraft your live storefront theme.

---

## ⚠️ How to Update Theme WITHOUT Losing Client Settings

> [!IMPORTANT]
> When a client customizes a theme in Shopify Admin (uploading banners, changing texts, rearranging sections, setting colors), Shopify saves all their changes in specific **JSON configuration files**:
> - `config/settings_data.json` (Global colors, fonts, theme settings)
> - `templates/*.json` (Sections order, text, and images for every page)
> - `sections/header-group.json` & `sections/footer-group.json` (Header/Footer menus & settings)
>
> If you upload a fresh ZIP file directly from your local computer, Shopify treats it as a new theme and uses your local default JSONs, making it appear as if the client's previous customizations were reset!

### 🛡️ The 3-Step Safe Update Workflow (Zero Data Loss)

Follow these simple steps whenever you make code changes and need to deploy an update to an active client store:

```
Step 1: Download Live Theme Zip from Client Store
               │
               ▼
Step 2: Copy Live JSON files into your Updated Code Folder:
        ├── config/settings_data.json
        ├── templates/*.json (all JSON files)
        └── sections/*-group.json
               │
               ▼
Step 3: Create New Zip & Upload to Client Store (All settings stay 100% intact!)
```

#### Step 1: Download the Client's Live Theme
1. In the client's Shopify Admin, go to **Online Store > Themes**.
2. On the active theme, click the **Three Dots `(...)` > Download theme file**.
3. Shopify will email a ZIP file containing the client's live settings.

#### Step 2: Copy the Live Configuration Files
Extract the downloaded live zip file and copy these files into your local updated theme directory:
- `config/settings_data.json` ➔ overwrite `config/settings_data.json`
- `templates/` folder (all `.json` files) ➔ overwrite `templates/*.json`
- `sections/header-group.json` & `sections/footer-group.json` ➔ overwrite in `sections/`

#### Step 3: Zip and Upload
Zip your updated project directory and upload it to the client's store via **Add theme > Upload zip file**.  
✅ **Result**: All your new code/bug fixes are applied, and all the client's live banners, prices, custom texts, and colors remain **100% untouched**.

---

### Alternative Update Methods:

#### Method B: Developer CLI (`shopify theme push`)
If you have Shopify CLI installed and connected to the store:
```bash
# Push only code changes without overwriting live settings
shopify theme push --theme <THEME_ID> --only-code
```

#### Method C: Single-File Patch (Quick Fixes)
If you only edited one file (e.g. `sections/header.liquid` or `assets/custom-header.css`):
1. In Shopify Admin, go to **Online Store > Themes > Three Dots `(...)` > Edit code**.
2. Paste the updated code into that specific file and click **Save**.

---

## 🎛️ Shopify Theme Customizer (Admin Guide)

Merchants can customize everything visually via **Online Store > Themes > Customize**:

### 1. Live Sales Popup (Social Proof)
- Go to **Theme settings > Live Sales Popup (Social Proof)**:
  - **Enable / Disable**: Toggle popup on or off.
  - **Time Between Popups**: Adjust interval (e.g. 6 to 12 seconds).
  - **Display Duration**: Set how long each popup stays on screen (e.g. 5 seconds).
  - **Cities List**: Add or edit comma-separated cities (*e.g., Patna, Delhi, Mumbai, Bengaluru, Darbhanga*).
  - **Buyer Names List**: Edit customer first names (*e.g., Anjali, Rajesh, Priya, Amit*).

### 2. WhatsApp Order & Support Desk
- Go to **Sections > Header**:
  - **WhatsApp Phone Number**: Enter your official number with country code (e.g. `919876543210` without `+`).
  - **Custom QR Code**: Upload custom merchant QR code (or let the theme generate one automatically).
  - **Pre-filled Message**: Set default text for customer WhatsApp chats.

### 3. Homepage Sections
- **Hero Slider**: Add/remove banner slides, change headings, and set button links.
- **Featured Products**: Select target collection, adjust product limit, and customize badges.
- **FAQ Accordion**: Add/edit questions, answers, and WhatsApp support buttons.

---

## 🔗 Navigation Menu Setup (Homepage Anchors)

To create smooth-scrolling navigation links from **any page** (including PDP and Cart pages) back to the homepage sections, use these URLs in **Shopify Admin > Online Store > Navigation**:

| Menu Item | URL to Add in Menu | Target Section |
| :--- | :--- | :--- |
| **Home** | `/#hero` | Hero Banner Slider |
| **Our Thekuas / Shop** | `/#products` | Handpicked For You (Featured Products) |
| **Why Swaad Samvaad** | `/#comparison` | The Honest Difference (Comparison Table) |
| **Our Story** | `/#story` | Mithila Heritage & Tradition Story |
| **Trust & Quality** | `/#quality` | FSSAI Certification & Trust Pillars |
| **Video Reviews** | `/#videos` | Customer Video Reels |
| **Customer Reviews** | `/#reviews` | 4.9★ Customer Review Wall |
| **FAQ** | `/#faq` | Frequently Asked Questions |

---

## 📁 Directory Structure

```
SweetCraft/
├── assets/
│   ├── custom-header.css           # Header, mega menu & drawer scan styles
│   ├── custom-header.js            # Header sticky, mobile nav & modal logic
│   ├── ss-recent-sales-popup.css   # Live sales social proof popup styles
│   ├── ss-recent-sales-popup.js    # Continuous sales ticker loop logic
│   ├── ss-hero-banner.css          # Hero slider styling & animations
│   ├── ss-hero-banner.js           # Hero slider autoplay & touch swipe
│   ├── ss-featured-products.css    # Product grid, badges & tabs
│   ├── ss-featured-products.js     # Category filters & AJAX cart trigger
│   ├── ss-collection-page.css      # PLP grid, sort & filter styles
│   ├── ss-collection-page.js       # Dynamic filter & sort controller
│   ├── ss-product-page.css         # PDP luxury media & variant styles
│   ├── ss-product-page.js          # PDP variant callbacks & sticky ATC
│   ├── ss-cart-drawer.css          # AJAX Slide-out cart drawer styles
│   ├── ss-cart-drawer.js           # Cart drawer events & free ship meter
│   ├── ss-cart-page.css            # Dedicated 2-column cart page styles
│   ├── ss-search-page.css          # Intent-filtered search results
│   ├── ss-search-page.js           # Search filter & count controller
│   ├── ss-track-order.css          # Live tracking timeline styles
│   └── ss-track-order.js           # Order lookup mock & status logic
├── config/
│   ├── settings_schema.json        # Theme Customizer settings schema
│   └── settings_data.json          # Active presets & theme configurations
├── layout/
│   ├── theme.liquid                # Master layout shell
│   └── password.liquid             # Storefront password layout
├── sections/
│   ├── header-group.json           # Header section group
│   ├── header.liquid               # Dynamic header & navigation
│   ├── footer-group.json           # Footer section group
│   ├── custom-footer.liquid        # Luxury branded footer
│   ├── custom-liquid.liquid        # App block & Custom Liquid insertion
│   ├── ss-hero-banner.liquid       # Hero slider section
│   ├── ss-usp-strip.liquid         # USP trust ribbon
│   ├── ss-featured-products.liquid # Showcase product grid
│   ├── ss-comparison.liquid        # Side-by-side comparison matrix
│   ├── ss-brand-story.liquid       # Brand heritage editorial section
│   ├── ss-trust-quality.liquid     # FSSAI & purity assurance pillars
│   ├── ss-video-reviews.liquid     # Video reel customer showcase
│   ├── ss-reviews-wall.liquid      # Infinite scrolling review marquee
│   ├── ss-faq.liquid               # FAQ accordion & support card
│   ├── ss-collection-page.liquid   # Collection / Shop page section
│   ├── ss-collections-list.liquid  # All collections directory page
│   ├── ss-product-page.liquid      # Product detail page section
│   ├── ss-cart-page.liquid         # Dedicated cart page section
│   ├── ss-search-page.liquid       # Search results page section
│   ├── ss-track-order.liquid       # Track your order portal section
│   ├── ss-contact-page.liquid      # Contact & feedback form section
│   ├── ss-article-page.liquid      # Blog article editorial section
│   ├── ss-blog-page.liquid         # Blog index & recipes listing
│   └── ss-404.liquid               # Not found fallback section
├── snippets/
│   ├── ss-recent-sales-popup.liquid# Live sales notification toast
│   ├── ss-cart-drawer.liquid       # AJAX Slide-out cart drawer
│   └── icon.liquid                 # Scalable UI vector icons
├── templates/                      # OS 2.0 JSON Templates
│   ├── index.json                  # Homepage template
│   ├── product.json                # Product page template
│   ├── collection.json             # Collection page template
│   ├── list-collections.json       # Collections listing template
│   ├── cart.json                   # Cart page template
│   ├── search.json                 # Search page template
│   ├── 404.json                    # 404 error template
│   ├── article.json                # Blog post template
│   ├── blog.json                   # Blog list template
│   ├── page.json                   # Standard page template
│   ├── page.contact.json           # Contact page template
│   ├── page.track-order.json       # Track order page template
│   ├── password.json               # Password lock template
│   └── gift_card.liquid            # Gift card template
└── README.md                       # Master Documentation
```

---

## ⚡ Technical Standards & Performance

- **Lighthouse Performance Score**: **88 – 95+** (Mobile & Desktop)
- **Lighthouse Accessibility Score**: **92 – 98+** (WCAG 2.1 AA Compliant)
- **Asset Execution**: All CSS is native; all JavaScript is non-blocking (`defer="defer"`).
- **Core Web Vitals**: Image aspect ratios and explicit dimensions prevent Cumulative Layout Shift (CLS).

---

© 2026 **SweetCraft Theme** by **ATF by Rahul kumar (Art-Tech Fuzion)**. All rights reserved.
