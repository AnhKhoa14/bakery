import Review from "../models/Review.js";
import type { Request, Response } from "express";
import { AuthRequest } from "../types/auth.js";

export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const newReview = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment,
    });
    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Failed to add review", error });
  }
};

export const getListReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "fullName"
    );
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews", error });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await Review.findById(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    deletedReview.isDeleted = true;
    await deletedReview.save();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Failed to delete review", error });
  }
};

export const likeReview = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review liked successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to like review", error });
  }
};

export const unlikeReview = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review unliked successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to unlike review", error });
  }
};

export default {
  addReview,
  getListReviews,
  deleteReview,
  likeReview,
  unlikeReview,
};
