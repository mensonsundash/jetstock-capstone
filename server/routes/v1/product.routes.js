const express = require("express");
const app = express.Router();

//importing product controller
const { getAllProducts,
    getProductById,
    getProductsByCategory,
    getProductsBySupplier,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct} = require("../../controllers/product.controller");

//CRUD routers connecting its controllers
app.get("/", getAllProducts);
app.get("/:id", getProductById);
app.get("/supplier/:supplierId", getProductsBySupplier);
app.get("/category/:categoryId", getProductsByCategory);
app.get("/search", searchProducts);
app.post("/", createProduct);
app.put("/:id", updateProduct);
app.delete("/:id", deleteProduct);

module.exports = app;