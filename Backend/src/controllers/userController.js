/*
 * Copyright (c) 2026.
 * Project: Bimbel Manajemen Sistem
 * Author: Veronica Maya Santi
 * Github: https://github.com/veronicamayasanti
 * Email: veronicamayasanti@gmail.com
 */

import UserService from "../services/userService.js";

class UserController {
    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getUserById(req, res) {
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
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async createUser(req, res) {
        try {
            const { full_name, email, password, telp_no, address, isActive } = req.body;
            if (!full_name || !email || !password || !telp_no) {
                return res.status(400).json({ message: "Missing required user fields" });
            }

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
            console.error(error);
            if (error.code === 'P2002') { // Error kode Prisma untuk unique constraint violation
                return res.status(409).json({ message: "Email or Phone Number already exists." });
            }
            res.status(400).json({ message: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const updatedUser = await UserService.updateUser(req.params.id, req.body);
            if (updatedUser) {
                res.json(updatedUser);
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
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export default UserController;