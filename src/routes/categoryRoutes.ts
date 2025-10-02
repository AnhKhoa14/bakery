import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  popularCategories,
} from "../controllers/categoryController.js";
import {
  authenticateToken,
  allowRoles,
} from "../middlewares/authentication.js";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", authenticateToken, allowRoles("admin"), createCategory);
router.put("/:id", authenticateToken, allowRoles("admin"), updateCategory);
router.delete("/:id", authenticateToken, allowRoles("admin"), deleteCategory);
router.get("/popular", popularCategories);

export default router;
