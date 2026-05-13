import { Router } from "express";
import LevelController from "../controllers/levelController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateLevel, handleValidationErrors } from '../middleware/validationMiddleware.js';

const routerLevel = Router();

// ==========================================
// RUTE PUBLIK (Bisa diakses tanpa login)
// ==========================================
routerLevel.get("/", LevelController.getAllLevels);
routerLevel.get("/:id", LevelController.getLevelById);

// ==========================================
// RUTE PRIVAT (Wajib login & harus role admin)
// ==========================================
routerLevel.post("/", authMiddleware, validateLevel, handleValidationErrors, LevelController.createLevel);
routerLevel.put("/:id", authMiddleware, validateLevel, handleValidationErrors, LevelController.updateLevel);
routerLevel.delete("/:id", authMiddleware, LevelController.deleteLevel);

export default routerLevel;
