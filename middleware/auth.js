
const jwt = require("jsonwebtoken");
const Users = require('../models/Register');

const auth = (requiredRole = "", requiredPermission = "") => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    error: 1,
                    message: "Unauthorized: No token provided"
                });
            }



            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);





            const user = await Users.findById(decoded?._id).populate("roles.type");


            if (!user) {
                return res.status(403).json({
                    error: 1,
                    message: "Forbidden: User does not exist"
                });
            }

            req.user = user;
            req.userId = user._id;
            req.usertype = decoded?.user_type?.title;


            const matchingRoles = user.roles.filter(role =>
                role.type.name.toLowerCase() === requiredRole.toLowerCase()
            );



            if (matchingRoles.length === 0) {
                return res.status(403).json({
                    error: 1,
                    message: "Forbidden: Role not allowed"
                });
            }

            // Check permission
            const permissions = matchingRoles[0].value.map(p => p.toLowerCase());
            if (!permissions.includes(requiredPermission.toLowerCase())) {
                return res.status(403).json({
                    error: 1,
                    message: "Forbidden: Operation not allowed"
                });
            }

            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({
                    error: 1,
                    message: "Session Expired",
                    details: error.message
                });
            }

            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    error: 1,
                    message: "Invalid Token",
                    details: error.message
                });
            }

            return res.status(500).json({
                error: 1,
                message: "Internal Server Error",
                details: error.message
            });
        }
    };
};

module.exports = auth;
