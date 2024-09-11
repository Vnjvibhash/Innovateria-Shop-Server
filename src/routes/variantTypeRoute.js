// variantTypeRoute.js
import express from 'express';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';
import { createVariantType, deleteVariantType, getVariantTypes, getVariantType, updateVariantType } from '../controllers/variantTypeController.js';

const router = express.Router();

router.route('/').get(getVariantTypes);
router.route('/:id').get(getVariantType);
router.route('/create').post(authenticateAdmin, createVariantType);
router.route('/update/:id').put(authenticateAdmin, updateVariantType);
router.route('/delete/:id').delete(authenticateAdmin, deleteVariantType);

export default router;