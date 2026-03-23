const express = require("express");
const app = express.Router();

app.get("/", "getAllInventory");
app.put("/:id", "updateInventory");


module.exports = app;