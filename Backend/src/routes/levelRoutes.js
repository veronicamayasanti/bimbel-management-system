import { Router } from "express";
import LevelController from "../controllers/levelController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateLevel, handleValidationErrors } from '../middleware/validationMiddleware.js';

const routerLevel = Router();

/**
 * @swagger
 * /api/levels:
 *   get:
 *     tags: [Levels]
 *     summary: Ambil semua level/tingkat kelas
 *     security: []
 *     responses:
 *       200:
 *         description: Daftar semua level
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
 *                         $ref: '#/components/schemas/Level'
 *   post:
 *     tags: [Levels]
 *     summary: Tambah level baru (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: 'SMA Kelas 12' }
 *     responses:
 *       201:
 *         description: Level berhasil dibuat
 *       400:
 *         description: Validasi gagal
 */
routerLevel.get("/", LevelController.getAllLevels);
routerLevel.post("/", authMiddleware, validateLevel, handleValidationErrors, LevelController.createLevel);

/**
 * @swagger
 * /api/levels/{id}:
 *   get:
 *     tags: [Levels]
 *     summary: Ambil detail level berdasarkan ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Detail level
 *       404:
 *         description: Level tidak ditemukan
 *   put:
 *     tags: [Levels]
 *     summary: Update level (Admin only)
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
 *               name: { type: string, example: 'SMP Kelas 9' }
 *     responses:
 *       200:
 *         description: Level berhasil diperbarui
 *   delete:
 *     tags: [Levels]
 *     summary: Hapus level (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Level berhasil dihapus
 */
routerLevel.get("/:id", LevelController.getLevelById);
routerLevel.put("/:id", authMiddleware, validateLevel, handleValidationErrors, LevelController.updateLevel);
routerLevel.delete("/:id", authMiddleware, LevelController.deleteLevel);

export default routerLevel;
