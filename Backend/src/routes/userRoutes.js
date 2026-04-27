/*
 * Copyright (c) 2026.
 * Project: Bimbel Manajemen Sistem
 * Author: Veronica Maya Santi
 * Github: https://github.com/veronicamayasanti
 * Email: veronicamayasanti@gmail.com
 */

import { Router } from "express";
import UserController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const routerUser = Router();

routerUser.get("/", authMiddleware, UserController.getAllUsers);
routerUser.get("/:id", authMiddleware, UserController.getUserById);
routerUser.post("/", UserController.createUser);
routerUser.put("/:id", authMiddleware, UserController.updateUser);
routerUser.delete("/:id", authMiddleware, UserController.deleteUser);

export default routerUser;
