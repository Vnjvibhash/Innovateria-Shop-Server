import Token from '../models/tokenModel.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Middleware to authenticate token
export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) return res.status(401).json({ success: false, message: 'Access denied. Not Authenticated' });

        // Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Check if token exists in the database
        const tokenRecord = await Token.findOne({ token });

        if (!tokenRecord) return res.status(401).json({ success: false, message: 'Invalid token' });

        // Attach userId to the request
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Middleware to verify admin role
export const authenticateAdmin = async (req, res, next) => {
    try {
        // Check for the token in request cookies
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }
        // Verify token and extract user ID
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid token.' });
        }

        // Check if the user has admin role
        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};