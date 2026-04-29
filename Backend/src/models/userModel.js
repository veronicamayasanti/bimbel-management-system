/*
 * Copyright (c) 2026.
 * Project: Bimbel Manajemen Sistem
 * Author: Veronica Maya Santi
 * Github: https://github.com/veronicamayasanti
 * Email: veronicamayasanti@gmail.com
 */

import { prisma } from "../config/db.js";

class UserModel {
    static async findAll(skip = 0, take = 10) {
        return prisma.user.findMany({
            skip: skip,
            take: take,
            orderBy: { created_at: 'desc' }
        });
    }

    static async count() {
        return prisma.user.count();
    }


    static async findById(id) {
        return prisma.user.findUnique({
            where: { id: id },
        });
    }

    static async create(newUser) {
        return prisma.user.create({
            data: newUser,
        });
    }

    static async update(id, userData) {
        return prisma.user.update({
            where: { id },
            data: userData,
        });
    }

    static async delete(id) {
        return prisma.user.delete({
            where: { id: id },
        });
    }

    static async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
        });
    }

}

export default UserModel;