// CART SYSTEM

// DOM
const cartItemTemplate = document.getElementById("cartItemTemplate");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

const CART_KEY = "cart_storage";

// cart state: { [productId]: { product: {...}, qty: number } }
let cart = loadCart();

// Product list click delegation — only on index page
if (productsList) {
  productsList.addEventListener("click", (e) => {
    const addBtn =
      e.target.closest('[data-role="add-to-cart"]') ||
      e.target.closest("#addToCart");

    const viewBtn =
      e.target.closest('[data-role="quick-view"]') ||
      e.target.closest("#quickView");

    if (addBtn) {
      const id = Number(addBtn.dataset.productId);
      addProductToCart(id);
    }

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
    window.location.href = "checkout.html";
  });
}

// Cart items click delegation
const cartItemsContainer = document.getElementById("cartItems");

if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const card = btn.closest("[data-cart-id]");
    if (!card) return;

    const productId = Number(card.dataset.cartId);

    if (action === "increase") changeCartQty(productId, +1);
    if (action === "decrease") changeCartQty(productId, -1);
    if (action === "remove") removeCartItem(productId);
  });
}

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

// Return raw cart object if needed
function getCartObject() {
  return cart;
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function cartCountTotal() {
  const items = Object.values(cart);
  return items.reduce((sum, item) => sum + item.qty, 0);
}

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

// Add product into cart using product ID
function addProductToCart(productId) {
  const product = allProducts.find((p) => p.id === productId);

  if (!product) return;

  if (cart[productId]) {
    cart[productId].qty += 1;
  } else {
    cart[productId] = { product, qty: 1 };
  }

  saveCart();
  renderCartItems();
  showCartToast(product.name || "Product")
}

// Update quantity
function changeCartQty(productId, count) {
  if (!cart[productId]) return;

  cart[productId].qty += count;

  // Prevent quantity above available inventory
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

// Remove single item
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

// Render cart items
function renderCartItems() {
  if (!cartItemsContainer) return;

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
    const template = cartItemTemplate.content.cloneNode(true);

    const wrapper = template.querySelector(".item-delgetaion-id");
    wrapper.dataset.cartId = product.id;

    const img = template.querySelector("img");
    img.src = product.image_url || "";
    img.alt = product.name || "Product image";

    template.querySelector(".item-name").textContent = product.name || "Untitled product";
    template.querySelector(".item-meta").textContent =
      `${product.category?.name || "Uncategorized"} · $${Number(product.price).toFixed(2)}`;

    template.querySelector(".item-qty").textContent = qty;

    cartItemsContainer.appendChild(template);
  });

  updateCartUI();
}

// Update total count + total price
function updateCartUI() {
  if (cartCount) cartCount.textContent = cartCountTotal();
  if (cartTotal) cartTotal.textContent = cartPriceTotal().toFixed(2);
}

// Open detail page
function goToDetailPage(productId) {
  window.location.href = `pages/product-details.html?id=${productId}`;
}

// Initial render
renderCartItems();