# Swaad Samvaad — Shopify Theme

> **Authentic Handcrafted Mithila Thekua Storefront**  
> Pure Desi Ghee · Traditional Wooden Sancha Patterns · 100% Vegetarian · Zero Preservatives

---

## 📖 About This Theme

**Swaad Samvaad** is a bespoke, high-converting Shopify eCommerce theme handcrafted specifically for the traditional heritage food brand *Swaad Samvaad (मिथिला की मिठास)*. 

The theme seamlessly blends the authentic cultural elegance of Mithila & Bihar (warm terracotta, desi ghee gold, earthen clay palette, subtle Madhubani art motifs) with a modern, ultra-fast, mobile-first shopping experience.

---

## 🎨 Key Features & Aesthetic Philosophy

- **100% Custom Scoped CSS**: Zero dependency on heavy CSS frameworks (No Tailwind, No Bootstrap) — maximizing Core Web Vitals (CWV) performance and eliminating style collisions.
- **Bilingual Heritage Typography**: Seamlessly blends Hindi emotional taglines (*"स्वाद संवाद — मिथिला की मिठास, अब आपके घर"*) with refined serif display headlines.
- **Cinematic Visual Storytelling**: Full-width interactive sliders, video reels, floating trust badges, and auto-scrolling customer review walls.
- **Mobile-First UX**: Touch swipe gesture navigation, optimized tap targets, and frosted luxury card backdrops for crystal-clear readability across all screen sizes.
- **Full Shopify Theme Customizer Support**: Every headline, image, video, color, badge, and text string is 100% merchant-customizable through Shopify Admin.

---

## 🧩 Theme Sections Architecture

| Section File | Component Name | Key Highlights | Anchor ID |
| :--- | :--- | :--- | :--- |
| `sections/ss-hero-banner.liquid` | **Hero Banner Slider** | Full-width background image/video slider with left-aligned vignette shadow, dual CTAs, touch gestures, auto-play & 4.9★ rating badge. | `/#hero` |
| `sections/ss-usp-strip.liquid` | **USP Trust Strip** | Overlapping trust ribbon highlighting Pure Desi Ghee, 100% Taste Refund, Handcrafted & Freshly Packed. | `/#usp` |
| `sections/ss-featured-products.liquid` | **Handpicked For You** | Filterable category tabs (Gud, Sugar, Dry Fruit), village kitchen heritage background artwork & instant Add-to-Cart. | `/#products` |
| `sections/ss-comparison.liquid` | **The Honest Difference** | Side-by-side comparison matrix between Swaad Samvaad and mass-market factory biscuits. | `/#comparison` |
| `sections/ss-brand-story.liquid` | **Our Mithila Story** | Deep heritage brand storytelling with traditional dotted border motifs and Maithili cultural callout. | `/#story` |
| `sections/ss-trust-quality.liquid` | **Trust & Quality** | Official FSSAI License badge, 100% Vegetarian declaration, airtight packaging verification. | `/#quality` |
| `sections/ss-video-reviews.liquid` | **Video Reels** | Engaging video review cards showcasing real reactions and ghee-rich texture close-ups. | `/#videos` |
| `sections/ss-reviews-wall.liquid` | **Customer Review Wall** | Continuous auto-scrolling wall of verified buyer reviews across India & international locations (USA, UK, UAE). | `/#reviews` |
| `sections/ss-faq.liquid` | **FAQ & WhatsApp Support** | Interactive accordion answering shelf life, ingredients, shipping, plus direct WhatsApp support CTA. | `/#faq` |
| `snippets/ss-cart-drawer.liquid` | **Swaad Basket Drawer** | Pixel-perfect sliding cart sidebar with free shipping unlock bar, stepper controls, combo upsell & checkout CTA. | Cart Drawer |
| `sections/ss-cart-page.liquid` | **Luxury Cart Page** | 2-Column dedicated cart page with delivery goal bar, gift notes, combo recommendations & sticky summary. | `/cart` |

---

## 🔗 Homepage Menu Anchor Navigation Guide

To create menu links that smoothly scroll to a specific section on the homepage from **any page** (including product and collection pages), use the following URLs in **Shopify Admin > Online Store > Navigation**:

| Menu Item | URL to Add in Menu | Target Section |
| :--- | :--- | :--- |
| **Home** | `/#hero` | Top Hero Banner Slider |
| **Our Thekuas / Shop** | `/#products` | Handpicked For You (Featured Products) |
| **Why Swaad Samvaad** | `/#comparison` | The Honest Difference (Comparison Matrix) |
| **Our Story** | `/#story` | Mithila Heritage & Tradition Story |
| **Trust & Quality** | `/#quality` | FSSAI Certification & Quality Cards |
| **Video Reviews** | `/#videos` | Customer Video Reels |
| **Reviews** | `/#reviews` | 4.9★ Customer Review Wall |
| **FAQ** | `/#faq` | Frequently Asked Questions & Support |

> 💡 **Tip**: The `/#` prefix ensures that if a user is currently on a product page (`/products/...`) or cart page, clicking the menu item redirects to the Homepage and automatically scrolls down to that exact section.

---

## 📁 Directory Structure

```
thekua-project/
├── assets/
│   ├── ss-hero-banner.css          # Hero slider styling & responsive design
│   ├── ss-hero-banner.js           # Hero slider auto-play & swipe controller
│   ├── ss-featured-products.css    # Featured products grid & tabs
│   ├── ss-featured-products.js     # Filter tabs & card interactions
│   ├── ss-comparison.css           # Comparison table & highlight badges
│   ├── ss-brand-story.css          # Heritage story typography & motifs
│   ├── ss-trust-quality.css        # FSSAI card & trust pillars
│   ├── ss-video-reviews.css        # Video reel cards & hover effects
│   ├── ss-reviews-wall.css         # Auto-scrolling review marquee
│   ├── ss-reviews-wall.js          # Infinite scroll controller
│   └── ss-faq.css                  # FAQ accordion styling
├── config/
│   └── settings_data.json          # Theme customizer settings
├── layout/
│   └── theme.liquid                # Master layout file
├── sections/
│   ├── ss-hero-banner.liquid       # Hero slider section
│   ├── ss-usp-strip.liquid         # USP ribbon section
│   ├── ss-featured-products.liquid # Products showcase section
│   ├── ss-comparison.liquid        # Difference comparison section
│   ├── ss-brand-story.liquid       # Brand story section
│   ├── ss-trust-quality.liquid     # Quality assurance section
│   ├── ss-video-reviews.liquid     # Reel showcase section
│   ├── ss-reviews-wall.liquid      # Infinite customer reviews section
│   └── ss-faq.liquid               # FAQ section
├── templates/
│   └── index.json                  # Homepage section arrangement & presets
└── README.md                       # Documentation & Menu guide
```

---

## ⚙️ Development & Customization Guidelines

1. **Colors & Design Tokens**: Defined in custom CSS variables (Warm Terracotta `#B4552B`, Mithila Gold `#F5C58A`, Heritage Brown `#1B0E07`, Cream `#FAF6F0`).
2. **Cache Busting**: When enqueuing styles or scripts, maintain versioning or timestamps so clients always load the latest assets.
3. **No External Libraries**: All slider, swipe, marquee, and modal controllers are written in vanilla JavaScript for ultra-lightweight execution.
