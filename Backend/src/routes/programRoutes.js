import { Router } from "express";
import ProgramController from "../controllers/programController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateProgram, handleValidationErrors } from '../middleware/validationMiddleware.js';

const routerProgram = Router();

// ==========================================
// RUTE PUBLIK (Bisa diakses tanpa login)
// ==========================================
routerProgram.get("/", ProgramController.getAllPrograms);
routerProgram.get("/:id", ProgramController.getProgramById);

// ==========================================
// RUTE PRIVAT (Wajib login & harus role admin)
// ==========================================
routerProgram.post("/", authMiddleware, validateProgram, handleValidationErrors, ProgramController.createProgram);
routerProgram.put("/:id", authMiddleware, validateProgram, handleValidationErrors, ProgramController.updateProgram);
routerProgram.delete("/:id", authMiddleware, ProgramController.deleteProgram);

export default routerProgram;
