import { Router } from 'express';
import { getCart, addToCart, updateCartItemQuantity, removeCartItem, clearCart } from '../controllers/cartController.js';
import { authenticateToken, allowRoles } from '../middlewares/authentication.js';

const router = Router();
router.get('/', authenticateToken, allowRoles("customer"), getCart);
router.post('/add-to-cart', authenticateToken, allowRoles("customer"), addToCart);
router.put('/update-cart-item-quantity', authenticateToken, allowRoles("customer"), updateCartItemQuantity);
router.delete('/remove-cart-item', authenticateToken, allowRoles("customer"), removeCartItem);
router.delete('/clear-cart', authenticateToken, allowRoles("customer"), clearCart);

export default router;