import express from "express";
import TeacherController from "../controllers/teacherController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only routes
router.get("/", authenticate, authorizeAdmin, TeacherController.getAllTeachers);
router.post("/", authenticate, authorizeAdmin, TeacherController.createTeacher);
router.get("/:id", authenticate, TeacherController.getTeacherById);
router.put("/:id", authenticate, TeacherController.updateTeacherSelf); // Guru bisa update diri sendiri
router.patch("/:id", authenticate, authorizeAdmin, TeacherController.updateTeacher); // Admin bisa update semua
router.delete("/:id", authenticate, authorizeAdmin, TeacherController.deleteTeacher);

export default router;
