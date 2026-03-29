const { Op } = require('sequelize');
const Models  = require('../models');

/**
 * Function to get all products list with searching & filters options
 */
const getAllProducts = async (req, res) => {
    try{
        const { q ="", categoryId="", supplierId="" } = req.query; // query to get search/filters values
        const {id, role} = req.user; // loggedin user data only

        // non-admin user can only see only their own
        let whereClause = {};
        if(role !== 'admin') whereClause.user_id = id;

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
            ]
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
const getProductById = async (req, res) => {
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

/**
 * Function to create a product
 */
const createProduct = async (req, res) => {
    try{
        // destructure data from requested body value
        const { 
            user_id, supplier_id, category_id, 
            sku, name, description, 
            price, image_url, 
            quantity_on_hand, reorder_level, 
            location
        } = req.body;

        if (!user_id || !supplier_id || !category_id || !sku || !name || !price)  {
            //Code 400: Bad Request -> missing/invalid body
            return res.status(400).json({ message: 'All required fields must not be empty'})
        }

        // checking email already exist for the loggedin user: email may exist in another user too
        const existingProduct = await Models.Product.findOne({
            where: { user_id, sku }
        });

        if(existingProduct) {
            //Code 409: Conflict -> duplication
            return res.status(409).json({ message: 'Product SKU already exists'})
        }

        const product = await Models.Product.create({
            user_id,
            supplier_id,
            category_id,
            sku,
            name,
            description,
            price,
            image_url
        });
        // if product has been created another table Inventory is impacted to create one to one relationship
        // || 0 : if data is not provided default value is 0 or 5 or null
        if(product) {
            await Models.Inventory.create({
                product_id: product.id,
                quantity_on_hand: quantity_on_hand || 0,
                reorder_level: reorder_level || 5,
                location: location || null
            })
        }
        //Success Response Code 201: Created -> POST create
        return res.status(201).json({ message: 'Product created successfully', data: product })

    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to create product', error: error.message })
    }
}
/**
 * Function to update product by its id
 */
const updateProduct = async (req, res) => {
    try{
        const { id } = req.params; // getting id from params provided on request
        const { user_id, sku } = req.body;

        const product = await Models.Product.findByPk(id); // using sequelize find by primary key

        // checking if product not exist and stop : Code 404: Not Found
        if(!product) return res.status(404).json({ message: "Product not found"});

        // check if updated sku is being used by another product // preventing duplicates
        if(sku) {
            const existingProduct = await Models.Product.findOne({ where: {user_id, sku} });
            //strict check: if the same current product already has that sku -> allow it
            if(existingProduct && existingProduct.id !== Number(id)) {
                //Code 409: Conflict -> duplication
                return res.status(409).json({ message: 'Product with this sku already exists'})
            }
        } 

        //update product row with product id and replicate body data 
        const updatedProduct = await Models.Product.update(
            {...req.body},
            {where:{id: product.id} }
        );

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Product updated successfully', data: updatedProduct })
    } catch(error) {
        //Error Response: with status code and json error message
        res.status(500).json({ message: 'Failed to update product', error: error.message })
    }
}

/**
 * Function to delete product by its id
 */
const deleteProduct = async (req, res) => {
    try{
        const { id } = req.params;
        
        const product = await Models.Product.findByPk(id); // using sequelize find by primary key

        // checking if product not exist and stop : Code 404: Not Found
        if(!product) return res.status(404).json({ message: "Product not found"})

        await Models.Product.destroy({where: {id: product.id}});
        res.status(200).json({message: 'Product deleted successfully', data: product});

    } catch(error) {
        //Error Response: with status code and json error message
        res.status(500).json({ message: 'Failed to delete product', error: error.message })
    }
}

// make available to import
module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}