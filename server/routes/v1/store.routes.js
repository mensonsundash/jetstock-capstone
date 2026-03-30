const express = require("express");
const app = express.Router();

//importing store controller
const { getStoreProducts, getStoreProductById, checkoutStoreOrder } = require("../../controllers/store.controller");

app.get("/products", getStoreProducts);
app.get("/products/:id", getStoreProductById);
app.post("/checkout", checkoutStoreOrder);

module.exports = app;