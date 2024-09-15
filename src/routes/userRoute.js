// userRoute.js
import express from 'express';
import { getUsers, userRgister, userLogin, updateUserProfile, logoutUser, getUserProfile, deleteUserProfile } from '../controllers/userController.js';
import { authenticateAdmin, authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(authenticateAdmin, getUsers);
router.route('/register').post(userRgister);
router.route('/login').post(userLogin);
router.route('/profile').put(authenticateToken, updateUserProfile);
router.route('/logout').post(authenticateToken, logoutUser);
router.route('/profile').get(authenticateToken, getUserProfile);
router.route('/delete/:id').delete(authenticateAdmin,deleteUserProfile)

export default router;

