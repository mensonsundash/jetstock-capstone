const express = require("express");
const app = express.Router();

//importing product controller
const { getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    deleteOrder} = require("../../controllers/order.controller");

//CRUD routers connecting its controllers
app.get("/", getAllOrders);
app.get("/:id", getOrderById);
app.post("/", createOrder);
app.put("/:id", updateOrderStatus);
app.delete("/:id", deleteOrder);

module.exports = app;