import { Router } from 'express';
import { getCart, addToCart, updateCartItemQuantity, removeCartItem, clearCart } from '../controllers/cartController.js';

const router = Router();
router.get('/:userId', getCart);
router.post('/add-to-cart', addToCart);
router.put('/update-cart-item-quantity', updateCartItemQuantity);
router.delete('/remove-cart-item', removeCartItem);
router.delete('/clear-cart', clearCart);

export default router;