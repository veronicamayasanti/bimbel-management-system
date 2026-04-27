import { Router } from "express";
import AuthController from "../controllers/authController.js";

const routerAuth = Router();

routerAuth.post("/login", AuthController.login);
routerAuth.post("/login/admin", AuthController.loginAdmin);
export default routerAuth;
