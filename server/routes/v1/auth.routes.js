const express = require("express");
const app = express.Router();

//importing auth controller
const { registerUser , loginUser, getProfile } = require("../../controllers/auth.controller");

// importing middleware that verifies user token
const authenticate = require("../../middlewares/auth.middleware"); // importing auth middleware

//CRUD routers connecting its controllers
app.get("/profile", authenticate, getProfile); // Protected routes: only loggedin users can access their profile
app.post("/register", registerUser);
app.post("/login", loginUser)

module.exports = app;