import Order from "../models/Order.js";
import User from "../models/User.js";
import OrderStatus from "../models/OrderStatus.js";
import PaymentMethod from "../models/PaymentMethod.js";
import type { Request, Response } from "express";
import OrderDetail from "../models/OrderDetail.js";
import { AuthRequest } from "../types/auth.js";

//create a new order
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentMethod, orderStatus, discount, items } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const pm = await PaymentMethod.findById(paymentMethod);
    if (!pm) {
      return res.status(404).json({ message: "Payment method not found" });
    }
    const newOrder = await Order.create({
      user: userId,
      totalPrice: items.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0
      ),
      paymentMethod: pm._id,
      orderStatus,
      discount,
    });

    const orderDetails = await OrderDetail.insertMany(
      items.map((item: any) => ({
        order: newOrder._id,
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        discount: item.discountId || null,
      }))
    );

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
      orderDetails,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//get order by user
export const getOrdersByUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const orders = await Order.find({ user: userId, isDeleted: false })
      .populate("orderStatus")
      .populate("paymentMethod")
      // .populate("discount");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to get orders", error });
  }
};

//get all orders (admin only)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ isDeleted: false })
      .populate("user")
      .populate("orderStatus")
      .populate("paymentMethod")
      .populate("discount");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders", error });
  }
};

//chi tiet don hang
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("user")
      .populate("orderStatus")
      .populate("paymentMethod")
      .populate("discount");
    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to get order", error });
  }
};

//cap nhat trang thai don hang
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { statusId } = req.body;
    const order = await Order.findById(orderId);
    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }
    const status = await OrderStatus.findById(statusId);
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, isDeleted: false },
      { orderStatus: status._id },
      { new: true }
    ).populate("orderStatus");
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error });
  }
};

//cancel order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.isDeleted = true;
    await order.save();
    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order", error });
  }
};

//track order - theo doi don hang
export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("orderStatus")
      .populate("paymentMethod")
      // .populate("discount")
      .populate("user", "fullName email");

    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderDetails = await OrderDetail.find({ order: order._id, isDeleted: false })
      .populate("product", "name price")
      // .populate("discount");

    res.status(200).json({
      ...order.toObject(),
      orderDetails,
    });
  } catch (error) {
    console.error("Error tracking order:", error);
    res.status(500).json({ message: "Failed to track order", error });
  }
};

//statistics - thong ke don hang (admin)
export const getOrderStatistics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const match: any = { isDeleted: false };
    if (startDate && endDate) {
      match.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }
    const orders = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get order statistics", error });
  }
};

export default {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  trackOrder,
  getOrderStatistics,
};
