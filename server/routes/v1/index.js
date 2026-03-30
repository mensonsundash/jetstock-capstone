const express = require("express");
const app = express.Router(); // creating Router module

app.get("/", (req,res) => {
    res.json({message: "Welcome to Routes api: V1"});
})

//autherntication routes
app.use("/auth", require("./auth.routes"))
// sub router of server
app.use("/users", require("./user.routes")); // router to user routes
app.use("/suppliers", require("./supplier.routes")); // router to user routes
app.use("/categories", require("./category.routes")); // router to user routes
app.use("/products", require("./product.routes")); // router to user routes
app.use("/inventory", require("./inventory.routes")); // router to user routes
app.use("/stock-movements", require("./stockMovement.routes")); // router to user routes
app.use("/customers", require("./customer.routes")); // router to user routes
app.use("/orders", require("./order.routes")); // router to user routes
app.use("/reports", require("./report.routes")); // router to report routes

//external client
app.use("/store", require("./store.routes"));

module.exports = app;