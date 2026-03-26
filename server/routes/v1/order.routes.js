const express = require("express");
const app = express.Router();

//importing product controller
const { getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    deleteOrder} = require("../../controllers/order.controller");

// importing middleware that verifies user token and roles
const authenticate = require("../../middlewares/auth.middleware"); // importing auth middleware
const authorizeRoles = require("../../middlewares/role.middleware"); // importing role middleware

//CRUD routers connecting its controllers
// Protected: loggedin user and admin can get/post/put/delete operations
app.get("/", authenticate, authorizeRoles("admin", "user"), getAllOrders);
app.get("/:id", authenticate, authorizeRoles("admin", "user"), getOrderById);
app.post("/", authenticate, authorizeRoles("admin", "user"), createOrder);
app.put("/:id", authenticate, authorizeRoles("admin", "user"), updateOrderStatus);
//for now only admin can delete orders
app.delete("/:id", authenticate, authorizeRoles("admin"), deleteOrder);

module.exports = app;