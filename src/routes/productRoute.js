// productRoute.js
import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/:id').get(getProduct);

router.use(authenticateToken);
router.route('/').post( createProduct);
router.route('/:id').put( updateProduct);
router.route('/:id').delete( deleteProduct);

export default router;
