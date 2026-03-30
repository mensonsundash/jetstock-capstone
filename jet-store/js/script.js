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



//fetch data from uri and render to UI
// fetch("https://fakestoreapi.com/products")
// fetch("https://fakerapi.it/api/v2/custom?_quantity=2000&_locale=en_US&uuid=iban&title=name&category=card_type&description=paragraph&price=vat&image=image")
fetch("https://dummyjson.com/products")
.then((response) => response.json())
.then((products) => {
    console.log(products)
    allProducts = products.products;
    filteredProducts = products.products;

    populateCategoryDropdown(allProducts);

    renderData();
});

/**
 * returns resolved array data
 */
function getData() {
    return new Promise((resolve) => {
        //small loading delay for spinner visibility
        setTimeout(() => {
            resolve(filteredProducts);
        }, 500);
    });
}

/**
 * 
 * add html template card
 */
function addCard(data) {
    const template = productTemplate.content.cloneNode(true);

    const iconClass = getCategoryIcon(data.category);

    template.querySelector("#productImage").src = data.images[0]; // thumbnail
    template.querySelector("#productTitle").innerText = data.title;
    template.querySelector("#availabilityStatus").innerText = data.availabilityStatus;
    template.querySelector("#availabilityStatus").classList = data.availabilityStatus == 'In Stock' ? "text-success" : "text-warning"; 
    template.querySelector("#productCategory").innerHTML = `<i class="bi ${iconClass} me-2"></i>${data.category}`;
    template.querySelector("#productPrice").innerText = data.price;

    //adding id into each button
    template.querySelector("#addToCart").dataset.productId = data.id; // add dataset product-id on button
    template.querySelector("#quickView").dataset.productId = data.id; // add dataset product-id on button

    productsList.appendChild(template);
}

/**
 * render all data: iterating array and calling addCard to create card for each value
 */
function renderData () {
    // show loader before loading data
    loader.classList.remove("d-none");

    // clear all current items
    productsList.innerHTML = "";
    
    //re-populate with latest array contents
    getData().then((totalData) => {

        if(totalData.length === 0) {
            productsList.innerHTML=`<p>No Products found</p>`
            loader.classList.add("d-none");
            return;
        }

            totalData.forEach((data) =>  addCard(data) );
            //hide loader after rendering all data
            loader.classList.add("d-none");
        }
    );
}

//get all the unique values from full array
function getUniqueCategories(products){
    //Set object witll create new set of unique mapped data
    return [...new Set(products.map(p => p.category))];
}

//appending option child into select of filterSelect
function populateCategoryDropdown(products){
    filterSelect.innerHTML = `<option value="">Filter by Category</option>`;
    const categories = getUniqueCategories(products);
    console.log(categories)
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value= category;
        option.textContent = category;
        filterSelect.appendChild(option);
    });
}

// function to get icon for category
function getCategoryIcon(category) {
    return categoryIconMap[category] || categoryIconMap['default']
}

// searching value on input provided to filter on title and category
function searching(allProductsData, searchValue){
    searchValue = searchValue.toLowerCase();
    return allProductsData.filter((product) =>  product.title.toLowerCase().includes(searchValue) || product.category.toLowerCase().includes(searchValue) );
}

// filtering products on provided category matched
function filtering(allProductsData, selectedCategory){
    selectedCategory = selectedCategory.toLowerCase();
    return selectedCategory ? allProductsData.filter((product) => product.category.toLowerCase() === selectedCategory) : allProductsData;
}

// sorting mechanism with asc & desc on price and name
function sorting(data, sortValue){
    sortValue = sortValue.toLowerCase();
    switch (sortValue) {
        case "price-asc":
            return data.sort((a,b) => a.price - b.price);
        case "price-desc":
            return data.sort((a,b) => b.price-a.price);
        case "name-asc":
            return data.sort((a,b) => a.title > b.title ? 1 : -1 );
        case "name-desc":
            return data.sort((a,b) => b.title > a.title ? 1: -1);
        default:
            return data;
    }
}

/**
 * function to control states of all query action together
 */
function applyFiltersAndSort() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = filterSelect.value.trim().toLowerCase();
    const sortValue = sortSelect.value.trim().toLowerCase();
    
    let result = [...allProducts]; //retaining original array

    //search filter
    if(query){
        result = searching(result, query)
    }

    //category filter
    if(selectedCategory){
        result = filtering(result, selectedCategory);
    }

    //sort
    if(sortValue){
        result = sorting(result, sortValue)
    }

    //updating working arrayy data and rendering
    filteredProducts = result;
    renderData();
}

// Events Listener for all input connecting to group function
searchInput.addEventListener("input", applyFiltersAndSort);
filterSelect.addEventListener("change", applyFiltersAndSort);
sortSelect.addEventListener("change", applyFiltersAndSort);



