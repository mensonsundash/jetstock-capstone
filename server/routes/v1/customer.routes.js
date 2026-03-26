const express = require("express");
const app = express.Router();

//importing product controller
const { getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer} = require("../../controllers/customer.controller");

// importing middleware that verifies user token and roles
const authenticate = require("../../middlewares/auth.middleware"); // importing auth middleware
const authorizeRoles = require("../../middlewares/role.middleware"); // importing role middleware

//CRUD routers connecting its controllers
// Protected: loggedin user and admin can get/post/put/delete operations
app.get("/", authenticate, authorizeRoles("admin", "user"), getAllCustomers);
app.get("/:id", authenticate, authorizeRoles("admin", "user"), getCustomerById);
app.post("/", authenticate, authorizeRoles("admin", "user"), createCustomer);
app.put("/:id", authenticate, authorizeRoles("admin", "user"), updateCustomer);
//For now only admin can delete the customers
app.delete("/:id", authenticate, authorizeRoles("admin"), deleteCustomer);

module.exports = app;