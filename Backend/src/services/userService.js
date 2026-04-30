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
        // 1. Cek apakah user ada
        const userExist = await UserModel.findById(id);
        if (!userExist) return null;

        // 2. Jika ada update password, hash dulu
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        // 3. Lakukan update
        const updatedUser = await UserModel.update(id, userData);

        // 4. Hilangkan password dari hasil yang dikembalikan
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
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