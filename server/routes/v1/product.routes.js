const express = require("express");
const app = express.Router();

app.get("/", "getAllProducts");
app.post("/", "createProduct");
app.put("/:id", "updateProduct");
app.delete("/:id", "deleteProduct");

module.exports = app;