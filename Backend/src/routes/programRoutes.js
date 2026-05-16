import { Router } from "express";
import ProgramController from "../controllers/programController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateProgram, handleValidationErrors } from '../middleware/validationMiddleware.js';

const routerProgram = Router();

/**
 * @swagger
 * /api/programs:
 *   get:
 *     tags: [Programs]
 *     summary: Ambil semua program belajar
 *     security: []
 *     responses:
 *       200:
 *         description: Daftar semua program
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Program'
 *   post:
 *     tags: [Programs]
 *     summary: Tambah program baru (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description]
 *             properties:
 *               name: { type: string, example: 'Matematika Intensif' }
 *               description: { type: string, example: 'Program persiapan ujian nasional' }
 *     responses:
 *       201:
 *         description: Program berhasil dibuat
 *       400:
 *         description: Validasi gagal
 */
routerProgram.get("/", ProgramController.getAllPrograms);
routerProgram.post("/", authMiddleware, validateProgram, handleValidationErrors, ProgramController.createProgram);

/**
 * @swagger
 * /api/programs/{id}:
 *   get:
 *     tags: [Programs]
 *     summary: Ambil detail program beserta paket-paketnya
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Detail program
 *       404:
 *         description: Program tidak ditemukan
 *   put:
 *     tags: [Programs]
 *     summary: Update program (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Program berhasil diperbarui
 *   delete:
 *     tags: [Programs]
 *     summary: Hapus program (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Program berhasil dihapus
 */
routerProgram.get("/:id", ProgramController.getProgramById);
routerProgram.put("/:id", authMiddleware, validateProgram, handleValidationErrors, ProgramController.updateProgram);
routerProgram.delete("/:id", authMiddleware, ProgramController.deleteProgram);

export default routerProgram;
