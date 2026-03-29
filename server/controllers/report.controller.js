const Models  = require('../models');

/**
 * Function to get stock movement report: All stock movement with related products
 */
const getStockMovementReport = async (req, res) => {
    try{
        // loggedin user data only
        const {id, role} = req.user;
        let whereClause = {};
        if(role !== 'admin') whereClause.user_id = id;

        const movements = await Models.StockMovement.findAll({
            where: whereClause,
            include: [
                {
                model: Models.Product,
                as: "product",
                attributes: ["id", "name", "sku"],
                },
            ],
            order: [["movement_date", "DESC"]],
        });

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Report fetched successfully', data: movements })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch stock movement report', error: error.message })
    }
}

/**
 * Function to get inventory summary report: All inventory records with related products,category,suppliers
 */
const getInventorySummaryReport = async (req, res) => {
    try{
        // loggedin user data only
        const {id, role} = req.user;
        let whereClause = {};
        if(role !== 'admin') whereClause.user_id = id;

        const inventory = await Models.Inventory.findAll({
            include: [
                {
                model: Models.Product,
                as: "product",
                where: whereClause,
                attributes: ["id", "name", "sku", "price"],
                include: [
                    {
                    model: Models.Category,
                    as: "category",
                    attributes: ["id", "name"],
                    },
                    {
                    model: Models.Supplier,
                    as: "supplier",
                    attributes: ["id", "name"],
                    },
                ],
                },
            ],
            order: [["id", "ASC"]],
        });

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Report fetched successfully', data: inventory })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch inventory summary report', error: error.message })
    }
}

/**
 * Function to get low sock report: Inventory items where QOH <= reorder level
 */
const getLowStockReport = async (req, res) => {
    try{
        // loggedin user data only
        const {id, role} = req.user;
        let whereClause = {};
        if(role !== 'admin') whereClause.user_id = id;

        const inventory = await Models.Inventory.findAll({
            include: [
                {
                model: Models.Product,
                as: "product",
                where: whereClause,
                attributes: ["id", "name", "sku", "price"],
                include: [
                    {
                    model: Models.Category,
                    as: "category",
                    attributes: ["id", "name"],
                    },
                    {
                    model: Models.Supplier,
                    as: "supplier",
                    attributes: ["id", "name"],
                    },
                ],
                },
            ],
            order: [["quantity_on_hand", "ASC"]],
        });

        // Filter low-stock items in controller
        const lowStockItems = inventory.filter(
            (item) => Number(item.quantity_on_hand) <= Number(item.reorder_level)
        );

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Report fetched successfully', data: lowStockItems })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch low stock report', error: error.message })
    }
}


// make available to import
module.exports = {
    getStockMovementReport,
    getInventorySummaryReport,
    getLowStockReport
}