const express = require("express");
const app = express.Router();

app.get("/", "getAllSuppliers");
app.post("/", "createSupplier");
app.put("/:id", "updateSupplier");
app.delete("/:id", "deleteSupplier");

module.exports = app;