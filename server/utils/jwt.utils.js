const jwt = require("jsonwebtoken"); // importing jsong webtoken


/**
 * helper utility function to generate a signed JWT token using JWT_SECRET
 * payload: data that stores inside token encrypted
 */
const generateToken = (payload) => {
    //JWT signing and generating the token for the payload
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    });
};

module.exports= {
    generateToken
}