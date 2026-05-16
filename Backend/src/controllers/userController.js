/*
 * Copyright (c) 2026.
 * Project: Bimbel Manajemen Sistem
 * Author: Veronica Maya Santi
 * Github: https://github.com/veronicamayasanti
 * Email: veronicamayasanti@gmail.com
 */

import UserService from "../services/userService.js";
import AdminModel from '../models/adminModel.js';
import TeacherModel from '../models/teacherModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: Hapus file avatar lama jika bukan default
const deleteOldAvatar = (filename) => {
    if (!filename || filename === 'avatar_default.png') return;
    const filePath = path.join(__dirname, '../../public/uploads', filename);
    fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error(`[Avatar] Gagal menghapus file lama: ${filePath}`, err.message);
        } else if (!err) {
            console.log(`[Avatar] File lama berhasil dihapus: ${filename}`);
        }
    });
};


class UserController {
    static async getAllUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";

            const result = await UserService.getAllUsers(page, limit, search);

            res.json({
                success: true,
                message: "Berhasil mengambil data users",
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUserById(req, res, next) {
        const { id } = req.params;
        try {
            const user = await UserService.getUserById(id);
            if (user) {
                res.json({ success: true, message: "Berhasil mengambil data user", data: user });
            } else {
                res.status(404).json({ success: false, message: "User tidak ditemukan" });
            }
        } catch (error) {
            next(error);
        }
    }

    static async createUser(req, res, next) {
        try {
            const { full_name, email, password, telp_no, address, isActive } = req.body;

            const newUser = await UserService.createUser({
                full_name,
                email,
                password,
                telp_no,
                address,
                isActive
            });
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    // Fitur Get My Profile
    static async getMe(req, res, next) {
        try {
            const userId = req.user.id;
            const role = req.user.role; // Cek role dari token

            let user;

            // Jika yang login Admin, cari di AdminModel
            if (role === 'admin') {
                user = await AdminModel.findById(userId);
                if (user) {
                    user.role = 'admin';
                    user.full_name = user.full_name; // mapping consistent name
                }
            } else if (role === 'teacher') {
                user = await TeacherModel.findById(userId);
                if (user) {
                    user.role = 'teacher';
                    user.full_name = user.fullName; // Map fullName to full_name for frontend consistency
                }
            } else {
                // Jika User biasa, cari di UserService
                user = await UserService.getUserById(userId);
                if (user) user.role = 'user';
            }

            if (!user) {
                return res.status(404).json({ success: false, message: "Profil tidak ditemukan" });
            }

            // Amankan password sebelum dikirim ke frontend
            const { password, ...userSafeData } = user;

            res.json({ success: true, message: "Berhasil mengambil profil", user: userSafeData });
        } catch (error) {
            next(error);
        }
    }


    // Fitur Ganti Password
    static async changePassword(req, res, next) {
        try {
            // Ambil ID dari Token untuk memastikan dia hanya bisa mengganti passwordnya sendiri
            const userId = req.user.id;
            const role = req.user.role;


            if (role === 'admin') {
                return res.status(403).json({
                    success: false,
                    message: "Akses Ditolak: Admin tidak diizinkan mengganti password dari halaman ini."
                });
            }

            const { old_password, new_password } = req.body;

            if (!old_password || !new_password) {
                return res.status(400).json({ success: false, message: "Password lama dan baru wajib diisi!" });
            }

            await UserService.changePassword(userId, old_password, new_password);

            res.json({ success: true, message: "Password berhasil diubah!" });
        } catch (error) {
            // Tangkap pesan error khusus jika password lamanya salah
            if (error.message === "Password lama salah!") {
                return res.status(400).json({ success: false, message: error.message });
            }
            next(error);
        }
    }

    static async updateUser(req, res, next) {
        try {
            const loggedInUserId = req.user.id;
            const targetUserId = req.params.id;
            const role = req.user.role;

            if (role !== 'admin' && loggedInUserId !== targetUserId) {
                return res.status(403).json({
                    success: false,
                    message: "Akses ditolak! Anda hanya bisa mengubah data akun Anda sendiri."
                });
            }

            const updatedUser = await UserService.updateUser(targetUserId, req.body);
            if (updatedUser) {
                res.json({
                    success: true,
                    message: "Data berhasil diperbarui",
                    user: updatedUser
                });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error(error);
            if (error.code === 'P2002') {
                return res.status(409).json({ message: "Email or Phone Number already in use." });
            }
            next(error);
        }
    }

    static async deleteUser(req, res, next) {
        try {
            const loggedInUserId = req.user.id;
            const targetUserId = req.params.id;
            const role = req.user.role;

            if (role !== 'admin' && loggedInUserId !== targetUserId) {
                return res.status(403).json({
                    success: false,
                    message: "Akses ditolak! Anda hanya bisa menghapus akun Anda sendiri."
                });
            }

            const deletedUser = await UserService.deleteUser(targetUserId);
            if (deletedUser) {
                res.status(200).json({ success: true, message: "Pengguna berhasil dihapus" });
            } else {
                res.status(404).json({ success: false, message: "User tidak ditemukan" });
            }
        } catch (error) {
            next(error);
        }
    }

    // Fitur Upload Foto Profil
    static async uploadAvatar(req, res, next) {
        try {
            // Cek apakah ada file yang dikirim
            if (!req.file) {
                return res.status(400).json({ success: false, message: "Pilih gambar terlebih dahulu!" });
            }

            const userId = req.user.id;
            const role = req.user.role;
            const namaFileBaru = req.file.filename;

            // 1. Ambil avatar lama sebelum diupdate
            let avatarLama = null;
            if (role === 'admin') {
                const admin = await AdminModel.findById(userId);
                avatarLama = admin?.avatar;
                await AdminModel.update(userId, { avatar: namaFileBaru });
            } else if (role === 'teacher') {
                const teacher = await TeacherModel.findById(userId);
                avatarLama = teacher?.avatar;
                await TeacherModel.update(userId, { avatar: namaFileBaru });
            } else {
                const user = await UserService.getUserById(userId);
                avatarLama = user?.avatar;
                await UserService.updateUser(userId, { avatar: namaFileBaru });
            }

            // 2. Hapus file lama dari disk (async, tidak blocking response)
            deleteOldAvatar(avatarLama);

            res.json({
                success: true,
                message: "Foto profil berhasil diperbarui!",
                avatar_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${namaFileBaru}`
            });
        } catch (error) {
            next(error);
        }
    }

}

export default UserController;