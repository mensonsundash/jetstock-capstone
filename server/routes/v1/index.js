const express = require("express");
const app = express.Router(); // creating Router module

app.get("/", (req,res) => {
    res.json({message: "Welcome to Routes api: V1"});
})


// sub router of server


module.exports = app;