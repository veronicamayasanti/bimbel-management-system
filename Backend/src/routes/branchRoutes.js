import { Router } from "express";
import BranchController from "../controllers/branchController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateBranch, handleValidationErrors } from '../middleware/validationMiddleware.js'; // <-- IMPORT VALIDASI DI SINI

const routerBranch = Router();

// ==========================================
// RUTE PUBLIK (Bisa diakses tanpa login)
// ==========================================
routerBranch.get("/", BranchController.getAllBranches);
routerBranch.get("/:id", BranchController.getBranchById);

// ==========================================
// RUTE PRIVAT (Wajib login & harus role admin)
// ==========================================
routerBranch.post("/", authMiddleware, validateBranch, handleValidationErrors, BranchController.createBranch);
routerBranch.put("/:id", authMiddleware, validateBranch, handleValidationErrors, BranchController.updateBranch);
routerBranch.delete("/:id", authMiddleware, BranchController.deleteBranch);

export default routerBranch;
