import { Router } from "express";
import {
  getAllDiscounts,
  getDiscountIsActive,
  createDiscount,
  deleteDiscount,
  updateDiscount,
} from "../controllers/discountController.js";
import { authenticateToken, allowRoles } from "../middlewares/authentication.js"

const router = Router();

router.get("/", authenticateToken, getAllDiscounts);
router.get("/:id", authenticateToken, getDiscountIsActive);
router.post("/", authenticateToken, allowRoles("admin"), createDiscount);
router.delete("/:id", authenticateToken, allowRoles("admin"), deleteDiscount);
router.put("/:id", authenticateToken, allowRoles("admin"), updateDiscount);

export default router;
