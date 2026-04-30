import { Router } from "express";
import AuthController from "../controllers/authController.js";

const routerAuth = Router();

routerAuth.post("/login", AuthController.login);
routerAuth.post("/login/admin", AuthController.loginAdmin);

routerAuth.post("/forgot-password", AuthController.forgotPassword);
routerAuth.post("/reset-password/:token", AuthController.resetPassword);
export default routerAuth;
