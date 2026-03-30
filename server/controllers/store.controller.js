const { Op } = require('sequelize');
const Models  = require('../models');
const { Sequelize } = require('../config/db.config');

/**
 * Function to get products list for external shopping site with searching & filters options
 */
const getStoreProducts = async (req, res) => {
    try{
        const { q ="", categoryId="", supplierId="" } = req.query; // query to get search/filters values
        
        let whereClause = {};
        
        // seach by product name and sku where clause
        if(q.trim()) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${q.trim()}%` } },
                { sku: { [Op.like]: `%${q.trim()}%` } },
            ]
        }

        // filter by category
        if(categoryId) {
            whereClause.category_id = categoryId;
        }
        // filter by supplier
        if(supplierId) {
            whereClause.supplier_id = supplierId;
        }   

        // fetching product table and joining related table with alias as: supplier, category & inventory 
        const products = await Models.Product.findAll({
            where: {...whereClause},
            include:[
                { model: Models.Supplier, as: "supplier" },
                { model: Models.Category, as: "category" },
                { model: Models.Inventory, as: "inventory" },
            ],
            order:[["created_at", "DESC"]]
        });// using sequelize model findAll function to fetch with include feature to join another tables

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Product fetched successfully', data: products })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch product', error: error.message })
    }
}

/**
 * Function to get a product by its id
 */
const getStoreProductById = async (req, res) => {
    try{

        const productId = req.params.id; // getting id from params provided on request

        // fetching product table and joining related table with alias as: supplier, category & inventory 
        const product = await Models.Product.findByPk(productId,{
            include:[
                { model: Models.Supplier, as: "supplier" },
                { model: Models.Category, as: "category" },
                { model: Models.Inventory, as: "inventory" },
            ]
        }); // using sequelize find by primary key with include feature to join another tables

        //checking if product not exist and stop : Code 404: Not Found
        if(!product) return res.status(404).json({ message: "Product not found"})

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Product fetched successfully', data: product })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch product', error: error.message })
    }
}

//public store checkout
//Creates customer details, order, order items, reduces stock, and records stock movements
const checkoutStoreOrder = async (req, res) => {
  const transaction = await Sequelize.transaction();

  try {
    const { customer, items } = req.body;

    // Basic request validation
    if (
      !customer ||
      !customer.full_name ||
      !customer.email ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
        await transaction.rollback();
        //Success Response code 200: OK -> Success
        res.status(400).json({ message: 'Customer details and cart items are required', data: product });
    }

    // Find existing customer by email or create a new one
    let existingCustomer = await Models.Customer.findOne({
      where: { email: customer.email },
      transaction,
    });

    if (!existingCustomer) {
      existingCustomer = await Models.Customer.create(
        {
          full_name: customer.full_name,
          email: customer.email,
          phone: customer.phone || null,
          address: customer.address || null,
        },
        { transaction }
      );
    }

    // Validate products and inventory first
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Models.Product.findByPk(item.product_id, {
        include: [
          {
            model: Models.Inventory,
            as: "inventory",
          },
        ],
        transaction,
      });

      if (!product) {
        await transaction.rollback();
        //Success Response code 400: Product not found
        return res.status(404).json({ message: `Product not found: ${item.product_id}` });
        
      }

      if (!product.inventory) {
        await transaction.rollback();
        //Success Response code 400: Product not found
        return res.status(404).json({ message: `Inventory not found for product: ${product.name}` });
      }

    if (Number(product.inventory.quantity_on_hand) < Number(item.quantity)) {
        await transaction.rollback();
        //Success Response code 400: Product not found
        return res.status(404).json({ message: `Insufficient stock for product: ${product.name}` });
    }

      const unitPrice = Number(product.price);
      const quantity = Number(item.quantity);
      const subTotal = unitPrice * quantity;

      totalAmount += subTotal;

      validatedItems.push({
        product,
        quantity,
        unitPrice,
        subTotal,
      });
    }

    // Create order independent from user_id
    const order = await Models.Order.create(
      {
        customer_id: existingCustomer.id,
        order_date: new Date(),
        status: "pending",
        total_amount: totalAmount,
      },
      { transaction }
    );

    // Create order items, reduce inventory, create stock movements
    for (const item of validatedItems) {
      const createdOrderItem = await Models.OrderItem.create(
        {
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          sub_total: item.subTotal,
        },
        { transaction }
      );

      // Reduce stock in inventory
      item.product.inventory.quantity_on_hand =
        Number(item.product.inventory.quantity_on_hand) - item.quantity;

      await item.product.inventory.save({ transaction });

      // Create stock movement
      // Important: user_id comes from product.user_id (vendor ownership)
      await Models.StockMovement.create(
        {
          product_id: item.product.id,
          user_id: item.product.user_id,
          order_item_id: createdOrderItem.id,
          movement_type: "OUT",
          source_type: "ONLINE",
          quantity: item.quantity,
          note: "Stock deducted from jetStore checkout",
          movement_date: new Date(),
        },
        { transaction }
      );
    }

    //all to process and finished at ONCE
    await transaction.commit();

    return res.status(201).json({
      message: "Checkout completed successfully",
      data: {
        order_id: order.id,
        customer_id: existingCustomer.id,
        total_amount: order.total_amount,
        status: order.status,
      },
    });
  } catch(error) {
        await transaction.rollback();
        //Error Response code 500: Internal server error -> unhandled exception
        return res.status(500).json({ message: 'Failed to process checkout ', error: error.message })
    }
};

module.exports = {
  getStoreProducts,
  getStoreProductById,
  checkoutStoreOrder,
};