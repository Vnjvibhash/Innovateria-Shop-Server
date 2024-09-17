// productRoute.js
import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/:id').get(getProduct);
router.route('/create').post(authenticateAdmin, createProduct);
router.route('/update/:id').put(authenticateAdmin, updateProduct);
router.route('/delete/:id').delete(authenticateAdmin, deleteProduct);

export default router;
