import type { Request, Response } from "express";
import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";

// lấy cart của user kèm cart items
export const getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // tìm giỏ hàng theo user
    const cart = await Cart.findOne({ user: userId, isDeleted: false });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // lấy cart items thuộc cart đó
    const cartItems = await CartItem.find({ cart: cart._id, isDeleted: false })
      .populate("product", "name price imageUrl") // join sang Product
      .exec();

    res.json({
      cartId: cart._id,
      user: cart.user,
      items: cartItems.map((item) => ({
        id: item._id,
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        note: item.note,
        isChecked: item.isChecked,
      })),
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//thêm sản phẩm vào giỏ hàng
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { cartId, productId, quantity, price, note } = req.body;
    // Tìm giỏ hàng
    let cart;
    if (cartId) {
      cart = await Cart.findById(cartId);
    }
    if (!cart) {
      cart = new Cart({});
      await cart.save();
    }
    let cartItem = await CartItem.findOne({
      cart: cart._id,
      product: productId,
      isDeleted: false,
    });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new CartItem({
        cart: cart._id,
        product: productId,
        quantity,
        price,
        note: note || "",
      });
      await cartItem.save();
    }
    res.status(201).json({
      message: "Added to cart successfully",
      cartItem,
    });
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//cập nhật số lượng
export const updateCartItemQuantity = async (req: Request, res: Response) => {
  try {
    const { cartItemId, quantity } = req.body;

    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity <= 0) {
      await cartItem.deleteOne();
      return res.json({ message: "Cart item removed from cart" });
    }
    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({ message: "Cart item quantity updated", cartItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//xóa 1 item
export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { cartItemId } = req.body;

    const cartItem = await CartItem.findByIdAndUpdate(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.isDeleted = true;
    await cartItem.save();

    res.json({ message: "Cart item removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//clear all items in cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const { cartId } = req.body;

    const cartItems = await CartItem.updateMany(
      { cart: cartId, isDeleted: false },
      { isDeleted: true }
    );
    res.json({ message: "Cart cleared successfully", cartItems });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export default {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};
