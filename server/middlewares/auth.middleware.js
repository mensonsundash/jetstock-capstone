const jwt = require("jsonwebtoken"); // importing json webtoken

// Middleware to verify JWT token befoe allwing access
const authenticate = (req, res, next) => {
    try{
        const authHeader =  req.headers.authorization; // read authorization header : Expect format->Bearer {token}

        // validating is header has Bearer if not reject request
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({message: 'Access denied. No token provided'});
        }

        const token = authHeader.split(" ")[1]; // extracting token part only

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token signature and expiry using secret key

        // Attach decoded user payload to request object
        req.user = decoded; // this allow controller to use req.user

        next();// this will pass control to controller
    }catch(error) {
        return res.status(500).json({message:"Invalid or expired token", error});
    }
};

module.exports = authenticate;