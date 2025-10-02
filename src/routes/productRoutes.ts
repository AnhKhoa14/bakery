import { Router } from "express";
import {
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
} from "../controllers/productController.js";
import { authenticateToken, allowRoles } from "../middlewares/authentication.js";
const router = Router();

router.get("/categories", getCategories);
router.get("/search", searchProducts);
router.get("/reviews", viewReviewProducts);
router.get("/best-sellers", bestSellerProducts);
router.get("/new-arrivals", newArrivalProducts);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authenticateToken, allowRoles("ADMIN"), createProduct);
router.put("/:id", authenticateToken, allowRoles("ADMIN"), updateProduct);
router.delete("/:id", authenticateToken, allowRoles("ADMIN"), deleteProduct);


export default router;