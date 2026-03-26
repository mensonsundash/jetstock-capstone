const express = require("express");
const app = express.Router();

//importing user controller
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require("../../controllers/user.controller");

// importing middleware that verifies user token and roles
const authenticate = require("../../middlewares/auth.middleware"); // importing auth middleware
const authorizeRoles = require("../../middlewares/role.middleware"); // importing role middleware

//CRUD routers connecting its controllers
app.get("/", authenticate, authorizeRoles("admin"), getAllUsers); // Protected: only admin can view all user
app.get("/:id", authenticate, authorizeRoles("admin"), getUserById); // Protected: only admin can view all user
app.post("/", createUser);// Public: as user can register
app.put("/:id", authenticate, authorizeRoles("admin", "user"), updateUser); // Protected: loggedin user and admin can update
app.delete("/:id", authenticate, authorizeRoles("admin", "user"), deleteUser); // Protected: only admin can view all user

module.exports = app;