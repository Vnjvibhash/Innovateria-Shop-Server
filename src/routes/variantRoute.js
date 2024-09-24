// variantRoute.js
import express from 'express';
import { createVariant, deleteVariant, getVariants, getVariant, updateVariant } from '../controllers/variantController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getVariants);
router.route('/:id').get(getVariant);

router.use(authenticateToken);
router.route('/').post( createVariant);
router.route('/:id').put( updateVariant);
router.route('/:id').delete( deleteVariant);

export default router;
