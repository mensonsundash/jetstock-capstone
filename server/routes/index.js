const express = require("express");
const app = express.Router(); // creating Router module

app.get("/", (req,res) => {
    res.json({message: "Welcome to Routes api"});
})
app.use("/v1", require("./v1"));
module.exports = app;