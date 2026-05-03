/*
 * Copyright (c) 2026.
 * Project: Bimbel Manajemen Sistem
 * Author: Veronica Maya Santi
 * Github: https://github.com/veronicamayasanti
 * Email: veronicamayasanti@gmail.com
 */

import UserModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';

class UserService {
    static async getAllUsers(page = 1, limit = 10, search = "") {
        const skip = (page - 1) * limit;

        const users = await UserModel.findAll(skip, limit, search);
        const totalUsers = await UserModel.count(search);


        const userResponse = users.map(user => ({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            telp_no: user.telp_no,
            address: user.address,
            isActive: user.isActive,
            avatar: user.avatar,
            created_at: user.created_at,
        }));

        return {
            data: userResponse,
            meta: {
                total_data: totalUsers,
                current_page: page,
                total_pages: Math.ceil(totalUsers / limit),
                per_page: limit
            }
        };
    }

    static async getUserById(id) {
        const user = await UserModel.findById(id);
        if (!user) return null;

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    static async createUser(userData) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUserWithHash = {
            ...userData,
            password: hashedPassword
        };

        return UserModel.create(newUserWithHash);
    }

    static async updateUser(id, userData) {
        // HAPUS SECARA PAKSA field password agar tidak bisa diubah lewat jalur ini
        delete userData.password;

        // 1. Cek apakah user ada
        const userExist = await UserModel.findById(id);
        if (!userExist) return null;


        // 3. Lakukan update
        const updatedUser = await UserModel.update(id, userData);

        // 4. Hilangkan password dari hasil yang dikembalikan
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    static async changePassword(id, oldPassword, newPassword) {
        const user = await UserModel.findById(id);
        if (!user) throw new Error("User tidak ditemukan");

        // Cek apakah password lama yang dimasukkan COCOK dengan di database
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new Error("Password lama salah!");

        // Jika cocok, Hash password barunya
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update password ke database
        await UserModel.update(id, { password: hashedNewPassword });
        return true;
    }


    static async deleteUser(id) {
        const user = await UserModel.findById(id);

        if (!user) {
            return null;
        }
        return UserModel.delete(id);
    }
}

export default UserService;