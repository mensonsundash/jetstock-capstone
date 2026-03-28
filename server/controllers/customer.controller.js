const Models  = require('../models');

/**
 * Function to get all customers list
 */
const getAllCustomers = async (req, res) => {
    try{
        // loggedin user data only
        const {id, role} = req.user;
        let whereClause = {};
        if(role !== 'admin') whereClause.user_id = id;

        const customers = await Models.Customer.findAll({where: whereClause});// using sequelize model findAll function to fetch from customer table

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Customer fetched successfully', data: customers })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch customer', error: error.message })
    }
}

/**
 * Function to get a customer by its id
 */
const getCustomerById = async (req, res) => {
    try{

        const customerId = req.params.id; // getting id from params provided on request

        const customer = await Models.Customer.findByPk(customerId); // using sequelize find by primary key

        //checking if customer not exist and stop : Code 404: Not Found
        if(!customer) return res.status(404).json({ message: "Customer not found"})

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Customer fetched successfully', data: customer })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch customer', error: error.message })
    }
}

/**
 * Function to create a customer
 */
const createCustomer = async (req, res) => {
    try{
        // destructure data from requested body value
        const { user_id, full_name, email, phone, address } = req.body;

        if(!user_id || !full_name || !email  ) {
            //Code 400: Bad Request -> missing/invalid body
            return res.status(400).json({ message: 'All customer fields are required'})
        }

        // check if updated email is being used by another customer // preventing duplicates
        if(email) {
            const existingCustomer = await Models.Customer.findOne({ where: {user_id, email} });
            //strict check: if the same current customer already has that email -> allow it
            if(existingCustomer) {
                //Code 409: Conflict -> duplication
                return res.status(409).json({ message: 'Customer with this email already exists', data: existingCustomer})
            }
        } 

        const customer = await Models.Customer.create({
            user_id,
            full_name,
            email,
            phone,
            address
        });
        //Success Response Code 201: Created -> POST create
        return res.status(201).json({ message: 'Customer created successfully', data: customer })

    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to create customer', error: error.message })
    }
}
/**
 * Function to update customer by its id
 */
const updateCustomer = async (req, res) => {
    try{
        const { id } = req.params; // getting id from params provided on request
        const { user_id, email } = req.body;

        const customer = await Models.Customer.findByPk(id); // using sequelize find by primary key

        // checking if customer not exist and stop : Code 404: Not Found
        if(!customer) return res.status(404).json({ message: "Customer not found"});

        // check if updated email is being used by another customer // preventing duplicates
        if(email) {
            const existingCustomer = await Models.Customer.findOne({ where: {user_id, email} });
            //strict check: if the same current customer already has that email -> allow it
            if(existingCustomer && existingCustomer.id !== Number(id)) {
                //Code 409: Conflict -> duplication
                return res.status(409).json({ message: 'Customer with this email already exists', data: existingCustomer})
            }
        } 

        //update customer row with customer id and replicate body data 
        const updatedCustomer = await Models.Customer.update(
            {...req.body},
            {where:{id: customer.id} }
        );

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Customer updated successfully', data: updatedCustomer })
    } catch(error) {
        //Error Response: with status code and json error message
        res.status(500).json({ message: 'Failed to update customer', error: error.message })
    }
}

/**
 * Function to get delete customer by its id
 */
const deleteCustomer = async (req, res) => {
    try{
        const { id } = req.params;
        
        const customer = await Models.Customer.findByPk(id); // using sequelize find by primary key

        // checking if customer not exist and stop : Code 404: Not Found
        if(!customer) return res.status(404).json({ message: "Customer not found"})

        await Models.Customer.destroy({where: {id: customer.id}});
        res.status(200).json({message: 'Customer deleted successfully', data: customer});

    } catch(error) {
        //Error Response: with status code and json error message
        res.status(500).json({ message: 'Failed to delete customer', error: error.message })
    }
}

// make available to import
module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
}