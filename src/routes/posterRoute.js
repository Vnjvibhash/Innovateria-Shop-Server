// posterRoute.js
import express from 'express';
import { getPosters, getPoster, createPoster, updatePoster, deletePoster } from '../controllers/posterController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosters);

router.use(authenticateToken);
router.route('/').post(createPoster);
router.route('/:id').get(getPoster);
router.route('/:id').put(updatePoster);
router.route('/:id').delete(deletePoster);

export default router;
