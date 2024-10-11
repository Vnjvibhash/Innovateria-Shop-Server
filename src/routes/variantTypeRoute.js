// variantTypeRoute.js
import express from 'express';
import { createVariantType, deleteVariantType, getVariantTypes, getVariantType, updateVariantType } from '../controllers/variantTypeController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getVariantTypes);
router.route('/:id').get(getVariantType);

router.use(authenticateToken);
router.route('/').post( createVariantType);
router.route('/:id').put( updateVariantType);
router.route('/:id').delete( deleteVariantType);

export default router;