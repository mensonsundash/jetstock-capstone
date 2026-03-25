const Models  = require('../models');

/**
 * Function to get all categories list
 */
const getAllCategories = async (req, res) => {
    try{
        const categories = await Models.Category.findAll();// using sequelize model findAll function to fetch from category table

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Category fetched successfully', data: categories })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to fetch category', error: error.message })
    }
}

/**
 * Function to get a category by its id
 */
const getCategoryById = async (req, res) => {
    try{

        const categoryId = req.params.id; // getting id from params provided on request

        const category = await Models.Category.findByPk(categoryId); // using sequelize find by primary key

        //checking if category not exist and stop : Code 404: Not Found
        if(!category) return res.status(404).json({ message: "Category not found"})

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Category fetched successfully', data: category })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to fetch category', error: error.message })
    }
}

/**
 * Function to create a category
 */
const createCategory = async (req, res) => {
    try{
        // destructure data from requested body value
        const { user_id, name, description } = req.body;

        if(!user_id || !name) {
            //Code 400: Bad Request -> missing/invalid body
            return res.status(400).json({ message: 'Usere id and name are required'})
        }

        // checking category name already exist for the loggedin user: name may exist in another user too
        const existingCategory = await Models.Category.findOne({
            where: { user_id, name }
        });

        if(existingCategory) {
            //Code 409: Conflict -> duplication
            return res.status(409).json({ message: 'Category with this name already exists'})
        }

        const result = await Models.Category.create({
            user_id,
            name,
            description
        });
        //Success Response Code 201: Created -> POST create
        return res.status(201).json({ message: 'Category created successfully', data: result })

    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to create category', error: error.message })
    }
}
/**
 * Function to update category by its id
 */
const updateCategory = async (req, res) => {
    try{
        const { id } = req.params; // getting id from params provided on request
        const { user_id, name } = req.body;

        const category = await Models.Category.findByPk(id); // using sequelize find by primary key

        // checking if category not exist and stop : Code 404: Not Found
        if(!category) return res.status(404).json({ message: "Category not found"});

        // check if updated name is being used by another category // preventing duplicates
        if(name) {
            const existingCategory = await Models.Category.findOne({ where: {user_id, name} });
            //strict check: if the same current category already has that name -> allow it
            if(existingCategory && existingCategory.id !== Number(id)) {
                //Code 409: Conflict -> duplication
                return res.status(409).json({ message: 'Category with this name already exists'})
            }
        } 

        //update category row with category id and replicate body data 
        const updatedCategory = await Models.Category.update(
            {...req.body},
            {where:{id: category.id} }
        );

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Category updated successfully', data: updatedCategory })
    } catch(error) {
        //Error Response: with status code and json error message
        req.status(500).json({ message: 'Failed to update category', error: error.message })
    }
}

/**
 * Function to delete category by its id
 */
const deleteCategory = async (req, res) => {
    try{
        const { id } = req.params;
        
        const category = await Models.Category.findByPk(id); // using sequelize find by primary key

        // checking if category not exist and stop : Code 404: Not Found
        if(!category) return res.status(404).json({ message: "Category not found"})

        await Models.Category.destroy({where: {id: category.id}});
        res.status(200).json({message: 'Category deleted successfully', data: category});

    } catch(error) {
        //Error Response: with status code and json error message
        req.status(500).json({ message: 'Failed to delete category', error: error.message })
    }
}

// make available to import
module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}