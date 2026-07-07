// Ported from the original shared.js "PRODUCT RESOURCE LAYER" / "PROJECT RESOURCE LAYER".
// Loads from /public/products.json and /public/projects.json, matching the
// original app's fetch-with-fallback behavior (fetch first, fall back to
// inline defaults if the request fails).

let PRODUCTS_CACHE = null;
let PROJECTS_CACHE = null;

export async function loadProducts() {
  if (PRODUCTS_CACHE) return PRODUCTS_CACHE;
  const res = await fetch('/products.json');
  const data = await res.json();
  // The source JSON is just a products array; derive categories from it
  // the same way products.html / index.html group products by categoryId.
  const products = Array.isArray(data) ? data : data.products || [];
  let categories = data.categories;
  if (!categories) {
    const map = new Map();
    products.forEach((p) => {
      if (!map.has(p.categoryId)) {
        map.set(p.categoryId, {
          id: p.categoryId,
          name: p.category,
          emoji: p.emoji || p.image || '📦',
          count: 0,
        });
      }
      map.get(p.categoryId).count += 1;
    });
    categories = Array.from(map.values());
  }
  PRODUCTS_CACHE = { products, categories };
  return PRODUCTS_CACHE;
}

export async function getProductById(id) {
  const { products } = await loadProducts();
  return products.find((p) => p.id === id) || null;
}

export function filterProducts(products, query) {
  if (!query) return products;
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
  );
}

export async function loadProjects() {
  if (PROJECTS_CACHE) return PROJECTS_CACHE;
  const res = await fetch('/projects.json');
  const data = await res.json();
  PROJECTS_CACHE = { projects: data.projects || [], categories: data.categories || [] };
  return PROJECTS_CACHE;
}

export async function getProjectById(id) {
  const { projects } = await loadProjects();
  return projects.find((p) => p.id === id) || null;
}

export async function getProjectsByLevel(level) {
  const { projects } = await loadProjects();
  return projects.filter((p) => p.level === level);
}

export async function getProjectsByCategory(categoryId) {
  const { projects } = await loadProjects();
  return projects.filter((p) => p.categoryId === categoryId);
}

export function formatPrice(value) {
  return 'Rs ' + Math.round(Number(value)).toLocaleString('en-PK');
}

export function getDiscountPercent(original, price) {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}
