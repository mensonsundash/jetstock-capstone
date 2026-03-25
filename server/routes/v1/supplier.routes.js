const express = require("express");
const app = express.Router();

//importing supplier controller
const { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier} = require("../../controllers/supplier.controller");

//CRUD routers connecting its controllers
app.get("/", getAllSuppliers);
app.get("/:id", getSupplierById);
app.post("/", createSupplier);
app.put("/:id", updateSupplier);
app.delete("/:id", deleteSupplier);

module.exports = app;