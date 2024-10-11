// couponRoute.js
import express from 'express';
import { createCoupon, deleteCoupon, getCoupons, getCoupon, updateCoupon, validateCoupon } from '../controllers/couponController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCoupons);
router.route('/:id').get(getCoupon);

router.use(authenticateToken);
router.route('/').post( createCoupon);
router.route('/:id').put( updateCoupon);
router.route('/:id').delete( deleteCoupon);
router.route('/validate').post(validateCoupon);

export default router;
