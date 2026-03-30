// CART SYSTEM

// DOM 
const cartItemTemplate = document.getElementById("cartItemTemplate");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

const addToCart = document.getElementById("addToCart");
const quickView = document.getElementById("quickView");

const CART_KEY = "cart_storage";

// cart state : { [productId]: { product: {...}, qty: number } }
let cart = loadCart();


//event delegation for addtocart + view buttons
productsList.addEventListener("click", (e) => {
    //Element btn clicked it target to nearest addToCart & quickView  
    const addBtn = e.target.closest("#addToCart");
    const viewBtn = e.target.closest("#quickView");

    if(addBtn) {
        const id = Number(addBtn.dataset.productId);
        addProductToCart(id);
    }

    if(viewBtn) {
        const id = Number(viewBtn.dataset.productId);
        goToDetailPage(id);
    }
});


//event delegation for for cart clear and checkout
clearCartBtn.addEventListener("click", clearCart);
checkoutBtn.addEventListener("click", () => alert("V2: Checkout, redirect to checkout page") );


//event delegation for Cart items container increase, decrease, remove, clear, checkout according to item ID
const cartItemsContainer = document.getElementById("cartItems");
cartItemsContainer.addEventListener("click", (e) => {
    
    const btn = e.target.closest("button[data-action]");

    if(!btn) return;

    const action = btn.dataset.action;
    const card = btn.closest("[data-cart-id]"); // item-delegation-id

    if(!card) return;

    const productId = Number(card.dataset.cartId);

    if(action === "increase") changeCartQty(productId, +1);
    if(action === "decrease") changeCartQty(productId, -1);
    if(action === "remove") removeCartItem(productId);
    
});


function loadCart() {
    try{
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (err) {
        alert("Cart load failed:", err);
        return {};
    }
}

function saveCart() {
    localStorage.setItem( CART_KEY, JSON.stringify(cart) );
}

function cartCountTotal() {
    const items = Object.values(cart);
    return items.reduce((sum, item) => sum + item.qty, 0)
}

function cartPriceTotal() {
    const items = Object.values(cart);
    return items.reduce((sum, item) => {
        const price = Number(item.product.price) || 0;
        return sum + price * item.qty;
    }, 0);
}

//########### CART ACTIONS
// function to add product into cart using productid and resturn cart array
function addProductToCart(productId) {
    //find product using id from fetched array
    const product = allProducts.find((p) => p.id === productId);

    if(!product) return;

    if(cart[productId]){
        cart[productId].qty += 1;
    } else {
        cart[productId] = { product, qty: 1 };
    }

    saveCart();
    renderCartItems();
}

// function to update cart quantity by its id
function changeCartQty(productId, count) {
    if(!cart[productId]) return;
    cart[productId].qty += count;//count be + or - values

    if(cart[productId].qty <= 0) {
        delete cart[productId];
    }

    saveCart();
    renderCartItems();
}

//function to remove cart item by its id
function removeCartItem(productId) {
    if(!cart[productId]) return;

    delete cart[productId];
    saveCart();
    renderCartItems();
}

//function to clear cart
function clearCart() {
    cart = {};
    saveCart();
    renderCartItems();
}


//########### CART DISPLAY

// function to render cart Items
function renderCartItems() {

    // clear cart item
    cartItemsContainer.innerHTML = '';

    const items = Object.values(cart);

    if(items.length === 0) {
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

    items.forEach(({ product, qty}) => {
        const template = cartItemTemplate.content.cloneNode(true);

        //wrapper dataset for delegation to wrap for product id detection
        const wrapper = template.querySelector(".item-delgetaion-id");
        wrapper.dataset.cartId = product.id;

        const img = template.querySelector("img");
        img.src = product.images[0] || product.thumbnail || "";
        img.alt = product.title;

        template.querySelector(".item-name").textContent = product.title;
        template.querySelector(".item-meta").textContent = `${product.category} . $${Number(product.price).toFixed(2)}`;
        template.querySelector(".item-qty").textContent = qty;

        cartItemsContainer.appendChild(template);
    });

    updateCartUI();

}

//function to update cart price and count of cart products
function updateCartUI() {
    cartCount.textContent = cartCountTotal();
    cartTotal.textContent = cartPriceTotal().toFixed(2);
}


//function to open external page with get id in uri
function goToDetailPage(productId) {
    window.location.href = `pages/product-details.html?id=${productId}`
}

//Initial Rendering
renderCartItems();