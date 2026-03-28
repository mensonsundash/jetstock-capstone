const Models  = require('../models');

const bcrypt = require("bcrypt"); // importing password hashing using bcrypt

/**
 * Function to get all users list
 */
const getAllUsers = async (req, res) => {
    try{
        // loggedin user data only
        const {id, role} = req.user;
        let whereClause = {};
        if(role !== 'admin') whereClause.user_id = id;

        const users = await Models.User.findAll({
            where: whereClause,
            attributes: { exclude: ["password"] }
        });// using sequelize model findAll function to fetch from user table and exclude password

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'User fetched successfully', data: users })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch user', error: error.message })
    }
}

/**
 * Function to get a user by its id
 */
const getUserById = async (req, res) => {
    try{

        const userId = req.params.id; // getting id from params provided on request

        // protecting exposure of password
        const user = await Models.User.findByPk(userId, {
            attributes: { exclude: ["password"] }
        }); // using sequelize find by primary key and attribute feature to exclude password field

        //checking if user not exist and stop : Code 404: Not Found
        if(!user) return res.status(404).json({ message: "User not found"})

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'User fetched successfully', data: user })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch user', error: error.message })
    }
}

/**
 * Function to create a user
 */
const createUser = async (req, res) => {
    try{
        // destructure data from requested body value
        const { first_name, last_name, email, password, business_name, phone, address, role } = req.body;

        if(!first_name || !last_name || !email  || !password || !business_name ) {
            //Code 400: Bad Request -> missing/invalid body
            return res.status(400).json({ message: 'All user fields are required'})
        }
        
        // checking email already exist as email should be unique
        const existingUser = await Models.User.findOne({
            where: { email }
        });

        console.log(existingUser)
        if(existingUser) {
            //Code 409: Conflict -> duplication
            return res.status(409).json({ message: 'User with this email already exists'})
        }

        // hashing password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Models.User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            business_name,
            phone,
            address,
            role: role || 'user'
        });

        //protecting expose of password so separate details of user without password
        const userDetails = {
            id:user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            business_name: user.business_name,
            phone: user.phone,
            address: user.address,
            role: user.role
        };
        //Success Response Code 201: Created -> POST create
        return res.status(201).json({ message: 'User created successfully', data: userDetails })

    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to create user', error: error.message })
    }
}
/**
 * Function to update user by its id
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

         // hashing password using bcrypt before saving updates
         if(req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
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
        res.status(500).json({ message: 'Failed to update user', error: error.message })
    }
}

/**
 * Function to get delete user by its id
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
        res.status(500).json({ message: 'Failed to delete user', error: error.message })
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