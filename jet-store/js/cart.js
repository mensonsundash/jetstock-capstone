// CART SYSTEM

// DOM
// const productsList = document.getElementById("productsList");
const cartItemTemplate = document.getElementById("cartItemTemplate");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

const CART_KEY = "cart_storage";

// cart state: { [productId]: { product: {...}, qty: number } }
let cart = loadCart();

// This runs only on pages where productsList exists
if (productsList) {
  productsList.addEventListener("click", (e) => {
    // Support both data-role selectors and old id selectors
    const addBtn =
      e.target.closest('[data-role="add-to-cart"]') ||
      e.target.closest("#addToCart");

    const viewBtn =
      e.target.closest('[data-role="quick-view"]') ||
      e.target.closest("#quickView");

    // Add product into cart
    if (addBtn) {
      const id = Number(addBtn.dataset.productId);
      addProductToCart(id);
    }

    // Go to product details page
    if (viewBtn) {
      const id = Number(viewBtn.dataset.productId);
      goToDetailPage(id);
    }
  });
}


// Cart actions — only on index page
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", clearCart);
}

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    const isInsidePagesFolder = window.location.pathname.includes("/pages/");
    window.location.href = isInsidePagesFolder ? "../checkout.html" : "checkout.html";
  });
}

// Cart items click delegation: Cart items wrapper inside offcanvas
const cartItemsContainer = document.getElementById("cartItems");
// Event delegation for increase / decrease / remove buttons
if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const card = btn.closest("[data-cart-id]");
    if (!card) return;

    const productId = Number(card.dataset.cartId);

    if (action === "increase") changeCartQty(productId, 1);
    if (action === "decrease") changeCartQty(productId, -1);
    if (action === "remove") removeCartItem(productId);
  });
}

/** STORAGE HELPERS */
// Read cart from localStorage
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("Cart load failed:", err);
    return {};
  }
}

// Return cart items as array
function getCartItemsArray() {
  return Object.values(cart);
}

// Return raw cart object
function getCartObject() {
  return cart;
}

// Save cart into localStorage
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Total number of items in cart
function cartCountTotal() {
  const items = Object.values(cart);
  return items.reduce((sum, item) => sum + item.qty, 0);
}

// Total price of cart
function cartPriceTotal() {
  const items = Object.values(cart);
  return items.reduce((sum, item) => {
    const price = Number(item.product.price) || 0;
    return sum + price * item.qty;
  }, 0);
}



// Show a toast notification when a product is added
function showCartToast(productName) {
  const toastEl = document.getElementById("cartToast");
  const toastMsg = document.getElementById("cartToastMsg");
  if (!toastEl) return;
 
  if (toastMsg) {
    toastMsg.textContent = `"${productName}" added to cart!`;
  }
 
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
  toast.show();
}

// Add product to cart using product id from allProducts
function addProductToCart(productId) {
  // allProducts is loaded in script.js on index page
  if (typeof allProducts === "undefined" || !Array.isArray(allProducts)) return;

  const product = allProducts.find((p) => Number(p.id) === Number(productId));
  if (!product) return;

  if (cart[productId]) {
    cart[productId].qty += 1;
  } else {
    cart[productId] = { product, qty: 1 };
  }

  saveCart();
  renderCartItems();
  showCartToast(product.name || "Product");
}

// Optional reusable function for product details page
function addProductObjectToCart(product, qty = 1) {
  if (!product || !product.id) return;

  const productId = Number(product.id);
  const stockQty = Number(product.inventory?.quantity_on_hand || 0);
  const currentQty = cart[productId]?.qty || 0;
  const finalQty = currentQty + qty;

  if (stockQty > 0 && finalQty > stockQty) return false;

  if (cart[productId]) {
    cart[productId].qty += qty;
  } else {
    cart[productId] = { product, qty };
  }

  saveCart();
  renderCartItems();
  showCartToast(product.name || "Product");
  return true;
}

// Change item quantity
function changeCartQty(productId, count) {
  if (!cart[productId]) return;

  cart[productId].qty += count;

  const maxStock = Number(cart[productId].product.inventory?.quantity_on_hand || 0);
  if (cart[productId].qty > maxStock) {
    cart[productId].qty = maxStock;
  }

  if (cart[productId].qty <= 0) {
    delete cart[productId];
  }

  saveCart();
  renderCartItems();
}

// Remove single cart item
function removeCartItem(productId) {
  if (!cart[productId]) return;

  delete cart[productId];
  saveCart();
  renderCartItems();
}

// Clear full cart
function clearCart() {
  cart = {};
  saveCart();
  renderCartItems();
}

// ==============================
// UI RENDER
// ==============================

// Render cart items into offcanvas
function renderCartItems() {
  // If cart area does not exist on page, only update count/total safely
  if (!cartItemsContainer) {
    updateCartUI();
    return;
  }

  cartItemsContainer.innerHTML = "";

  const items = Object.values(cart);

  if (items.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="col-12 text-center">
        <div class="alert alert-light border mb-0">
          <div class="fw-semibold">Your cart is empty</div>
          <div class="text-secondary small">Add products to see them here.</div>
        </div>
      </div>
    `;
    updateCartUI();
    return;
  }

  items.forEach(({ product, qty }) => {
    if (!cartItemTemplate) return;

    const template = cartItemTemplate.content.cloneNode(true);

    const wrapper = template.querySelector(".item-delgetaion-id");
    if (wrapper) wrapper.dataset.cartId = product.id;

    const img = template.querySelector("img");
    if (img) {
      img.src = product.image_url || "";
      img.alt = product.name || "Product image";
    }

    const nameEl = template.querySelector(".item-name");
    if (nameEl) nameEl.textContent = product.name || "Untitled product";

    const metaEl = template.querySelector(".item-meta");
    if (metaEl) {
      metaEl.textContent = `${product.category?.name || "Uncategorized"} · $${Number(product.price).toFixed(2)}`;
    }

    const qtyEl = template.querySelector(".item-qty");
    if (qtyEl) qtyEl.textContent = qty;

    cartItemsContainer.appendChild(template);
  });

  updateCartUI();
}

// Update total count and total price
function updateCartUI() {
  if (cartCount) cartCount.textContent = cartCountTotal();
  if (cartTotal) cartTotal.textContent = cartPriceTotal().toFixed(2);
}

// Go to detail page
function goToDetailPage(productId) {
  window.location.href = `product-details.html?id=${productId}`;
}

// Initial cart render
renderCartItems();