const bcrypt = require("bcrypt"); // importing encryption method bcrypt for password hashing
const Models = require("../models"); // imporing models

const { generateToken } = require("../utils/jwt.utils"); // importing jwt utility
const { createUser } = require("./user.controller"); // importing createUser function from user.controller

// Deligation: registering user by reusing usercontroller createuser function
const registerUser = async (req, res) => {
    return createUser(req, res);
} 

// User login function
const loginUser = async (req, res) => {
    try{
        //destructure email and password
        const { email, password } = req.body;
        
        //  vlaidate required fields
        if(!email || !password)  return res.status(400).jsong({ message: "Email and password required"});

        // find user by email
        const user = await Models.User.findOne({ where: { email } });// using sequelize model findOne function to fetch from user table

        //checking if user not found against email & password the return unauthorized user and stop : Code 401
        if(!user) return res.status(401).json({ message: "Invalid email or password"});

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch) return res.status(401).json({message: "Invalid email or password"});

        // Generate jwt token with user data (payload)
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        // user information
        const userDetails = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            business_name: user.business_name,
            role: user.role
        }

        //Success Response code 200: OK -> Success
        // return roken and safe user information
        return res.status(200).json({ message: 'Login successful', token, data:{ userDetails }})
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Login failed', error: error.message })
    }
}


//function to return currently logged-in user profile
const getProfile = async (req, res) => {
    try{
        //req.user already provided by auth middleware after token verification
        // and also removing password from user details
        const user = await Models.User.findByPk(req.user.id, {
            attributes: { exclude: ["password"] }
        });

        //checking if user not exist and stop : Code 404: Not Found
        if(!user) return res.status(404).json({ message: "User not found"})

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'User profile fetched successfully', data: user })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        req.status(500).json({ message: 'Failed to fetch profile', error: error.message })
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile
}