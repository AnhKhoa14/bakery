import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  searchProducts,
  viewReviewProducts
} from "../controllers/productController.js";
const router = Router();

router.get("/categories", getCategories);
router.get("/search", searchProducts);
router.get("/reviews", viewReviewProducts);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);


export default router;