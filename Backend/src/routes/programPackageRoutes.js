import express from "express";
import ProgramPackageController from "../controllers/programPackageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, ProgramPackageController.getAllPackages);
router.get("/:id", authMiddleware, ProgramPackageController.getPackageById);
router.post("/", authMiddleware, ProgramPackageController.createPackage);
router.put("/:id", authMiddleware, ProgramPackageController.updatePackage);
router.delete("/:id", authMiddleware, ProgramPackageController.deletePackage);

export default router;
