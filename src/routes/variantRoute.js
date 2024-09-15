// variantRoute.js
import express from 'express';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';
import { createVariant, deleteVariant, getVariants, getVariant, updateVariant } from '../controllers/variantController.js';

const router = express.Router();

router.route('/').get(getVariants);
router.route('/:id').get(getVariant);
router.route('/create').post(authenticateAdmin, createVariant);
router.route('/update/:id').put(authenticateAdmin, updateVariant);
router.route('/delete/:id').delete(authenticateAdmin, deleteVariant);

export default router;
