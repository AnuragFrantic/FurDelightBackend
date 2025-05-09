// const UserModel = require('../models/Register'); // adjust path as needed
// const Module = require()

// module.exports = function verifyRoles(requiredPermissions = []) {
//     return async (req, res, next) => {
//         try {
//             const userId = req.userId;

//             if (!userId) {
//                 return res.status(401).json({
//                     success: false,
//                     message: "Unauthorized. No user ID found.",
//                     error: 1
//                 });
//             }

//             const user = await UserModel.findById(userId);

//             if (!user || !Array.isArray(user.roles)) {
//                 return res.status(403).json({
//                     success: false,
//                     message: "Access denied. No roles assigned.",
//                     error: 1
//                 });
//             }

//             console.log(user)

//             // Flatten permissions
//             const userPermissions = user.roles.flatMap(role => role.value);


//             console.log(userPermissions)

//             const hasPermission = requiredPermissions.every(perm =>
//                 userPermissions.includes(perm)
//             );

//             if (!hasPermission) {
//                 return res.status(403).json({
//                     success: false,
//                     message: `You do not have the required permissions: ${requiredPermissions.join(", ")}`,
//                     error: 1
//                 });
//             }

//             next();
//         } catch (err) {
//             console.error("Role verification failed:", err);
//             return res.status(500).json({
//                 success: false,
//                 message: "Internal server error during role verification.",
//                 error: err.message
//             });
//         }
//     };
// };



