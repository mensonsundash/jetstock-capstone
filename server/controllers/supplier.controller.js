const Models  = require('../models');

/**
 * Function to get all suppliers list
 */
const getAllSuppliers = async (req, res) => {
    try{
        const suppliers = await Models.Supplier.findAll();// using sequelize model findAll function to fetch from supplier table

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Supplier fetched successfully', data: suppliers })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to fetch supplier', error: error.message })
    }
}

/**
 * Function to get a supplier by its id
 */
const getSupplierById = async (req, res) => {
    try{

        const supplierId = req.params.id; // getting id from params provided on request

        const supplier = await Models.Supplier.findByPk(supplierId); // using sequelize find by primary key

        //checking if supplier not exist and stop : Code 404: Not Found
        if(!supplier) return res.status(404).json({ message: "Supplier not found"})

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Supplier fetched successfully', data: supplier })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to fetch supplier', error: error.message })
    }
}

/**
 * Function to create a supplier
 */
const createSupplier = async (req, res) => {
    try{
        // destructure data from requested body value
        const { user_id, name, email, contact_person, phone, address } = req.body;

        if(!user_id || !name || !email  || !contact_person || !phone || !address) {
            //Code 400: Bad Request -> missing/invalid body
            return res.status(400).json({ message: 'All supplier fields are required'})
        }

        // checking email already exist for the loggedin user: email may exist in another user too
        const existingSupplier = await Supplier.findOne({
            where: { user_id, email }
        });

        if(existingSupplier) {
            //Code 409: Conflict -> duplication
            return res.status(409).json({ message: 'Supplier with this email already exists'})
        }

        const result = await Models.Supplier.create({
            user_id,
            name,
            email,
            contact_person,
            phone,
            address,
        });
        //Success Response Code 201: Created -> POST create
        return res.status(201).json({ message: 'Supplier created successfully', data: result })

    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to create supplier', error: error.message })
    }
}
/**
 * Function to update supplier by its id
 */
const updateSupplier = async (req, res) => {
    try{
        const { id } = req.params; // getting id from params provided on request
        const { user_id, email } = req.body;

        const supplier = await Models.Supplier.findByPk(id); // using sequelize find by primary key

        // checking if supplier not exist and stop : Code 404: Not Found
        if(!supplier) return res.status(404).json({ message: "Supplier not found"});

        // check if updated email is being used by another supplier // preventing duplicates
        if(email) {
            const existingSupplier = await Models.Supplier.findOne({ where: {user_id, email} });
            //strict check: if the same current supplier already has that email -> allow it
            if(existingSupplier && existingSupplier.id !== Number(id)) {
                //Code 409: Conflict -> duplication
                return res.status(409).json({ message: 'Supplier with this email already exists'})
            }
        } 

        //update supplier row with supplier id and replicate body data 
        const updatedSupplier = await Models.Supplier.update(
            {...req.body},
            {where:{id: supplier.id} }
        );

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Supplier updated successfully', data: updatedSupplier })
    } catch(error) {
        //Error Response: with status code and json error message
        req.status(500).json({ message: 'Failed to update supplier', error: error.message })
    }
}

/**
 * Function to delete supplier by its id
 */
const deleteSupplier = async (req, res) => {
    try{
        const { id } = req.params;
        
        const supplier = await Models.Supplier.findByPk(id); // using sequelize find by primary key

        // checking if supplier not exist and stop : Code 404: Not Found
        if(!supplier) return res.status(404).json({ message: "Supplier not found"})

        await Models.Supplier.destroy({where: {id: supplier.id}});
        res.status(200).json({message: 'Supplier deleted successfully', data: supplier});

    } catch(error) {
        //Error Response: with status code and json error message
        req.status(500).json({ message: 'Failed to delete supplier', error: error.message })
    }
}

// make available to import
module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
}