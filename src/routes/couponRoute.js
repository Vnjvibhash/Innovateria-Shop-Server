// couponRoute.js
import express from 'express';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';
import { createCoupon, deleteCoupon, getCoupons, getCoupon, updateCoupon, validateCoupon } from '../controllers/couponController.js';

const router = express.Router();

router.route('/').get(getCoupons);
router.route('/:id').get(getCoupon);
router.route('/create').post(authenticateAdmin, createCoupon);
router.route('/update/:id').put(authenticateAdmin, updateCoupon);
router.route('/delete/:id').delete(authenticateAdmin, deleteCoupon);
router.route('/validate').post(validateCoupon);

export default router;
