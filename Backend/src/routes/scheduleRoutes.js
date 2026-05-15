import express from "express";
import ScheduleController from "../controllers/scheduleController.js";
import AttendanceController from "../controllers/attendanceController.js";
import { authenticate, authorizeAdmin, authorizeTeacher } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Schedule Routes ---
router.get("/recurring", authenticate, authorizeAdmin, ScheduleController.getAllRecurring);
router.post("/recurring", authenticate, authorizeAdmin, ScheduleController.createRecurring);
router.put("/recurring/:id", authenticate, authorizeAdmin, ScheduleController.updateRecurring);
router.delete("/recurring/:id", authenticate, authorizeAdmin, ScheduleController.deleteRecurring);
router.post("/generate", authenticate, authorizeAdmin, ScheduleController.generateSessions);
router.get("/daily", authenticate, authorizeTeacher, ScheduleController.getDailyLessons);
router.get("/students-by-program/:programId", authenticate, authorizeAdmin, ScheduleController.getStudentsByProgram);

// --- Attendance Routes ---
router.get("/attendance/:lessonId", authenticate, authorizeTeacher, AttendanceController.getLessonAttendance);
router.patch("/attendance/:attendanceId", authenticate, authorizeTeacher, AttendanceController.markAttendance);

export default router;
