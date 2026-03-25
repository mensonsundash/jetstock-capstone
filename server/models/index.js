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

/** #### Associations & Relationship #### */

/** User relationships**/
    // User -> Supplier : One to Many relationship
    User.hasMany(Supplier, { foreignKey: "user_id" });
    Supplier.belongsTo(User, { foreignKey: "user_id" });

    // User -> Category : One to Many relationship
    User.hasMany(Category, { foreignKey: "user_id", as: "categories" });
    Category.belongsTo(User, { foreignKey: "user_id", as: "user" });

    // User -> Product : One to Many relationship
    User.hasMany(Product, { foreignKey: "user_id", as: "products" });
    Product.belongsTo(User, { foreignKey: "user_id", as: "user" });

    // User -> Customer : One to Many relationship
    User.hasMany(Customer, { foreignKey: "user_id", as: "customers" });
    Customer.belongsTo(User, { foreignKey: "user_id", as: "user" });

    // User -> Order: One to Many relationship
    User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
    Order.belongsTo(User, { foreignKey: "user_id", as: "user" });

    // User -> StockMovement: One to Many relationship
    User.hasMany(StockMovement, { foreignKey: "user_id", as: "stock_movements" });
    StockMovement.belongsTo(User, { foreignKey: "user_id", as: "user" });

/**Supplier relationships**/
    // Supplier -> Product: One to Many relationship
    Supplier.hasMany(Product, { foreignKey: "supplier_id", as: "products" });
    Product.belongsTo(Supplier, { foreignKey: "supplier_id", as: "supplier" });

/**Category relationships**/
    // Category -> Product: One to Many relationship
    Category.hasMany(Product, { foreignKey: "category_id", as: "products" });
    Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });

/**Product relationships**/
    // Product -> Inventory: One to One relationship
    Product.hasOne(Inventory, { foreignKey: "product_id", as: "inventory" });
    Inventory.belongsTo(Product, { foreignKey: "product_id", as: "product" });

    // Product -> StockMovement: One to Many relationship
    Product.hasMany(StockMovement, { foreignKey: "product_id", as: "stock_movements" });
    StockMovement.belongsTo(Product, { foreignKey: "product_id", as: "product" });

    // Product -> OrderItem: One to Many relationship
    Product.hasMany(OrderItem, { foreignKey: "product_id", as: "order_items" });
    OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

/**Customer relationships**/
    // Customer -> Order: One to Many relationship
    Customer.hasMany(Order, { foreignKey: "customer_id", as: "orders" });
    Order.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });

/**Order relationships**/
    // Order -> OrderItem: One to Many relationship
    Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
    OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });

/**OrderItem relationships**/
    // OrderItem -> StockMovement: One to Many relationship
    OrderItem.hasMany(StockMovement, { foreignKey: "order_item_id", as: "stock_movements" });
    StockMovement.belongsTo(OrderItem, { foreignKey: "order_item_id", as: "order_item" });

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