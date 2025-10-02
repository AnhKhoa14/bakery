import type { Request, Response } from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import OrderDetail from "../models/OrderDetail.js";
export async function getProducts(req: Request, res: Response) {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      sort,
    } = req.query as any;

    //filter
    const filter: any = { isDeleted: false };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice && maxPrice !== "Infinity")
        filter.price.$lte = Number(maxPrice);
    }

    //sort
    let sortOption: any = { createdAt: -1 }; // Default sort by newest
    if (sort) {
      sortOption = { price: sort === "asc" ? 1 : -1 };
    }

    //query
    const products = await Product.find(filter)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort(sortOption);
    const total = await Product.countDocuments(filter);

    res.json({
      data: products,
      total,
      page: +page,
      totalPages: Math.ceil(total / +limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, price, stock, imageUrl, category } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      inStock: stock,
      imageUrl,
      category,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const deletedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(deletedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
}

export async function getCategories(req: Request, res: Response) {
  try {
    // const categories = await Product.distinct("categories");
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching categories" });
  }
}

export async function searchProducts(req: Request, res: Response) {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ message: "Query parameter is required" });
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const products = await Product.find({
      name: { $regex: q, $options: "i" },
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error searching products" });
  }
}

export async function viewReviewProducts(req: Request, res: Response) {
  try {
    const products = await Product.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching review products" });
  }
}

export async function bestSellerProducts(req: Request, res: Response) {
  try {
    const limit = Number(req.query.limit) || 10;
    const bestSeller = await OrderDetail.aggregate([
      {
        $group: {
          _id: "$product",
          totalSold: { $sum: "$quantity" },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: 0,
          productId: "$product._id",
          name: "$product.name",
          price: "$product.price",
          totalSold: 1,
        },
      },
    ]).limit(10);
    res.status(200).json(bestSeller);
  } catch (error) {
    res.status(500).json({ message: "Error fetching best seller products" });
  }
}

export async function newArrivalProducts(req: Request, res: Response) {
  try {
    const limit = Number(req.query.limit) || 10;
    const newArrivals = await Product.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.status(200).json(newArrivals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching new arrival products" });
  }
}


export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  searchProducts,
  viewReviewProducts,
  bestSellerProducts,
  newArrivalProducts,
};
