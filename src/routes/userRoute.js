import express from 'express';
import {
    getUsers,
    createUser,
    userLogin,
    updateUser,
    logoutUser,
    getUserProfile,
    getUserById,
    deleteUserProfile,
} from '../controllers/userController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(createUser);
router.route('/login').post(userLogin);
router.route('/logout').post(logoutUser);

router.use(authenticateToken);
router.route('/:id').get(authorizeRoles('admin', 'vendor'), getUserById);
router.route('/').get(authorizeRoles('admin'), getUsers);
router.route('/:id').put(authorizeRoles('admin', 'vendor'), updateUser);
router.route('/profile').get(authorizeRoles('user', 'admin', 'vendor'), getUserProfile);
router.route('/:id').delete(authorizeRoles('admin'), deleteUserProfile);


export default router;
