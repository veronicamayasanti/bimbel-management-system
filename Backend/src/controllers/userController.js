/*
 * Copyright (c) 2026.
 * Project: Bimbel Manajemen Sistem
 * Author: Veronica Maya Santi
 * Github: https://github.com/veronicamayasanti
 * Email: veronicamayasanti@gmail.com
 */

import UserService from "../services/userService.js";

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
                res.json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error(error);
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
            // Ambil ID otomatis dari Token (bukan dari URL)
            const userId = req.user.id;
            const user = await UserService.getUserById(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: "User tidak ditemukan" });
            }
            res.json({ success: true, message: "Berhasil mengambil profil", user: user });
        } catch (error) {
            next(error);
        }
    }

    // Fitur Ganti Password
    static async changePassword(req, res, next) {
        try {
            // Ambil ID dari Token untuk memastikan dia hanya bisa mengganti passwordnya sendiri
            const userId = req.user.id;
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

            const updatedUser = await UserService.updateUser(loggedInUserId, req.body);
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
                res.status(200).json({ message: "User deleted successfully" });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error(error);
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
            const namaFileBaru = req.file.filename;

            // Update kolom 'avatar' di database dengan nama file yang baru
            // (Kita bisa pakai fungsi updateUser karena ia sudah otomatis aman)
            await UserService.updateUser(userId, { avatar: namaFileBaru });

            res.json({
                success: true,
                message: "Foto profil berhasil diperbarui!",
                avatar_url: `http://localhost:3000/uploads/${namaFileBaru}`
            });
        } catch (error) {
            next(error);
        }
    }

}

export default UserController;