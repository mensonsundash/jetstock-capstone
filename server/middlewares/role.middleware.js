//Middleware function for role-based authorization to pages
// authorizeRoles("admin") // using spread operator to accept any number of parameters
const authorizeRoles = (...allowedRoles) => {
    return (req,res, next) => {

        try{
            // check if user exists which is provided by authenticate middleware
            if(!req.user) {
                //user correct but not authorized access
                return res.status(401).json({ message: "Unauthorized access" });    
            }   

            // validating req.user which is already authenticated and provided from authenticate middleware to be used
            if(!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: "Forbidden: you don't have permission to access this module" });
            }

            next(); // if user has correct role and pass this perimeter then continue request to next

        } catch(error) {
            return res.status(500).json({message: 'Authorization failed', error: error.message});
        }

        
    };
};

module.exports = authorizeRoles;