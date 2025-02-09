// subCategoryRoute.js
import express from 'express';
import { createSubCategory, deleteSubCategory, getSubCategories, getSubCategory, updateSubCategory, getSubCategoriesByCategory } from '../controllers/subCategoryController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getSubCategories);
router.route('/:id').get(getSubCategory);
router.route('/cat/:id').get(getSubCategoriesByCategory);

router.use(authenticateToken);
router.route('/').post(createSubCategory);
router.route('/:id').put(updateSubCategory);
router.route('/:id').delete(deleteSubCategory)

export default router;
