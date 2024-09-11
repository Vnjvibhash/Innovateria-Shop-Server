// subCategoryRoute.js
import express from 'express';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';
import { createSubCategory, deleteSubCategory, getSubCategories, getSubCategory, updateSubCategory} from '../controllers/subCategoryController.js'

const router = express.Router();

router.route('/').get(getSubCategories);
router.route('/:id').get(getSubCategory);
router.route('/create').post(authenticateAdmin, createSubCategory);
router.route('/update/:id').put(authenticateAdmin, updateSubCategory);
router.route('/delete/:id').delete(authenticateAdmin,deleteSubCategory)

export default router;
