const jwt = require('jsonwebtoken');
const User = require('../models/Usertype');


exports.verifyRoles = () => {
    return async (req, res, next) => {
        try {
            // Extract token from headers
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: 'Authorization token is missing', error: 1 });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Fetch the user and their roles
            const user = await User.findById(req.user.id).populate('roles.type');

            if (!user) {
                return res.status(404).json({ message: 'User not found', error: 1 });
            }

            // Extract all roles' values
            const roleValues = user.roles.map(role => role.value).flat();


            const hasAccess = roleValues.some(value => ['Write', 'Update', 'Delete'].includes(value));

            if (!hasAccess) {
                return res.status(403).json({ message: 'You do not have access to this resource', error: 1 });
            }

            // Proceed to the next middleware or controller
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    };
};
