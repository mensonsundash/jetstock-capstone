const express = require("express");
const app = express.Router();

//importing category controller
const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory} = require("../../controllers/category.controller")

//CRUD routers connecting its controllers
app.get("/", getAllCategories);
app.get("/:id", getCategoryById);
app.post("/", createCategory);
app.put("/:id", updateCategory);
app.delete("/:id", deleteCategory);

module.exports = app;