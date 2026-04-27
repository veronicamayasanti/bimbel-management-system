/*
 * Copyright (c) 2026.
 * Project: Bimbel Manajemen Sistem
 * Author: Veronica Maya Santi
 * Github: https://github.com/veronicamayasanti
 * Email: veronicamayasanti@gmail.com
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Database connected successfully with Prisma!");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Keluar dari proses jika koneksi gagal
    }
};

export { prisma }; // Ekspor instance PrismaClient
export default connectDB;