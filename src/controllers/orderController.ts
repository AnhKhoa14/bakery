import Order from "../models/Order.js";
import User from "../models/User.js";
import OrderStatus from "../models/OrderStatus.js";
import PaymentMethod from "../models/PaymentMethod.js";
import type { Request, Response } from "express";

//create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, paymentMethodId, totalPrice } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderStatus = await OrderStatus.findOne({ status: "Pending" });
    if (!orderStatus) {
      return res.status(404).json({ message: "Order status not found" });
    }

    const paymentMethod = await PaymentMethod.findById(paymentMethodId);
    if (!paymentMethod) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    const newOrder = new Order({
      user: user._id,
      orderStatus: orderStatus._id,
      paymentMethod: paymentMethod._id,
      totalPrice,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order", error });
  }
};

//get order by user
export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId, isDeleted: false })
      .populate("orderStatus")
      .populate("paymentMethod")
      .populate("discount");
    res.status(200).json(orders);
  } catch (error) {
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
      .populate("discount")
      .populate("user", "fullName email")
      .populate({
        path: "orderItems",
        populate: { path: "product", select: "name price" },
      });
    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
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
