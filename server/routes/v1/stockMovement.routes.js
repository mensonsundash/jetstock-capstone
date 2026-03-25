const express = require("express");
const app = express.Router();

//importing product controller
const { getAllStockMovements,
    getStockMovementById,
    getStockMovementsByProductId,
    createStockMovement,
    stockInProduct,
    stockOutProduct} = require("../../controllers/stockMovement.controller");

//CRUD routers connecting its controllers
app.get("/", getAllStockMovements);
app.get("/:id", getStockMovementById);
app.get("/product/:productId", getStockMovementsByProductId);
app.post("/", createStockMovement);
app.post("/stock-in", stockInProduct);
app.post("/stock-out", stockOutProduct);

module.exports = app;