import { Router } from "express";
import { register, login, refreshToken, logout, forgotPassword, resetPassword, me } from "../controllers/authController.js";
import { authenticateToken, allowRoles } from "../middlewares/authentication.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authenticateToken, allowRoles("CUSTOMER", "ADMIN"), me);
export default router;