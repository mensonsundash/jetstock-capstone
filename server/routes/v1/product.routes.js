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



// importing middleware that verifies user token and roles
const authenticate = require("../../middlewares/auth.middleware"); // importing auth middleware
const authorizeRoles = require("../../middlewares/role.middleware"); // importing role middleware

//CRUD routers connecting its controllers
// Protected: loggedin user and admin can get/post/put/delete operations
app.get("/", authenticate, authorizeRoles("admin", "user"), getAllProducts);
app.get("/supplier/:supplierId", authenticate, authorizeRoles("admin", "user"), getProductsBySupplier);
app.get("/category/:categoryId", authenticate, authorizeRoles("admin", "user"), getProductsByCategory);
app.get("/search", authenticate, authorizeRoles("admin", "user"), searchProducts);
//specific routes at first and then id last
app.get("/:id", authenticate, authorizeRoles("admin", "user"), getProductById);
app.post("/", authenticate, authorizeRoles("admin", "user"), createProduct);
app.put("/:id", authenticate, authorizeRoles("admin", "user"), updateProduct);
app.delete("/:id", authenticate, authorizeRoles("admin", "user"), deleteProduct);

module.exports = app;