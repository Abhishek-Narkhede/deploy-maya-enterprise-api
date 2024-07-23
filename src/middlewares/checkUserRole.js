const checkUserRole = (allowedRoles) => {
    return (req, res, next) => {
        // console.log("CheckUSerRole:: ", req?.role);
        const userRole = req?.user.role; // Assuming req.user contains the user details
        if (allowedRoles.includes(userRole)) {
            // User has the required role, proceed to the next middleware/route handler
            next();
        } else {
            // User does not have the required role, send a forbidden response
            res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }
    };
};

module.exports = checkUserRole;