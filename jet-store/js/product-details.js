const CART_KEY = "cart_storage";

function loadCart() {
    try{
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (err) {
        alert("Cart load failed:", err);
        return {};
    }
}

function saveCart(cart) {
    localStorage.setItem( CART_KEY, JSON.stringify(cart) );
}

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("id"));
}



function showProduct(product) {
    document.getElementById("detailImg").src = product.images?.[0] || product.thumbnail || "";
    document.getElementById("detailImg").alt = product.title;
    document.getElementById("detailTitle").textContent = product.title;
    document.getElementById("detailDesc").textContent = product.description || "";
    document.getElementById("detailPrice").textContent = `$${Number(product.price).toFixed(2)}`;
    document.getElementById("detailCategory").textContent = product.category;

    const addBtn = document.getElementById("detailAddToCart");
    addBtn.addEventListener("click", () => {
        const cart = loadCart();
        const pId = product.id;

        if(cart[pId]){
            cart[pId].qty += 1;
        } else {
            cart[pId] = { product, qty: 1 };
        }

        saveCart(cart);
        alert("Added a cart")
    })
}

async function fetchProduct(id) {
    const res = await fetch(`https://dummyjson.com/products/${id}`)
    if(!res.ok) throw new Error("Product Not Found");
    return res.json();

}

(async function init() {
    const id = getProductIdFromUrl();
    const loader = document.getElementById("detailsLoader");
    const wrap = document.getElementById("detailsWrap");

    try {
        const product = await fetchProduct(id);
        showProduct(product);

        loader.classList.add("d-none");
        wrap.classList.remove("d-none")
    } catch(err) {
        loader.innerHTML= `<p class="text-danger">Failed to load product.</p>`
    }
})();