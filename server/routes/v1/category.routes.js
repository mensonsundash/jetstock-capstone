const express = require("express");
const app = express.Router();

app.get("/", "getAllCategories");
app.post("/", "createCategory");
app.put("/:id", "updateCategory");
app.delete("/:id", "deleteCategory");

module.exports = app;