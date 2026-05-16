import express from "express";
import ScheduleController from "../controllers/scheduleController.js";
import AttendanceController from "../controllers/attendanceController.js";
import { authenticate, authorizeAdmin, authorizeTeacher } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/schedules/recurring:
 *   get:
 *     tags: [Schedules]
 *     summary: Ambil semua jadwal berulang (Admin only)
 *     responses:
 *       200:
 *         description: Daftar jadwal berulang beserta guru, program, dan siswa terdaftar
 *   post:
 *     tags: [Schedules]
 *     summary: Buat jadwal berulang baru (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [teacherId, programId, dayOfWeek, startTime, endTime]
 *             properties:
 *               teacherId: { type: integer, example: 1 }
 *               programId: { type: integer, example: 2 }
 *               branchId: { type: integer, example: 1 }
 *               dayOfWeek:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 example: 1
 *                 description: "0=Minggu, 1=Senin, ..., 6=Sabtu"
 *               startTime: { type: string, example: '08:00' }
 *               endTime: { type: string, example: '10:00' }
 *               levelIds:
 *                 type: array
 *                 items: { type: integer }
 *                 example: [1, 2]
 *               studentIds:
 *                 type: array
 *                 items: { type: integer }
 *                 example: [5, 6, 7]
 *     responses:
 *       201:
 *         description: Jadwal berulang berhasil dibuat
 */
router.get("/recurring", authenticate, authorizeAdmin, ScheduleController.getAllRecurring);
router.post("/recurring", authenticate, authorizeAdmin, ScheduleController.createRecurring);

/**
 * @swagger
 * /api/schedules/recurring/{id}:
 *   put:
 *     tags: [Schedules]
 *     summary: Update jadwal berulang (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Jadwal berulang berhasil diperbarui
 *   delete:
 *     tags: [Schedules]
 *     summary: Hapus jadwal berulang (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Jadwal berulang berhasil dihapus
 */
router.put("/recurring/:id", authenticate, authorizeAdmin, ScheduleController.updateRecurring);
router.delete("/recurring/:id", authenticate, authorizeAdmin, ScheduleController.deleteRecurring);

/**
 * @swagger
 * /api/schedules/generate:
 *   post:
 *     tags: [Schedules]
 *     summary: Generate sesi pelajaran dari jadwal berulang (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recurringScheduleId, startDate, endDate]
 *             properties:
 *               recurringScheduleId: { type: integer, example: 1 }
 *               startDate: { type: string, format: date, example: '2026-06-01' }
 *               endDate: { type: string, format: date, example: '2026-06-30' }
 *     responses:
 *       201:
 *         description: Sesi berhasil di-generate
 */
router.post("/generate", authenticate, authorizeAdmin, ScheduleController.generateSessions);

/**
 * @swagger
 * /api/schedules/daily:
 *   get:
 *     tags: [Schedules]
 *     summary: Ambil jadwal mengajar hari ini (Admin & Guru)
 *     parameters:
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *         description: Tanggal (default hari ini, format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Daftar sesi hari ini beserta data absensi siswa
 */
router.get("/daily", authenticate, authorizeTeacher, ScheduleController.getDailyLessons);

/**
 * @swagger
 * /api/schedules/students-by-program/{programId}:
 *   get:
 *     tags: [Schedules]
 *     summary: Ambil daftar siswa berdasarkan program (Admin only)
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Daftar siswa yang memiliki paket aktif di program ini
 */
router.get("/students-by-program/:programId", authenticate, authorizeAdmin, ScheduleController.getStudentsByProgram);

/**
 * @swagger
 * /api/schedules/attendance/{lessonId}:
 *   get:
 *     tags: [Attendance]
 *     summary: Ambil data absensi untuk satu sesi pelajaran (Admin & Guru)
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: integer }
 *         description: ID LessonSchedule
 *     responses:
 *       200:
 *         description: Daftar absensi siswa untuk sesi tersebut
 */
router.get("/attendance/:lessonId", authenticate, authorizeTeacher, AttendanceController.getLessonAttendance);

/**
 * @swagger
 * /api/schedules/attendance/{attendanceId}:
 *   patch:
 *     tags: [Attendance]
 *     summary: Isi / update status absensi siswa (Admin & Guru)
 *     parameters:
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema: { type: integer }
 *         description: ID Attendance record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PRESENT, ABSENT, PERMIT]
 *                 example: PRESENT
 *               notes:
 *                 type: string
 *                 example: Hadir tepat waktu
 *     responses:
 *       200:
 *         description: Absensi berhasil diupdate dan kuota paket disesuaikan
 *       400:
 *         description: Kuota paket sudah habis
 *       404:
 *         description: Data absensi tidak ditemukan
 */
router.patch("/attendance/:attendanceId", authenticate, authorizeTeacher, AttendanceController.markAttendance);

export default router;
