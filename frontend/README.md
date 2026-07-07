# Vision Giants — React Frontend

This is your original static HTML/CSS/JS site (`v_electronics.zip`) converted into a
**React** app, per your choice: *React frontend only — data stays static/JSON, no backend yet*.

## What changed

| Original | React equivalent |
|---|---|
| `shared.js` theme code | `src/context/ThemeContext.jsx` |
| `shared.js` cart engine (localStorage) | `src/context/CartContext.jsx` (same `localStorage` key: `visiongiants_cart`) |
| `shared.js` product/project resource layer | `src/data/catalog.js` |
| `initSearchBar()` | `src/components/SearchBar.jsx` |
| `buildProductCard()` / `buildProjectCard()` | `src/components/ProductCard.jsx`, `ProjectCard.jsx` |
| `openQuickView()` / `openProjectQuickView()` | `src/components/QuickViewModal.jsx` + `QuickViewContext` |
| Header/footer/back-to-top/WhatsApp float | `src/components/Header.jsx`, `Footer.jsx`, `Chrome.jsx` |
| `index.html`, `products.html`, `product.html`, `cart.html`, `checkout.html`, `projects.html`, `blog.html`, `contact.html`, `policies.html` | `src/pages/*.jsx`, routed with React Router |
| `products.json`, `projects.json`, `logo.png` | copied as-is into `public/` and fetched at runtime — no data was hardcoded into components |

The design tokens (colors, fonts, spacing) from the original `<style>` blocks were
consolidated into one `src/index.css` so every page shares the same look consistently.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Notes / things to know

- **No backend**: products/projects still come from the static `public/products.json` and
  `public/projects.json` files, exactly like the original site's `fetch('products.json')` fallback.
  Cart state lives in the browser's `localStorage`, same as before.
- **Checkout** is a working form UI, but "Place Order" just clears the cart and shows a
  confirmation — there's no server to actually record the order yet.
- **Contact form** shows a success message locally; it isn't wired to an email service.
- **Blog & Policies** content was carried over from the original pages but condensed —
  paste your exact copy back into `src/data/blogPosts.js` and `src/pages/Policies.jsx` if
  you want it word-for-word.
- When you're ready for a real backend (MongoDB + Express, for cart persistence per user,
  auth, or order storage), this frontend is already structured so a `fetch('/api/...')`
  swap in `src/data/catalog.js` and `CartContext.jsx` is all that's needed — just say the word.

## Project structure

```
src/
  components/   Header, Footer, ProductCard, ProjectCard, QuickViewModal, SearchBar, Chrome (back-to-top/WhatsApp/toast)
  context/      ThemeContext, CartContext, QuickViewContext
  data/         catalog.js (product/project loading helpers), blogPosts.js
  pages/        Home, Products, ProductDetail, Projects, Cart, Checkout, Blog, Contact, Policies
public/
  products.json, projects.json, logo.png
```
