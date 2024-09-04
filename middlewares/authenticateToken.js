import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import Token from '../models/tokenModel.js';

const authenticateToken = async (req, res, next) => {
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

export default authenticateToken;
