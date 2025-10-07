import Coupon from "../models/Coupon.js";
import type { Request, Response } from "express";

export const applyCoupon = async (req: Request, res: Response) => {
  try {
    const { code, totalPrice } = req.body;
    const now = new Date();

    const coupon = await Coupon.findOne({ code: code });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.redeemBy && coupon.redeemBy < now) {
      return res.status(400).json({ message: "Coupon has expired" });
    }
    if (
      coupon.maxRedemptions &&
      coupon.timesRedeemed >= coupon.maxRedemptions
    ) {
      return res
        .status(400)
        .json({ message: "Coupon has reached its maximum redemptions" });
    }

    let discountAmount = 0;
    if (coupon.percentOff) {
      discountAmount = (totalPrice * coupon.percentOff) / 100;
    } else if (coupon.amountOff) {
      discountAmount = coupon.amountOff;
    }

    coupon.timesRedeemed += 1;
    await coupon.save();
    res.status(200).json({
      message: "Coupon applied successfully",
      discountAmount,
      newTotal: totalPrice - discountAmount,
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCouponByCode = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const coupon = await Coupon.findOne({ code: code });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

export const getAllCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

export const createCoupon = async (req: Request, res: Response) => {
    try {
        const { code, percentOff, amountOff, maxRedemptions, redeemBy } = req.body;
        const newCoupon = new Coupon({
            code,
            percentOff,
            amountOff,
            maxRedemptions,
            redeemBy,
        });
        await newCoupon.save();
        res.status(201).json(newCoupon);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

export const updateCoupon = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const { percentOff, amountOff, maxRedemptions, redeemBy } = req.body;

        const coupon = await Coupon.findOneAndUpdate(
            { code: code },
            { percentOff, amountOff, maxRedemptions, redeemBy },
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const coupon = await Coupon.findByIdAndUpdate(code);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        coupon.isDeleted = true;
        await coupon.save();
        res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

export default { applyCoupon, getCouponByCode, getAllCoupons, createCoupon, updateCoupon, deleteCoupon };