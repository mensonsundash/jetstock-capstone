// VARIABLES UNIT
let allProducts = [];//original array
let filteredProducts = [];//working array
const categoryIconMap = {
    "beauty": "bi-palette-fill",
    "fragrances": "bi-flower1",
    "furniture": "bi-lamp-fill",
    "groceries": "bi-duffle-fill",
    "default": "bi-tag"
}


// DOM Elements Ids
const productTemplate = document.getElementById("productTemplate");

const productsList = document.getElementById("productsList");
const loader = document.getElementById("loader");

//EVENT UNITS
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const sortSelect = document.getElementById("sortSelect");
const resetBtn = document.getElementById('resetBtn');


    // Load products from JetStock backend
    document.addEventListener("DOMContentLoaded", async () => {
    if (productsList) {
        await fetchStoreProducts();
    }
    });

    // Fetch public products from backend store API
    async function fetchStoreProducts() {
    try {
        if (loader) loader.classList.remove("d-none");
        productsList.innerHTML = "";

        const result = await apiRequest("/store/products");

        allProducts = result.data || [];
        filteredProducts = [...allProducts];

        populateCategoryDropdown(allProducts);
        renderData();
    } catch (error) {
        productsList.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger">
            ${error.message}
            </div>
        </div>
        `;
    } finally {
        if (loader) loader.classList.add("d-none");
    }
    }

/**
 * Add one product card to UI
 */
function addCard(product) {
  const template = productTemplate.content.cloneNode(true);

  const categoryName = product.category?.name || "default";
  const iconClass = getCategoryIcon(categoryName.toLowerCase());
  const stockQty = Number(product.inventory?.quantity_on_hand || 0);

  const imageEl = template.querySelector("#productImage");
  imageEl.src = product.image_url || "";
  imageEl.alt = product.name || "Product image";

  template.querySelector("#productTitle").innerText = product.name || "Untitled Product";

  const availabilityEl = template.querySelector("#availabilityStatus");
  availabilityEl.innerText = stockQty > 0 ? "In Stock" : "Out of Stock";
  availabilityEl.classList =
    stockQty > 0
      ? "badge rounded-pill text-success px-3 py-2 availability-status"
      : "badge rounded-pill text-warning px-3 py-2 availability-status";

  template.querySelector("#productCategory").innerHTML = `
    <i class="bi ${iconClass} me-2"></i>${categoryName}
  `;

  template.querySelector("#productPrice").innerText = `$${Number(product.price).toFixed(2)}`;

  // Bind product id to buttons
  const addBtn = template.querySelector('[data-role="add-to-cart"]') || template.querySelector("#addToCart");
  const viewBtn = template.querySelector('[data-role="quick-view"]') || template.querySelector("#quickView");

  addBtn.dataset.productId = product.id;
  viewBtn.dataset.productId = product.id;

  // Disable add-to-cart if out of stock
  if (stockQty <= 0) {
    addBtn.disabled = true;
    addBtn.innerHTML = `<i class="bi bi-x-circle me-2"></i>Out of stock`;
    addBtn.classList.remove("btn-primary");
    addBtn.classList.add("btn-secondary");
  }

  productsList.appendChild(template);
}

/**
 * render all data: iterating array and calling addCard to create card for each value
 */
function renderData() {
  if (!productsList) return;
  if (loader) loader.classList.remove("d-none");
  productsList.innerHTML = "";

  if (filteredProducts.length === 0) {
    productsList.innerHTML = `
      <div class="col-12">
        <div class="alert alert-light border text-center">
          No products found.
        </div>
      </div>
    `;
    if (loader) loader.classList.add("d-none");
    return;
  }

  filteredProducts.forEach((product) => addCard(product));
  if (loader) loader.classList.add("d-none");
}

/**
 * Build unique category list from backend products
 */
function getUniqueCategories(products) {
  return [...new Set(products.map((p) => p.category?.name).filter(Boolean))];
}

/**
 * Fill category dropdown
 * //appending option child into select of filterSelect
 */
function populateCategoryDropdown(products) {
  if (!filterSelect) return;
  filterSelect.innerHTML = `<option value="">Filter by Category</option>`;

  const categories = getUniqueCategories(products);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filterSelect.appendChild(option);
  });
}

/**
 * Return icon for category
 */
function getCategoryIcon(category) {
  return categoryIconMap[category] || categoryIconMap.default;
}

/**
 * Search by product name, description, or category
 */
function searching(products, searchValue) {
  const query = searchValue.toLowerCase();

  return products.filter((product) => {
    const name = product.name?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";
    const category = product.category?.name?.toLowerCase() || "";

    return (
      name.includes(query) ||
      description.includes(query) ||
      category.includes(query)
    );
  });
}

/**
 * Filter by category
 */
function filtering(products, selectedCategory) {
  const category = selectedCategory.toLowerCase();

  return category
    ? products.filter(
        (product) => (product.category?.name || "").toLowerCase() === category
      )
    : products;
}

/**
 * Sort by name or price
 */
function sorting(data, sortValue) {
  const cloned = [...data];

  switch (sortValue.toLowerCase()) {
    case "price-asc":
      return cloned.sort((a, b) => Number(a.price) - Number(b.price));

    case "price-desc":
      return cloned.sort((a, b) => Number(b.price) - Number(a.price));

    case "name-asc":
      return cloned.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    case "name-desc":
      return cloned.sort((a, b) => (b.name || "").localeCompare(a.name || ""));

    default:
      return cloned;
  }
}

/**
 * Apply search + filter + sort together
 */
function applyFiltersAndSort() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCategory = filterSelect.value.trim().toLowerCase();
  const sortValue = sortSelect.value.trim().toLowerCase();

  let result = [...allProducts];

  if (query) {
    result = searching(result, query);
  }

  if (selectedCategory) {
    result = filtering(result, selectedCategory);
  }

  if (sortValue) {
    result = sorting(result, sortValue);
  }

  //updating working array data and rendering
    filteredProducts = result;
    renderData();
}
    

// Events Listener for all input connecting to group function
if (searchInput) searchInput.addEventListener("input", applyFiltersAndSort);
if (filterSelect) filterSelect.addEventListener("change", applyFiltersAndSort);
if (sortSelect) sortSelect.addEventListener("change", applyFiltersAndSort);

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    filterSelect.value = "";
    sortSelect.value = "";
    filteredProducts = [...allProducts];
    renderData();
  });
}