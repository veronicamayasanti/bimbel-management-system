import { Router } from "express";
import BranchController from "../controllers/branchController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateBranch, handleValidationErrors } from '../middleware/validationMiddleware.js';

const routerBranch = Router();

/**
 * @swagger
 * /api/branches:
 *   get:
 *     tags: [Branches]
 *     summary: Ambil semua cabang
 *     security: []
 *     responses:
 *       200:
 *         description: Daftar semua cabang
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
 *                         $ref: '#/components/schemas/Branch'
 *   post:
 *     tags: [Branches]
 *     summary: Tambah cabang baru (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BranchRequest'
 *     responses:
 *       201:
 *         description: Cabang berhasil dibuat
 *       400:
 *         description: Validasi gagal
 *       403:
 *         description: Akses ditolak
 */
routerBranch.get("/", BranchController.getAllBranches);
routerBranch.post("/", authMiddleware, validateBranch, handleValidationErrors, BranchController.createBranch);

/**
 * @swagger
 * /api/branches/{id}:
 *   get:
 *     tags: [Branches]
 *     summary: Ambil detail cabang berdasarkan ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Detail cabang
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       404:
 *         description: Cabang tidak ditemukan
 *   put:
 *     tags: [Branches]
 *     summary: Update data cabang (Admin only)
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
 *             $ref: '#/components/schemas/BranchRequest'
 *     responses:
 *       200:
 *         description: Cabang berhasil diupdate
 *   delete:
 *     tags: [Branches]
 *     summary: Hapus cabang (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cabang berhasil dihapus
 */
routerBranch.get("/:id", BranchController.getBranchById);
routerBranch.put("/:id", authMiddleware, validateBranch, handleValidationErrors, BranchController.updateBranch);
routerBranch.delete("/:id", authMiddleware, BranchController.deleteBranch);

export default routerBranch;
