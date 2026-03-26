//Middleware function for role-based authorization to pages
// authorizeRoles("admin") // using spread operator to accept any number of parameters
const authorizeRoles = (...allowedRoles) => {
    return (req,res, next) => {
        // validating req.user which is already authenticated and provided from authenticate middleware to be used
        if(!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: you don't have permission to access this module" });
        }

        next(); // if user has correct role and pass this perimeter then continue request to next
    };
};

module.exports = authorizeRoles;