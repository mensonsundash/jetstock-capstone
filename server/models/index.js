const Category = require("./category.model");
const Customer = require("./customer.model");
const Inventory = require("./inventory.model");
const Order = require("./order.model");
const OrderItem = require("./orderItem.model");
const Product = require("./product.model");
const StockMovement = require("./stockMovement.model");
const Supplier = require("./supplier.model");
const User = require("./user.model");

// function to initialize each models
async function init() {
    //synchronize the models
    await User.sync(); 
    await Supplier.sync(); 
    await Category.sync();
    await Product.sync();
    await Inventory.sync();
    await StockMovement.sync();
    await Customer.sync();
    await Order.sync();
    await OrderItem.sync();
}

//calling initialization function to load all models
init();

/** Associations/Relationship */

// User -> Supplier : One to Many relationship
    User.hasMany(Supplier, { foreignKey: "user_id" }); // One to many
    Supplier.belongsTo(User, { foreignKey: "user_id" }) // Many to One

module.exports = {
    User,
    Supplier,
    Category,
    Product,
    Inventory,
    StockMovement,
    Customer,
    Order,
    OrderItem
}