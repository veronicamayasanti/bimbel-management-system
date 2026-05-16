import express from "express";
import TransactionController from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadAvatarMiddleware as upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: Ambil semua transaksi (Admin lihat semua, User lihat miliknya)
 *     parameters:
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [PENDING, VERIFIED, REJECTED]
 *         description: Filter berdasarkan status pembayaran
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *           enum: [TRANSFER, CASH]
 *         description: Filter berdasarkan metode pembayaran
 *     responses:
 *       200:
 *         description: Daftar transaksi
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
 *                         $ref: '#/components/schemas/Transaction'
 *   post:
 *     tags: [Transactions]
 *     summary: Buat transaksi baru (beli paket)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [studentId, programPackageId, amount, paymentMethod]
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 1
 *               programPackageId:
 *                 type: integer
 *                 example: 3
 *               amount:
 *                 type: number
 *                 example: 1500000
 *               paymentMethod:
 *                 type: string
 *                 enum: [TRANSFER, CASH]
 *               notes:
 *                 type: string
 *               paymentProof:
 *                 type: string
 *                 format: binary
 *                 description: Wajib diisi jika paymentMethod = TRANSFER
 *     responses:
 *       201:
 *         description: Transaksi berhasil dibuat
 *       400:
 *         description: Bukti transfer wajib diunggah (jika metode TRANSFER)
 */
router.get("/", authMiddleware, TransactionController.getAllTransactions);
router.post("/", authMiddleware, upload.single('paymentProof'), TransactionController.createTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     tags: [Transactions]
 *     summary: Ambil detail transaksi berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detail transaksi
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.get("/:id", authMiddleware, TransactionController.getTransactionById);

/**
 * @swagger
 * /api/transactions/{id}/verify:
 *   put:
 *     tags: [Transactions]
 *     summary: Verifikasi transaksi (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaksi berhasil diverifikasi dan paket aktif
 *       403:
 *         description: Akses ditolak
 */
router.put("/:id/verify", authMiddleware, TransactionController.verifyTransaction);

/**
 * @swagger
 * /api/transactions/{id}/reject:
 *   put:
 *     tags: [Transactions]
 *     summary: Tolak transaksi (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 example: Bukti transfer tidak valid
 *     responses:
 *       200:
 *         description: Transaksi berhasil ditolak
 */
router.put("/:id/reject", authMiddleware, TransactionController.rejectTransaction);

export default router;
