/*
 * Copyright (c) 2026.
 * Project: Bimbel Manajemen Sistem
 * Author: Veronica Maya Santi
 * Github: https://github.com/veronicamayasanti
 * Email: veronicamayasanti@gmail.com
 */

import { prisma } from "../config/db.js";

class UserModel {
    static async findAll(skip = 0, take = 10, search = "") {
        // Tambahkan isActive: true di dalam sini
        const whereCondition = {
            isActive: true, // <--- HANYA TAMPILKAN YANG AKTIF
            ...(search ? {
                OR: [
                    { full_name: { contains: search } },
                    { email: { contains: search } }
                ]
            } : {})
        };

        return prisma.user.findMany({
            where: whereCondition,
            skip: skip,
            take: take,
            orderBy: { created_at: 'desc' }
        });
    }

    static async count(search = "") {
        // Lakukan hal yang sama persis untuk fungsi count
        const whereCondition = {
            isActive: true, // <--- HANYA HITUNG YANG AKTIF
            ...(search ? {
                OR: [
                    { full_name: { contains: search } },
                    { email: { contains: search } }
                ]
            } : {})
        };
        return prisma.user.count({
            where: whereCondition
        });
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
        // Soft Delete: Hanya mengubah status isActive menjadi false
        return prisma.user.update({
            where: { id: id },
            data: { isActive: false }
        });
    }

    static async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
        });
    }

}

export default UserModel;