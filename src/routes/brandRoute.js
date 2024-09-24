// brandRoute.js
import express from 'express';
import { createBrand, deleteBrand, getBrands, getBrand, updateBrand, getBrandBySubcategory } from '../controllers/brandController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getBrands);
router.route('/:id').get(getBrand);
router.route('/:subId').get(getBrandBySubcategory);

router.use(authenticateToken);
router.route('/').post( createBrand);
router.route('/:id').put( updateBrand);
router.route('/:id').delete( deleteBrand);

export default router;
