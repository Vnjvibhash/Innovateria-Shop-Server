// categoryRoute.js
import express from 'express';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.route('/').get(getCategories);
router.route('/:id').get(getCategory);
router.route('/create').post(authenticateAdmin, createCategory);
router.route('/update/:id').put(authenticateAdmin, updateCategory);
router.route('/delete/:id').delete(authenticateAdmin, deleteCategory);

export default router;
