import { Router } from 'express';
import { addReview, getListReviews, deleteReview, likeReview, unlikeReview } from '../controllers/reviewController.js';
import { authenticateToken, allowRoles } from '../middlewares/authentication.js';

const router = Router();

router.post('/products/:productId', addReview);
router.get('/products/:productId', getListReviews);
router.delete('/reviews/:reviewId', authenticateToken, allowRoles('admin', 'customer'), deleteReview);
router.post('/reviews/:reviewId/like', authenticateToken, likeReview);
router.post('/reviews/:reviewId/unlike', authenticateToken, unlikeReview);


export default router;