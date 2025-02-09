// categoryRoute.js
import express from 'express';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/categoryController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCategories);
router.route('/:id').get(getCategory);

router.use(authenticateToken);
router.route('/').post(createCategory);
router.route('/:id').put(updateCategory);
router.route('/:id').delete(deleteCategory);

export default router;
