import express from "express";
import ProgramPackageController from "../controllers/programPackageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/program-packages:
 *   get:
 *     tags: [Programs]
 *     summary: Ambil semua paket program
 *     responses:
 *       200:
 *         description: Daftar semua paket program
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
 *                       programId: { type: integer }
 *                       name: { type: string, example: 'Paket 10 Sesi' }
 *                       totalMeetings: { type: integer, example: 10 }
 *                       price: { type: number, example: 1500000 }
 *                       isActive: { type: boolean }
 *   post:
 *     tags: [Programs]
 *     summary: Tambah paket baru untuk suatu program (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [programId, name, totalMeetings, price]
 *             properties:
 *               programId: { type: integer, example: 1 }
 *               name: { type: string, example: 'Paket 10 Sesi' }
 *               totalMeetings: { type: integer, example: 10 }
 *               price: { type: number, example: 1500000 }
 *               isActive: { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Paket berhasil dibuat
 */
router.get("/", authMiddleware, ProgramPackageController.getAllPackages);
router.post("/", authMiddleware, ProgramPackageController.createPackage);

/**
 * @swagger
 * /api/program-packages/{id}:
 *   get:
 *     tags: [Programs]
 *     summary: Ambil detail paket berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Detail paket
 *       404:
 *         description: Paket tidak ditemukan
 *   put:
 *     tags: [Programs]
 *     summary: Update paket (Admin only)
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
 *               name: { type: string }
 *               totalMeetings: { type: integer }
 *               price: { type: number }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Paket berhasil diperbarui
 *   delete:
 *     tags: [Programs]
 *     summary: Hapus paket (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paket berhasil dihapus
 */
router.get("/:id", authMiddleware, ProgramPackageController.getPackageById);
router.put("/:id", authMiddleware, ProgramPackageController.updatePackage);
router.delete("/:id", authMiddleware, ProgramPackageController.deletePackage);

export default router;
