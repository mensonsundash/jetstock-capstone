const express = require("express");
const app = express.Router();

//importing product controller
const { getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer} = require("../../controllers/customer.controller");

//CRUD routers connecting its controllers
app.get("/", getAllCustomers);
app.get("/:id", getCustomerById);
app.post("/", createCustomer);
app.put("/:id", updateCustomer);
app.delete("/:id", deleteCustomer);

module.exports = app;