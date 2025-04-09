// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: 1, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id;

        // ✅ Log the decoded ID
        console.log("Authenticated user ID:", req.userId);

        next();
    } catch (err) {
        res.status(401).json({ error: 1, message: "Invalid or expired token" });
    }
};
