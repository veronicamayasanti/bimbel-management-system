/*
 * Copyright (c) 2026.
 * Project: Bimbel Manajemen Sistem
 * Author: Veronica Maya Santi
 */

import { Router } from "express";
import UserController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateCreateUser, validateUpdateUser, handleValidationErrors } from '../middleware/validationMiddleware.js';
import { uploadAvatarMiddleware } from '../middleware/uploadMiddleware.js';

const routerUser = Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Daftarkan akun user baru (Orang Tua)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Akun berhasil dibuat
 *       400:
 *         description: Validasi gagal
 *   get:
 *     tags: [Users]
 *     summary: Ambil semua user (Admin only)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Cari berdasarkan nama atau email
 *     responses:
 *       200:
 *         description: Daftar semua user dengan pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
routerUser.post("/", validateCreateUser, handleValidationErrors, UserController.createUser);
routerUser.get("/", authMiddleware, UserController.getAllUsers);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Ambil profil pengguna yang sedang login
 *     responses:
 *       200:
 *         description: Data profil pengguna
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         description: Profil tidak ditemukan
 */
routerUser.get("/me", authMiddleware, UserController.getMe);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     tags: [Users]
 *     summary: Ganti password pengguna yang sedang login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [old_password, new_password]
 *             properties:
 *               old_password:
 *                 type: string
 *                 example: passwordlama123
 *               new_password:
 *                 type: string
 *                 minLength: 6
 *                 example: passwordbaru456
 *     responses:
 *       200:
 *         description: Password berhasil diubah
 *       400:
 *         description: Password lama salah
 */
routerUser.put("/change-password", authMiddleware, UserController.changePassword);

/**
 * @swagger
 * /api/users/me/avatar:
 *   post:
 *     tags: [Users]
 *     summary: Upload foto profil pengguna yang sedang login
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [avatar]
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: File gambar (JPG, PNG, WEBP) max 2MB
 *     responses:
 *       200:
 *         description: Foto profil berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 avatar_url: { type: string, example: 'http://localhost:3000/uploads/1-abc.jpg' }
 *       400:
 *         description: File tidak dikirim atau format tidak didukung
 */
routerUser.post("/me/avatar", authMiddleware, uploadAvatarMiddleware.single('avatar'), UserController.uploadAvatar);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Ambil data user berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: UUID user
 *     responses:
 *       200:
 *         description: Data user
 *       404:
 *         description: User tidak ditemukan
 *   put:
 *     tags: [Users]
 *     summary: Update data user (diri sendiri atau admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name: { type: string, example: 'Budi Santoso' }
 *               email: { type: string, example: 'budi@example.com' }
 *               telp_no: { type: string, example: '08123456789' }
 *               address: { type: string }
 *     responses:
 *       200:
 *         description: Data berhasil diperbarui
 *       403:
 *         description: Akses ditolak
 *   delete:
 *     tags: [Users]
 *     summary: Hapus akun user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Pengguna berhasil dihapus
 *       403:
 *         description: Akses ditolak
 */
routerUser.get("/:id", authMiddleware, UserController.getUserById);
routerUser.put("/:id", authMiddleware, validateUpdateUser, handleValidationErrors, UserController.updateUser);
routerUser.delete("/:id", authMiddleware, UserController.deleteUser);

export default routerUser;
