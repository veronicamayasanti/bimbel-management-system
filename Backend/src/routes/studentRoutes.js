import { Router } from "express";
import StudentController from "../controllers/studentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateStudent, handleValidationErrors } from '../middleware/validationMiddleware.js';

const routerStudent = Router();

/**
 * @swagger
 * /api/students:
 *   get:
 *     tags: [Students]
 *     summary: Ambil semua siswa (Admin) atau siswa milik orang tua (User)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Cari berdasarkan nama siswa
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan ID cabang (Admin only)
 *       - in: query
 *         name: levelId
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan ID level (Admin only)
 *     responses:
 *       200:
 *         description: Daftar siswa dengan pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *   post:
 *     tags: [Students]
 *     summary: Tambah siswa baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentRequest'
 *     responses:
 *       201:
 *         description: Siswa berhasil ditambahkan
 *       400:
 *         description: Validasi gagal
 */
routerStudent.get("/", authMiddleware, StudentController.getStudents);
routerStudent.post("/", authMiddleware, validateStudent, handleValidationErrors, StudentController.createStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     tags: [Students]
 *     summary: Ambil detail siswa berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Detail siswa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Siswa tidak ditemukan
 *   put:
 *     tags: [Students]
 *     summary: Update data siswa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentRequest'
 *     responses:
 *       200:
 *         description: Siswa berhasil diupdate
 *   delete:
 *     tags: [Students]
 *     summary: Hapus data siswa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Siswa berhasil dihapus
 */
routerStudent.get("/:id", authMiddleware, StudentController.getStudentById);
routerStudent.put("/:id", authMiddleware, validateStudent, handleValidationErrors, StudentController.updateStudent);
routerStudent.delete("/:id", authMiddleware, StudentController.deleteStudent);

export default routerStudent;
