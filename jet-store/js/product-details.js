// Store currently selected product
let selectedProduct = null;

// Store currently selected quantity
let selectedQty = 1;

// Wait until the page DOM is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Quantity related DOM elements
  const qtyInput = document.getElementById("detailQty");
  const qtyIncreaseBtn = document.getElementById("qtyIncrease");
  const qtyDecreaseBtn = document.getElementById("qtyDecrease");

  // Main add to cart button
  const addToCartBtn = document.getElementById("detailAddToCart");

  // Read product id from URL
  const productId = getProductIdFromUrl();

  // If no valid id found, stop here
  if (!productId) {
    showError("Invalid product selected.");
    return;
  }

  try {
    // Show loader before API call
    showLoader(true);

    // Fetch all public store products from backend
    const result = await apiRequest("/store/products");
    const products = result.data || [];

    // Find the selected product by matching id
    selectedProduct = products.find((product) => Number(product.id) === Number(productId));

    // If product does not exist, show error
    if (!selectedProduct) {
      showError("Product not found.");
      return;
    }

    // Show product data on the page
    showProduct(selectedProduct);

    // Hide loader after successful load
    showLoader(false);

    // Handle direct typing in quantity input
    qtyInput.addEventListener("input", () => {
      const maxStock = getMaxStock();
      let value = Number(qtyInput.value) || 1;

      // Prevent quantity below 1
      if (value < 1) value = 1;

      // Prevent quantity above available stock
      if (value > maxStock && maxStock > 0) value = maxStock;

      // Save validated quantity
      selectedQty = value;
      qtyInput.value = value;
    });

    // Increase quantity button
    qtyIncreaseBtn.addEventListener("click", () => {
      const maxStock = getMaxStock();
      // Increase only if still under stock limit
      if (selectedQty < maxStock) {
        selectedQty += 1;
        qtyInput.value = selectedQty;
      }
    });

    // Decrease quantity button
    qtyDecreaseBtn.addEventListener("click", () => {
      // Quantity should not go below 1
      if (selectedQty > 1) {
        selectedQty -= 1;
        qtyInput.value = selectedQty;
      }
    });

    // Add selected quantity of product to cart
    addToCartBtn.addEventListener("click", () => {
      addSelectedProductToCart();
    });

  } catch (error) {
    // Handle fetch/API failure
    showError(error.message || "Failed to load product details.");
  } finally {
    // Hide loader no matter success or failure
    showLoader(false);
  }
});

// Read product id from URL query string
// Example: product-details.html?id=5
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

// Get available stock from selected product
function getMaxStock() {
  return Number(selectedProduct?.inventory?.quantity_on_hand || 0);
}

// Show/hide loader state
function showLoader(isLoading) {
  const loader = document.getElementById("detailsLoader");
  const wrap = document.getElementById("detailsWrap");

  if (loader) loader.classList.toggle("d-none", !isLoading);

  // While loading, keep main content hidden
  if (wrap && isLoading) wrap.classList.add("d-none");
}

// Show user-friendly error message
function showError(message) {
  const loader = document.getElementById("detailsLoader");
  const errorWrap = document.getElementById("detailsError");
  const wrap = document.getElementById("detailsWrap");

  // Hide loader and main content
  if (loader) loader.classList.add("d-none");
  if (wrap) wrap.classList.add("d-none");

  // Show error box
  if (errorWrap) {
    errorWrap.classList.remove("d-none");
    errorWrap.innerHTML = `
      <div class="alert alert-danger shadow-sm">
        <div class="fw-semibold mb-1">Unable to load product</div>
        <div>${message}</div>
        <a href="./index.html" class="btn btn-outline-danger btn-sm mt-3">
          Back to Products
        </a>
      </div>
    `;
  }
}

// Fill all product details into the UI
function showProduct(product) {
  // Get stock quantity
  const stockQty = Number(product.inventory?.quantity_on_hand || 0);

  // True if product is available
  const inStock = stockQty > 0;

  // Product image
  document.getElementById("detailImg").src = product.image_url || "./assets/default.svg";
  document.getElementById("detailImg").alt = product.name || "Product image";

  // Product basic text details
  document.getElementById("detailTitle").textContent = product.name || "Untitled Product";
  document.getElementById("detailDesc").textContent =
    product.description || "No description available for this product.";

  // Price, category, sku, supplier
  document.getElementById("detailPrice").textContent = `$${Number(product.price || 0).toFixed(2)}`;
  document.getElementById("detailCategory").textContent = product.category?.name || "Uncategorized";
  document.getElementById("detailSku").textContent = product.sku || "N/A";
  document.getElementById("detailSupplier").textContent = product.supplier?.name || "N/A";

  // Availability text
  const stockText = document.getElementById("detailStockText");
  stockText.textContent = inStock ? `${stockQty} items available` : "Out of stock";
  stockText.className = inStock ? "fw-semibold text-success" : "fw-semibold text-danger";

  // Availability badge
  const stockBadge = document.getElementById("detailStockBadge");
  stockBadge.textContent = inStock ? "In Stock" : "Out of Stock";
  stockBadge.className = inStock
    ? "badge rounded-pill bg-success-subtle text-success px-3 py-2"
    : "badge rounded-pill bg-danger-subtle text-danger px-3 py-2";

  // Quantity and button elements
  const qtyInput = document.getElementById("detailQty");
  const addToCartBtn = document.getElementById("detailAddToCart");
  const qtyIncreaseBtn = document.getElementById("qtyIncrease");
  const qtyDecreaseBtn = document.getElementById("qtyDecrease");

  // Set default quantity values
  qtyInput.max = stockQty || 1;
  qtyInput.value = 1;
  selectedQty = 1;

  // If out of stock, disable actions
  if (!inStock) {
    qtyInput.disabled = true;
    qtyIncreaseBtn.disabled = true;
    qtyDecreaseBtn.disabled = true;
    addToCartBtn.disabled = true;
    addToCartBtn.innerHTML = `<i class="bi bi-x-circle me-2"></i>Out of Stock`;
  }

  // Show product details section
  document.getElementById("detailsWrap").classList.remove("d-none");
}

// Add selected product with quantity into cart
function addSelectedProductToCart() {
  // Safety check
  if (!selectedProduct) return;

  // Current stock available
  const stockQty = Number(selectedProduct.inventory?.quantity_on_hand || 0);

  // Prevent adding out of stock item
  if (stockQty <= 0) {
    showInlineMessage("This product is out of stock.", "danger");
    return;
  }

  // Use shared cart.js helper only
  if (typeof addProductObjectToCart === "function") {
    const added = addProductObjectToCart(selectedProduct, selectedQty);

    if (!added) {
      showInlineMessage(`Only ${stockQty} item(s) available in stock.`, "warning");
      return;
    }

    showInlineMessage(`${selectedQty} item(s) added to cart successfully.`, "success");
    return;
  }

  showInlineMessage("Cart function is not available.", "danger");
}

// Show inline alert message below buttons
function showInlineMessage(message, type = "success") {
  const messageWrap = document.getElementById("detailMessage");

  if (!messageWrap) return;

  messageWrap.innerHTML = `
    <div class="alert alert-${type} mb-0" role="alert">
      ${message}
    </div>
  `;
}