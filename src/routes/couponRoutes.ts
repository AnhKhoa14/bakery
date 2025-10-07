import { Router } from "express";
import {
  applyCoupon,
  getCouponByCode,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";
import { authenticateToken, allowRoles } from "../middlewares/authentication";

const router = Router();

router.post("/apply", authenticateToken, allowRoles("customer"), applyCoupon);
router.get("/:code", authenticateToken, allowRoles("customer"), getCouponByCode);
router.get("/", authenticateToken, allowRoles("customer"), getAllCoupons);
router.post("/", authenticateToken, allowRoles("admin"), createCoupon);
router.put("/:code", authenticateToken, allowRoles("admin"), updateCoupon);
router.delete("/:code", authenticateToken, allowRoles("admin"), deleteCoupon);

export default router;
