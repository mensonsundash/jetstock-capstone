const express = require("express");
const app = express.Router();

//importing category controller
const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory} = require("../../controllers/category.controller")


// importing middleware that verifies user token and roles
const authenticate = require("../../middlewares/auth.middleware"); // importing auth middleware
const authorizeRoles = require("../../middlewares/role.middleware"); // importing role middleware

//CRUD routers connecting its controllers

// Protected: loggedin user and admin can view categories
app.get("/", authenticate, authorizeRoles("admin", "user"), getAllCategories);
app.get("/:id", authenticate, authorizeRoles("admin", "user"), getCategoryById);

app.post("/", authenticate, authorizeRoles("admin", "user"), createCategory); // Protected: loggedin user and admin can create
app.put("/:id", authenticate, authorizeRoles("admin", "user"), updateCategory);// Protected: loggedin user and admin can update
app.delete("/:id", authenticate, authorizeRoles("admin", "user"), deleteCategory);// Protected: loggedin user and admin can delete

module.exports = app;

