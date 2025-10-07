import Discount from "../models/Discount.js";
import type { Request, Response } from "express";

export const getDiscountIsActive = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const discount = await Discount.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).populate("coupon");
    res
      .status(200)
      .json({ message: "Discounts fetched successfully", discount });
  } catch (error) {
    console.error("Error fetching discount:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllDiscounts = async (req: Request, res: Response) => {
  try {
    const discounts = await Discount.find().populate("coupon");
    res
      .status(200)
      .json({ message: "All discounts fetched successfully", discounts });
  } catch (error) {
    console.error("Error fetching all discounts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createDiscount = async (req: Request, res: Response) => {
  try {
    const { code, coupon, startDate, endDate } = req.body;
    const newDiscount = new Discount({ code, coupon, startDate, endDate });
    await newDiscount.save();
    res
      .status(201)
      .json({ message: "Discount created successfully", newDiscount });
  } catch (error) {
    console.error("Error creating discount:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedDiscount = await Discount.findByIdAndUpdate(id);
    if (!deletedDiscount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    deletedDiscount.isDeleted = true;
    await deletedDiscount.save();
    res.status(200).json({ message: "Discount deleted successfully" });
  } catch (error) {
    console.error("Error deleting discount:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, coupon, startDate, endDate } = req.body;
    const updatedDiscount = await Discount.findByIdAndUpdate(
      id,
      { code, coupon, startDate, endDate },
      { new: true }
    ).populate("coupon");
    if (!updatedDiscount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    res
      .status(200)
      .json({ message: "Discount updated successfully", updatedDiscount });
  } catch (error) {
    console.error("Error updating discount:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getDiscountIsActive,
  getAllDiscounts,
  createDiscount,
  deleteDiscount,
  updateDiscount,
};
