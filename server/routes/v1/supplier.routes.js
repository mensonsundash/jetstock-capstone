const express = require("express");
const app = express.Router();

//importing supplier controller
const { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier} = require("../../controllers/supplier.controller");

// importing middleware that verifies user token and roles
const authenticate = require("../../middlewares/auth.middleware"); // importing auth middleware
const authorizeRoles = require("../../middlewares/role.middleware"); // importing role middleware

//CRUD routers connecting its controllers

// Protected: loggedin user and admin can view suppliers
app.get("/", authenticate, authorizeRoles("admin", "user"), getAllSuppliers);
app.get("/:id", authenticate, authorizeRoles("admin", "user"), getSupplierById);
app.post("/", authenticate, authorizeRoles("admin", "user"), createSupplier); // Protected: loggedin user and admin can create
app.put("/:id", authenticate, authorizeRoles("admin", "user"), updateSupplier);// Protected: loggedin user and admin can update
app.delete("/:id", authenticate, authorizeRoles("admin", "user"), deleteSupplier);// Protected: loggedin user and admin can delete

module.exports = app;