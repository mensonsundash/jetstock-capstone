const express = require("express");
const app = express.Router();

//CRUD routes for controllers
app.get("/", "getAllUser");
app.post("/", "createUser");
app.put("/:id", "updateUser");
app.delete("/:id", "deleteUser");

module.exports = app;