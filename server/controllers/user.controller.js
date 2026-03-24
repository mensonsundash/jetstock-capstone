const Models  = require('../models');

/**
 * Function to get all users list
 */
const getAllUsers = async (req, res) => {
    try{
        const users = await Models.User.findAll();// using sequelize model findAll function to fetch from user table

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'User fetched successfully', data: users })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to fetch user', error: error.message })
    }
}

/**
 * Function to get a user by its id
 */
const getUserById = async (req, res) => {
    try{

        const userId = req.params.id; // getting id from params provided on request

        const user = await Models.User.findByPk(userId); // using sequelize find by primary key

        //checking if user not exist and stop : Code 404: Not Found
        if(!user) return res.status(404).json({ message: "User not found"})

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'User fetched successfully', data: user })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to fetch user', error: error.message })
    }
}

/**
 * Function to get all users list
 */
const createUser = async (req, res) => {
    try{
        // destructure data from requested body value
        const { first_name, last_name, email, password, business_name, phone, address, role } = req.body;

        if(!first_name || !last_name || !email  || !password || !business_name || !phone || !address || !role) {
            //Code 400: Bad Request -> missing/invalid body
            return res.status(400).json({ message: 'first_name, last_name, email, password, business_name, phone, address, role is required'})
        }

        // checking email already exist as email should be unique
        const existingUser = await User.findOne({
            where: { email }
        });

        if(existingUser) {
            //Code 409: Conflict -> duplication
            return res.status(409).json({ message: 'User with this email already exists'})
        }

        const result = await Models.User.create({
            first_name,
            last_name,
            email,
            password,
            business_name,
            phone,
            address,
            role: role || 'user'
        });
        //Success Response Code 201: Created -> POST create
        return res.status(201).json({ message: 'User created successfully', data: result })

    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to create user', error: error.message })
    }
}
/**
 * Function to get all users list
 */
const updateUser = async (req, res) => {
    try{
        const { id } = req.params; // getting id from params provided on request
        const { email } = req.body;

        const user = await Models.User.findByPk(id); // using sequelize find by primary key

        // checking if user not exist and stop : Code 404: Not Found
        if(!user) return res.status(404).json({ message: "User not found"});

        // check if updated email is being used by another user // preventing duplicates
        if(email) {
            const existingUser = await Models.User.findOne({ where: {email} });
            //strict check: if the same current user already has that email -> allow it
            if(existingUser && existingUser.id !== Number(id)) {
                //Code 409: Conflict -> duplication
                return res.status(409).json({ message: 'User with this email already exists'})
            }
        } 

        //update user row with user id and replicate body data 
        const updatedUser = await Models.User.update(
            {...req.body},
            {where:{id: user.id} }
        );

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'User updated successfully', data: updatedUser })
    } catch(error) {
        //Error Response: with status code and json error message
        req.status(500).json({ message: 'Failed to update user', error: error.message })
    }
}

/**
 * Function to get all users list
 */
const deleteUser = async (req, res) => {
    try{
        const { id } = req.params;
        
        const user = await Models.User.findByPk(id); // using sequelize find by primary key

        // checking if user not exist and stop : Code 404: Not Found
        if(!user) return res.status(404).json({ message: "User not found"})

        await Models.User.destroy({where: {id: user.id}});
        res.status(200).json({message: 'User deleted successfully', data: user});

    } catch(error) {
        //Error Response: with status code and json error message
        req.status(500).json({ message: 'Failed to delete user', error: error.message })
    }
}

// make available to import
module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}