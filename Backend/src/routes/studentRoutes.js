import { Router } from "express";
import StudentController from "../controllers/studentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateStudent, handleValidationErrors } from '../middleware/validationMiddleware.js';

const routerStudent = Router();

// ==========================================
// RUTE PRIVAT (Wajib login)
// ==========================================

// Get all students (Admin) or Get parent's students (User)
routerStudent.get("/", authMiddleware, StudentController.getStudents);

// Get student by ID
routerStudent.get("/:id", authMiddleware, StudentController.getStudentById);

// Create student (Only User/Parent)
routerStudent.post("/", authMiddleware, validateStudent, handleValidationErrors, StudentController.createStudent);

// Update student (Only User/Parent who owns the student)
routerStudent.put("/:id", authMiddleware, validateStudent, handleValidationErrors, StudentController.updateStudent);

// Delete student (Only User/Parent who owns the student)
routerStudent.delete("/:id", authMiddleware, StudentController.deleteStudent);

export default routerStudent;
