// userRoute.js
import express from 'express';
import { userRgister, userLogin, updateUserProfile, logoutUser, getUserProfile } from '../controllers/userController.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

router.route('/register').post(userRgister);
router.route('/login').post(userLogin);
router.route('/profile').put(authenticateToken, updateUserProfile);
router.route('/logout').post(authenticateToken, logoutUser);
router.route('/profile').get(authenticateToken, getUserProfile);

export default router;

