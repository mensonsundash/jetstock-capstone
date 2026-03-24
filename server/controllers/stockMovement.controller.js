const { Op, where, col } = require('sequelize');
const Models  = require('../models');

/**
 * Function to get all stockMovement list
 */
const getAllStockMovements = async (req, res) => {
    try{
        // fetching stockMovement table and joining related table with alias as: product
        const stockMovements = await Models.StockMovement.findAll({
            include:[
                { model: Models.Product, as: "product" },
            ],
            order: [["movement_date", "DESC"]]
        });/* using sequelize model findAll function to fetch with include feature to join another tables 
         & descending order to get it by movement_date*/

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Stock movement fetched successfully', data: stockMovements })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to fetch stock movement', error: error.message })
    }
}

/**
 * Function to get a stockMovement by its id
 */
const getStockMovementById = async (req, res) => {
    try{

        const stockMovementId = req.params.id; // getting id from params provided on request

        // fetching stockMovement table and joining related table with alias as: product
        const stockMovement = await Models.StockMovement.findByPk(stockMovementId,{
            include:[
                { model: Models.Product, as: "product" }
            ]
        }); // using sequelize find by primary key with include feature to join another tables

        //checking if stockMovement not exist and stop : Code 404: Not Found
        if(!stockMovement) return res.status(404).json({ message: "Stock movement not found"})

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Stock movement fetched successfully', data: stockMovement })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to fetch stock movement', error: error.message })
    }
}


/**
 * Function to get a stockMovement by realated product id
 */
const getStockMovementsByProductId = async (req, res) => {
    try{

        const { productId } = req.params; // getting product id from params provided on request

        // fetching stockMovement table and joining related table with alias as: product 
        const stockMovements = await Models.StockMovement.findAll({
            where: { product_id: productId },
            include:[
                { model: Models.Product, as: "product" }
            ],
            order: [["movement_date", "DESC"]]
        }); // using sequelize findOne with include feature to join another tables

        //checking if stockMovement not exist and stop : Code 404: Not Found
        if(!stockMovements) return res.status(404).json({ message: "Stock movements not found"})

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Stock movements fetched successfully', data: stockMovements })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to fetch stock movements', error: error.message })
    }
}

/**
 * Function to create a stockMovement
 */

const createStockMovement = async (req, res) => {
    try{

        const stockMovement = await Models.stockMovement.create(req.body);
        
        //checking if stockMovement not exist and stop : Code 404: Not Found
        if(!stockMovement) return res.status(400).json({ message: "Stock movements not created"})

        //Success Response code 200: OK -> Success
        res.status(201).json({ message: 'Stock movements recorded successfully', data: stockMovement })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to record stock movements', error: error.message })
    }
}

/**
 * function to make stock in
 */
const stockInProduct = async (req, res) => {
     try{

        const {user_id, product_id, quantity, note, source_type, movement_date} = req.body;

         if (!user_id || !product_id || !quantity )  {
            //Code 400: Bad Request -> missing/invalid body
            return res.status(400).json({ message: 'All required fields must not be empty'})
        }
        const inventory = await Models.Inventory.findOne({where: { product_id }});

        if(!inventory) return res.status(404).json({message: 'Inventory record not found for this product'});

        //save QOH in inventory table with increased new quantity
        inventory.quantity_on_hand += Number(quantity);
        await inventory.save();

        const stockMovement = await Models.StockMovement.create({
            user_id,
            product_id,
            movement_type: "IN",
            source_type: source_type || "MANUAL",
            quantity,
            note,
            movement_date: movement_date || new Date()
        })
        
        //checking if stockMovement not exist and stop : Code 404: Not Found
        if(!stockMovement) return res.status(400).json({ message: "Stock movements not recorded"})

        //Success Response code 200: OK -> Success
        res.status(201).json({ message: 'Stock added successfully', data: stockMovement })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to stock in product', error: error.message })
    }
}

/**
 * function to make stock out
 */
const stockOutProduct = async (req, res) => {
     try{

        const {user_id, product_id, quantity, note, source_type, movement_date, order_item_id } = req.body;

         if (!user_id || !product_id || !quantity )  {
            //Code 400: Bad Request -> missing/invalid body
            return res.status(400).json({ message: 'All required fields must not be empty'})
        }
        const inventory = await Models.Inventory.findOne({where: { product_id }});

        if(!inventory) return res.status(404).json({message: 'Inventory record not found for this product'});

        if(inventory.quantity_on_hand < quantity) return res.status(400).json({ message:"Insufficient stock available" });

        //save QOH in inventory table with decreased new quantity
        inventory.quantity_on_hand -= Number(quantity);
        await inventory.save();

        const stockMovement = await Models.StockMovement.create({
            user_id,
            product_id,
            order_item_id: order_item_id || null,
            movement_type: "OUT",
            source_type: source_type || "MANUAL",
            quantity,
            note,
            movement_date: movement_date || new Date()
        })
        
        //checking if stockMovement not exist and stop : Code 404: Not Found
        if(!stockMovement) return res.status(400).json({ message: "Stock movements not recorded"})

        //Success Response code 200: OK -> Success
        res.status(201).json({ message: 'Stock removed successfully', data: stockMovement })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to stock out product', error: error.message })
    }
}


// make available to import
module.exports = {
    getAllStockMovements,
    getStockMovementById,
    getStockMovementsByProductId,
    createStockMovement,
    stockInProduct,
    stockOutProduct
    
}