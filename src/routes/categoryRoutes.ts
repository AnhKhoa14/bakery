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

router.get("/popular", popularCategories);

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", authenticateToken, allowRoles("admin"), createCategory);
router.put("/:id", authenticateToken, allowRoles("ADMIN"), updateCategory);
router.delete("/:id", authenticateToken, allowRoles("ADMIN"), deleteCategory);

export default router;
