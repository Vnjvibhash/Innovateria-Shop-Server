// brandRoute.js
import express from 'express';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';
import { createBrand, deleteBrand, getBrands, getBrand, updateBrand } from '../controllers/brandController.js';

const router = express.Router();

router.route('/').get(getBrands);
router.route('/:id').get(getBrand);
router.route('/create').post(authenticateAdmin, createBrand);
router.route('/update/:id').put(authenticateAdmin, updateBrand);
router.route('/delete/:id').delete(authenticateAdmin, deleteBrand);

export default router;
