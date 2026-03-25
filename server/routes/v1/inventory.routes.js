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

//CRUD routers connecting its controllers
app.get("/", getAllInventory);
app.get("/:id", getInventoryById);
app.get("/product/:productId", getInventoryByProductId);
app.get("/summary", getInventorySummary);
app.get("/low-stock", getLowStockItems);
app.get("/out-of-stock", getOutOfStockItems);
app.put("/product/:productId", updateInventory);

module.exports = app;