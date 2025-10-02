import Category from "../models/Category.js";
import type { Request, Response } from "express";

export async function getCategories(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const total = await Category.countDocuments(); // tổng số record
    const categories = await Category.find().limit(limit).skip(offset);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCategoryById(req: Request, res: Response) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { $inc: { productCount: 1 }, new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const deletedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(deletedCategory);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function popularCategories(req: Request, res: Response) {
  try {
    const categories = await Category.find()
      .sort({ productCount: -1 })
      .limit(5);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  popularCategories,
};
