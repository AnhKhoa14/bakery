import { Router } from 'express';
import { getCart, addToCart, updateCartItemQuantity, removeCartItem, clearCart } from '../controllers/cartController';

const router = Router();
router.get('/:userId', getCart);
router.post('/add', addToCart);
router.put('/update-quantity', updateCartItemQuantity);
router.delete('/remove-item', removeCartItem);
router.delete('/clear', clearCart);

export default router;