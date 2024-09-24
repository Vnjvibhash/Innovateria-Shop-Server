import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Middleware to authenticate tokenimport jwt from 'jsonwebtoken';
// export const authenticateToken = (req, res, next) => {
//     try {
//         const token = req.headers['authorization']?.split(' ')[1];
//         if (!token) {
//             return res.status(401).json({ success: false, message: 'Access denied. Not Authenticated' });
//         }
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         req.userId = decoded.userId;
//         next();
//     } catch (error) {
//         console.error('Error in authenticateToken:', error);
//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({ success: false, message: 'Invalid token' });
//         }
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ success: false, message: 'Token expired' });
//         }
//         res.status(500).json({ success: false, message: error.message });
//     }
// };
export const authenticateToken = (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) return res.status(401).json({ success: false, message: 'Access denied. Not Authenticated' });
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        console.error('Error in authenticateToken:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};


// Middleware to authorize roles
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userId) {
            return res.status(403).json({ success: false, message: 'Access denied. Not authenticated' });
        }
        const userRole = req.userRole;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions' });
        }
        next();
    };
};


