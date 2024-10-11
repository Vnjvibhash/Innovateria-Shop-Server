// variantRoute.js
import express from 'express';
import { createVariant, getVariantsByVariantType, deleteVariant, getVariants, getVariant, updateVariant } from '../controllers/variantController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getVariants);
router.route('/:id').get(getVariant);
router.route('type/:id').get(getVariantsByVariantType);

router.use(authenticateToken);
router.route('/').post( createVariant);
router.route('/:id').put( updateVariant);
router.route('/:id').delete( deleteVariant);

export default router;
