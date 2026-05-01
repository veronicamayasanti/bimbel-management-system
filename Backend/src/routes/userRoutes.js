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
import { validateCreateUser, validateUpdateUser, handleValidationErrors } from '../middleware/validationMiddleware.js';
import { uploadAvatarMiddleware } from '../middleware/uploadMiddleware.js';

const routerUser = Router();

routerUser.post("/", validateCreateUser, handleValidationErrors, UserController.createUser);
routerUser.get("/", authMiddleware, UserController.getAllUsers);

routerUser.get("/me", authMiddleware, UserController.getMe);
routerUser.put("/change-password", authMiddleware, UserController.changePassword);
routerUser.post("/me/avatar", authMiddleware, uploadAvatarMiddleware.single('avatar'), UserController.uploadAvatar);

routerUser.get("/:id", authMiddleware, UserController.getUserById);
routerUser.put("/:id",
    authMiddleware,
    validateUpdateUser,
    handleValidationErrors,
    UserController.updateUser);
routerUser.delete("/:id", authMiddleware, UserController.deleteUser);

export default routerUser;

