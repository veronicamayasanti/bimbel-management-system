import express from "express";
import TeacherController from "../controllers/teacherController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     tags: [Teachers]
 *     summary: Ambil semua guru (Admin only)
 *     responses:
 *       200:
 *         description: Daftar semua guru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       fullName: { type: string }
 *                       email: { type: string }
 *                       telpNo: { type: string }
 *                       avatar: { type: string }
 *                       isActive: { type: boolean }
 *       403:
 *         description: Akses ditolak
 *   post:
 *     tags: [Teachers]
 *     summary: Tambah guru baru (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password]
 *             properties:
 *               fullName: { type: string, example: 'Siti Rahayu' }
 *               email: { type: string, example: 'siti@bimbel.com' }
 *               password: { type: string, example: 'password123' }
 *               telpNo: { type: string, example: '08111222333' }
 *               isActive: { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Guru berhasil ditambahkan
 *       409:
 *         description: Email sudah digunakan
 */
router.get("/", authenticate, authorizeAdmin, TeacherController.getAllTeachers);
router.post("/", authenticate, authorizeAdmin, TeacherController.createTeacher);

/**
 * @swagger
 * /api/teachers/{id}:
 *   get:
 *     tags: [Teachers]
 *     summary: Ambil detail guru berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Detail guru
 *       404:
 *         description: Guru tidak ditemukan
 *   put:
 *     tags: [Teachers]
 *     summary: Update profil guru (diri sendiri)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: { type: string }
 *               telpNo: { type: string }
 *     responses:
 *       200:
 *         description: Data guru berhasil diperbarui
 *   patch:
 *     tags: [Teachers]
 *     summary: Update data guru oleh Admin (termasuk status aktif)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: { type: string }
 *               telpNo: { type: string }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Data guru berhasil diperbarui oleh admin
 *   delete:
 *     tags: [Teachers]
 *     summary: Hapus data guru (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Guru berhasil dihapus
 */
router.get("/:id", authenticate, TeacherController.getTeacherById);
router.put("/:id", authenticate, TeacherController.updateTeacherSelf);
router.patch("/:id", authenticate, authorizeAdmin, TeacherController.updateTeacher);
router.delete("/:id", authenticate, authorizeAdmin, TeacherController.deleteTeacher);

export default router;
