const express = require("express");
const app = express.Router();

//importing product controller
const { getAllStockMovements,
    getStockMovementById,
    getStockMovementsByProductId,
    createStockMovement,
    stockInProduct,
    stockOutProduct} = require("../../controllers/stockMovement.controller");
// importing middleware that verifies user token and roles
const authenticate = require("../../middlewares/auth.middleware"); // importing auth middleware
const authorizeRoles = require("../../middlewares/role.middleware"); // importing role middleware

//CRUD routers connecting its controllers
// Protected: loggedin user and admin can get/post/put/delete operations
app.get("/", authenticate, authorizeRoles("admin", "user"), getAllStockMovements);
app.get("/:id", authenticate, authorizeRoles("admin", "user"), getStockMovementById);
app.get("/product/:productId", authenticate, authorizeRoles("admin", "user"), getStockMovementsByProductId);
app.post("/", authenticate, authorizeRoles("admin", "user"), createStockMovement);
app.post("/stock-in", authenticate, authorizeRoles("admin", "user"), stockInProduct);
app.post("/stock-out", authenticate, authorizeRoles("admin", "user"), stockOutProduct);

module.exports = app;