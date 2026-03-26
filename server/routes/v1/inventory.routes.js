const express = require("express");
const app = express.Router();

//importing inventory controller
const { getAllInventory,
    getInventoryById,
    getInventoryByProductId,
    getLowStockItems,
    getOutOfStockItems,
    getInventorySummary,
    updateInventory } = require("../../controllers/inventory.controller");

    
// importing middleware that verifies user token and roles
const authenticate = require("../../middlewares/auth.middleware"); // importing auth middleware
const authorizeRoles = require("../../middlewares/role.middleware"); // importing role middleware

//CRUD routers connecting its controllers
// Protected: loggedin user and admin can get/post/put/delete operations
app.get("/", authenticate, authorizeRoles("admin", "user"), getAllInventory);
app.get("/:id", authenticate, authorizeRoles("admin", "user"), getInventoryById);
app.get("/product/:productId", authenticate, authorizeRoles("admin", "user"), getInventoryByProductId);
app.get("/summary", authenticate, authorizeRoles("admin", "user"), getInventorySummary);
app.get("/low-stock", authenticate, authorizeRoles("admin", "user"), getLowStockItems);
app.get("/out-of-stock", authenticate, authorizeRoles("admin", "user"), getOutOfStockItems);
app.put("/product/:productId", authenticate, authorizeRoles("admin", "user"), updateInventory);

module.exports = app;