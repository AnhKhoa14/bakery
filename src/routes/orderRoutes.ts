import { Router } from "express";
import {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  trackOrder,
  getOrderStatistics,
} from "../controllers/orderController.js";
import { authenticateToken, allowRoles } from "../middlewares/authentication.js";

const router = Router();
router.get("/statistics", authenticateToken, allowRoles("admin"), getOrderStatistics);


router.post("/", authenticateToken, allowRoles("customer"), createOrder);
router.get("/user/:userId", authenticateToken, allowRoles("customer"), getOrdersByUser);
router.get("/", authenticateToken, allowRoles("admin"), getAllOrders);
router.get("/:orderId", authenticateToken, allowRoles("customer", "admin"), getOrderById);
router.put("/:orderId/status", authenticateToken, allowRoles("admin"), updateOrderStatus);
router.delete("/:orderId", authenticateToken, allowRoles("admin"), cancelOrder);
router.get("/track/:orderId", authenticateToken, allowRoles("customer", "admin"), trackOrder);

export default router;
