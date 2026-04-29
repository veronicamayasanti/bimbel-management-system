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
            const result = await UserService.getAllUsers(page, limit);

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

    static async updateUser(req, res) {
        try {
            const updatedUser = await UserService.updateUser(req.params.id, req.body);
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
            res.status(400).json({ message: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const deletedUser = await UserService.deleteUser(req.params.id);
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
}

export default UserController;