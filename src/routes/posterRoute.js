// posterRoute.js
import express from 'express';
import { getPosters, getPoster, createPoster, updatePoster, deletePoster } from '../controllers/posterController.js';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosters);
router.route('/:id').get(getPoster);
router.route('/create').post(authenticateAdmin, createPoster);
router.route('/update/:id').put(authenticateAdmin, updatePoster);
router.route('/delete/:id').delete(authenticateAdmin, deletePoster);

export default router;
