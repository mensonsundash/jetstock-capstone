const express = require("express");
const app = express.Router();

app.get("/", "getAllStockMovements");
app.post("/", "createStockMovement");

module.exports = app;