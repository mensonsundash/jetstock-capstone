const express = require("express");
const app = express.Router();

//importing user controller
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require("../../controllers/user.controller");

//CRUD routers connecting its controllers
app.get("/", getAllUsers);
app.get("/:id", getUserById);
app.post("/", createUser);
app.put("/:id", updateUser);
app.delete("/:id", deleteUser);

module.exports = app;