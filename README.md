#  CMWA Marketing Store

A modern, high-performance, full-featured e-commerce web application built with **Vue 3**, **TypeScript**, **Pinia**, **Vue Router**, and **Tailwind CSS v4**, powered by the **DummyJSON API**.

 **Live Demo / Deployment URL:** [https://cmwa-market-shop.vercel.app/](https://cmwa-market-shop.vercel.app/)

---

##  Project Overview

**CMWA Marketing Store** is a state-of-the-art e-commerce web application engineered for an exceptional shopping experience. Featuring a warm sand color aesthetic (`#E3DAC9`), crisp card containers, dynamic currency conversion (`$ USD` / `Rs. LKR`), multi-language settings, interactive favorites management, and fluid animations.

---

##  Tech Stack

- **Frontend Framework:** [Vue 3](https://vuejs.org/) (Composition API & `<script setup>`)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router v4](https://router.vuejs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **API Integration:** [DummyJSON API](https://dummyjson.com/)
- **Deployment Platform:** [Vercel](https://vercel.com/)

---

##  Key Features & Highlights

### 1.  Product Discovery & Comprehensive Search
- **Multi-Field Smart Search:** Searches across Title, Description, Category, Brand, and Tags simultaneously.
- **Category Filtering & Sorting:** Instant category filter pills with responsive horizontal layout.
- **Dynamic Currency Formatting:** Prices automatically adjust based on selected currency (`$ USD` or `Rs. LKR`).

### 2.  "My Account" Page (`/account`)
- **Profile Information:** Displays user First Name, Last Name, and Registered Email Address in elegant rounded rectangle cards.
- **Staggered Entrance Animation:** Cards glide in from the left and right sides to align perfectly in the center upon page load.
- **Interactive Cursor Hover Effects:** Cards scale up smoothly (`hover:scale-[1.03]`) with border glow transitions on hover.
- **Notification Preferences:** Interactive toggle switch to turn notifications **ON / OFF**.
- **Currency Switcher:** Seamlessly switch between **$ USD** and **Rs. LKR** (1 USD = 300 LKR) with global price updates.
- **Language Preference:** Select store language between **English 🇬🇧**, **Sinhala (සිංහල) 🇱🇰**, and **Tamil (தமிழ்) 🇱🇰**.
- **My Favourites:** View favorited products saved via the Product Detail page, with individual item remove buttons (`✕`) and a "Clear All Favourites" action.
- **Account Logout:** Secure sign-out action card.

### 3.  Hero Banner & Sequential Letter Wave Animation
- **Hero Title Animation:** Sequential letter-by-letter wave scale pulse (`"WELCOME TO CMWA MARKETING STORE"`) running once on page load.
- **Responsive Layout:** Automatically scales and wraps on mobile, tablet, laptop, and PC displays.

### 4.  Balanced Header Navigation (`NavBar.vue`)
- **Left Corner:** Store logo (`🛒 CMWA MARKETING STORE`).
- **Center:** Search bar centered in the middle.
- **Right Corner:** 5 main features (**Theme Toggle**, **Cart Icon**, **Login**, **My Account**, **About Us**).
- **Responsive Mobile Menu:** Clean dropdown menu with full-width pill buttons for mobile phones and tablets.

### 5.  "About Us" Page (`/about`)
- **Typewriter Animation:** Smooth forward-only typewriter animation loop for the store description.
- **Contact Us Grid:** Rounded rectangle contact cards with hover scale effects.

### 6.  Shopping Cart & Dual Checkout Options
- **Cart Management:** Add to cart, adjust quantities, remove items, clear cart, and real-time total computation.
- **Cash on Delivery (COD):** Dedicated Cash on Delivery checkout page (`/checkout/cod`).
- **Online Payment:** Dedicated Online Card Payment checkout page (`/checkout/online`).

---

##  Deployment URL

The application is live and accessible at:
 **[https://cmwa-market-shop.vercel.app/](https://cmwa-market-shop.vercel.app/)**

---

##  Local Setup and Run Instructions

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** (included with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/ravinduanushka/anushkas-assignment.git
cd anushkas-assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Application local address: `http://localhost:5173`

---

##  Production Build & Verification

To build for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

##  Project Structure

```text
anushkas-assignment/
├── public/              # Static public assets (hero video, favicon)
├── src/
│   ├── api/             # API service layer (DummyJSON API)
│   ├── assets/          # Global styles & brand assets
│   ├── components/      # Reusable Vue components (NavBar, ProductCard, SearchBar, ThemeToggle, CartIcon, FilterBar)
│   ├── router/          # Vue Router route definitions (/ , /product/:id, /cart, /account, /about, /checkout/*)
│   ├── stores/          # Pinia stores (account, auth, cart, theme)
│   ├── types/           # TypeScript data interfaces
│   ├── views/           # Page views (HomeView, AccountView, AboutView, ProductDetailView, CartView, CheckoutCodView, CheckoutOnlineView, LoginView, RegisterView)
│   ├── App.vue          # Root component layout
│   └── main.ts          # Application entry point
├── package.json         # Project metadata and dependencies
├── vite.config.ts       # Vite build configuration
└── README.md            # Project documentation
```

---

##  License

This project is open-source and available under the [MIT License](LICENSE).
