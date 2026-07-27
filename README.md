# 🛒 CMWA Market Shop

A modern, responsive, full-featured e-commerce web application built with **Vue 3**, **TypeScript**, **Pinia**, **Vue Router**, and **Tailwind CSS v4**, powered by the **DummyJSON API**.

🌐 **Live Demo / Deployment URL:** [https://cmwa-market-shop.vercel.app/](https://cmwa-market-shop.vercel.app/)

---

## 📌 Project Description

**CMWA Market Shop** is a feature-rich e-commerce store application designed for a smooth and intuitive shopping experience. Users can browse products across multiple categories, search dynamically, filter products, view comprehensive product details, manage their shopping cart, authenticate (Login & Register), and toggle between Dark and Light modes with persistent state management.

---

## 🛠️ Tech Stack

- **Frontend Framework:** [Vue 3](https://vuejs.org/) (Composition API & `<script setup>`)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router v4](https://router.vuejs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **API Integration:** [DummyJSON API](https://dummyjson.com/)
- **Deployment Platform:** [Vercel](https://vercel.com/)

---

## ✨ Key Features

- 🔍 **Product Discovery & Search:**
  - Real-time product search with instant filtering.
  - Category filtering and sorting options.
- 📦 **Detailed Product View:**
  - Image gallery, pricing, stock status, ratings, brand info, and product specifications.
- 🛒 **Interactive Shopping Cart:**
  - Add to cart, adjust quantities, remove items, and clear cart.
  - Dynamic price computation and persistent cart state.
- 🔐 **User Authentication:**
  - User registration and login views with form validation.
  - Persistent authentication state managed via Pinia store.
- 🌙 **Dark / Light Theme Toggle:**
  - Seamless dark mode support with persistent user preferences.
- 📱 **Responsive Design:**
  - Modern, adaptive UI built for mobile, tablet, and desktop viewports.

---

## 🌐 Deployment URL

The application is deployed and live at:
👉 **[https://cmwa-market-shop.vercel.app/](https://cmwa-market-shop.vercel.app/)**

---

## 💻 Local Setup and Run Instructions

Follow these steps to run the project locally on your machine.

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: `v18.0.0` or higher
- **npm** (comes with Node.js) or **pnpm** / **yarn**

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

The application will be accessible at: `http://localhost:5173`

---

## 🏗️ Build and Preview

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```text
anushkas-assignment/
├── public/              # Static public assets
├── src/
│   ├── api/             # API integration (DummyJSON service)
│   ├── assets/          # Global assets & styles
│   ├── components/      # Reusable Vue components (NavBar, ProductCard, SearchBar, etc.)
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia stores (auth, cart, theme)
│   ├── types/           # TypeScript interfaces & types
│   ├── views/           # Page views (Home, Cart, ProductDetail, Login, Register)
│   ├── App.vue          # Root component
│   └── main.ts          # Application entry point
├── package.json         # Project dependencies and scripts
├── vite.config.ts       # Vite build configuration
└── README.md            # Project documentation
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
