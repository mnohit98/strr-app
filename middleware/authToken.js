// middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Middleware function to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.member_id = decoded.userId; // Attach user information to the request object
        next(); // Move to the next middleware or route handler
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};

module.exports = authenticateToken;
