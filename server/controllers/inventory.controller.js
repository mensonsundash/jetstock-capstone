const { Op, where, col } = require('sequelize');
const Models  = require('../models');

/**
 * Function to get all inventory list
 */
const getAllInventory = async (req, res) => {
    try{
        // fetching inventory table and joining related table with alias as: supplier, category & inventory 
        const inventory = await Models.Inventory.findAll({
            include:[
                { model: Models.Product, as: "product" },
            ]
        });// using sequelize model findAll function to fetch with include feature to join another tables

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Inventory fetched successfully', data: inventory })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch inventory', error: error.message })
    }
}

/**
 * Function to get a inventory by its id
 */
const getInventoryById = async (req, res) => {
    try{

        const inventoryId = req.params.id; // getting id from params provided on request

        // fetching inventory table and joining related table with alias as: product
        const inventory = await Models.Inventory.findByPk(inventoryId,{
            include:[
                { model: Models.Product, as: "product" },
            ]
        }); // using sequelize find by primary key with include feature to join another tables

        //checking if inventory not exist and stop : Code 404: Not Found
        if(!inventory) return res.status(404).json({ message: "Inventory not found"})

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Inventory fetched successfully', data: inventory })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch inventory', error: error.message })
    }
}


/**
 * Function to get a inventory by its id
 */
const getInventoryByProductId = async (req, res) => {
    try{

        const { productId } = req.params; // getting product id from params provided on request

        // fetching inventory table and joining related table with alias as: product 
        const inventory = await Models.Inventory.findOne({
            where: { product_id: productId },
            include:[
                { model: Models.Product, as: "product" }
            ]
        }); // using sequelize findOne with include feature to join another tables

        //checking if inventory not exist and stop : Code 404: Not Found
        if(!inventory) return res.status(404).json({ message: "Inventory not found"})

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Inventory fetched successfully', data: inventory })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch inventory', error: error.message })
    }
}

/**
 * Function to get a low stocked inventory items
 */
const getLowStockItems = async (req, res) => {
    try{

        // fetching inventory table with where, col sequelize feautre to compare two columns
        const inventories = await Models.Inventory.findAll({
            where: where(col('quantity_on_hand'), "<=", col('reorder_level')),
            include:[
                { model: Models.Product, as: "product" }
            ]
        }); // using sequelize findOne with include feature to join another tables and compare operator for 2 columns

        //checking if inventory not exist and stop : Code 404: Not Found
        if(!inventories) return res.status(404).json({ message: "Inventory not found"})

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Inventory fetched with lock stock items', data: inventories })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch low stock items', error: error.message })
    }
}

/**
 * Function to get a low stocked inventory items
 */
const getOutOfStockItems = async (req, res) => {
    try{

        // fetching inventory table with where QOH is 0
        const inventories = await Models.Inventory.findAll({
            where: {quantity_on_hand: 0},
            include:[
                { model: Models.Product, as: "product" }
            ]
        }); // using sequelize findOne with include feature to join another tables

        //checking if inventory not exist and stop : Code 404: Not Found
        if(!inventories) return res.status(404).json({ message: "Inventory not found"})

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Inventory fetched with out of stock items', data: inventories })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch out of stock items', error: error.message })
    }
}

/**
 * Function to get a low stocked inventory items
 */
const getInventorySummary = async (req, res) => {
    try{

        // fetching inventory table with where, col sequelize feautre to compare two columns
        const inventories = await Models.Inventory.findAll({
            include:[
                { model: Models.Product, as: "product" }
            ]
        }); // using sequelize findOne with include feature to join another tables

        const totalProducts = inventories.length;// calculate total length of return data
        const totalQuantity = inventories.reduce((sum, inventory) => sum + inventory.quantity_on_hand, 0);//calculate by reducing into result sum by adding each inventory QOH
        const lowStockCount = inventories.filter((inventory) => inventory.quantity_on_hand <= inventory.reorder_level).length;// calculate length of filtered array of which QOH is less than reorder level
        const outOfStockCount = inventories.filter((inventory) => inventory.quantity_on_hand === 0).length; // calculate length of filtered array of which QOH is "0"

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Inventory fetched with out of stock items', data: {
            totalProducts,
            totalQuantity,
            lowStockCount,
            outOfStockCount
        }})
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch out of stock items', error: error.message })
    }
}

/**
 * Function to create a inventory
 * 
 * Creation of inventory happens once while creating new product as one-to one relationshi with product table
 */


/**
 * Function to update inventory by its id
 */
const updateInventory = async (req, res) => {
    try{
        const { productId } = req.params; // getting productId from params provided on request
        
        // fetching inventory table using product id as inventory is related to only that product its unique
        const inventory = await Models.Inventory.findOne({
            where: { product_id: productId }
        }); // using sequelize findOne

        

        // checking if inventory not exist and stop : Code 404: Not Found
        if(!inventory) return res.status(404).json({ message: "Inventory not found"});

        //update inventory row with inventory id and replicate body data 
        const updatedInventory = await Models.Inventory.update(
            {...req.body},
            {where:{id: inventory.id} }
        );

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Inventory updated successfully', data: updatedInventory })
    } catch(error) {
        //Error Response: with status code and json error message
        res.status(500).json({ message: 'Failed to update inventory', error: error.message })
    }
}

// make available to import
module.exports = {
    getAllInventory,
    getInventoryById,
    getInventoryByProductId,
    getLowStockItems,
    getOutOfStockItems,
    getInventorySummary,
    updateInventory,
    
}