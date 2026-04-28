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
import { validateCreateUser, handleValidationErrors } from '../middleware/validationMiddleware.js';


const routerUser = Router();

routerUser.post("/",
    validateCreateUser,
    handleValidationErrors,
    UserController.createUser
);
routerUser.get("/", authMiddleware, UserController.getAllUsers);
routerUser.get("/:id", authMiddleware, UserController.getUserById);
routerUser.put("/:id", authMiddleware, UserController.updateUser);
routerUser.delete("/:id", authMiddleware, UserController.deleteUser);

export default routerUser;
