import UserModel from "../models/userModel.js";
import AdminModel from "../models/adminModel.js"
import TeacherModel from "../models/teacherModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "./emailService.js";
import { prisma } from "../config/db.js"


class AuthService {
    static async login(email, password) {
        const user = await UserModel.findByEmail(email);
        if (!user) return null;

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return null;

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const { password: _, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }


    static async loginAdmin(username, password) {
        const admin = await AdminModel.findByUsername(username);
        if (!admin) return null;

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return null;

        const token = jwt.sign(
            { id: admin.id, role: 'admin' }, // Tambahkan role admin di sini
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        return { token, admin };

    }

    static async loginTeacher(email, password) {
        const teacher = await TeacherModel.findByEmail(email);
        if (!teacher) return null;

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) return null;

        if (!teacher.isActive) {
            throw new Error("Akun guru sudah tidak aktif");
        }

        const token = jwt.sign(
            { id: teacher.id, role: 'teacher' },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const { password: _, ...teacherWithoutPassword } = teacher;
        return { token, teacher: teacherWithoutPassword };
    }


    // 3. Tambahkan fungsi forgotPassword
    static async forgotPassword(email) {
        // Cek apakah email terdaftar
        const user = await UserModel.findByEmail(email);
        if (!user) throw new Error("Email tidak terdaftar");
        // Buat token acak (panjangnya 64 karakter hex)
        const resetToken = crypto.randomBytes(32).toString("hex");
        // Set waktu kadaluarsa (15 menit dari sekarang)
        const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
        // Simpan token dan waktu kadaluarsa ke database
        await UserModel.update(user.id, {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetTokenExpires
        });
        // Buat URL untuk diklik user (Nantinya URL ini mengarah ke Frontend Anda seperti React/Vue)
        // Untuk sekarang, kita arahkan ke API testing dulu
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
        const message = `Anda menerima email ini karena Anda (atau orang lain) meminta reset password.\n\nSilakan klik link berikut untuk mereset password Anda:\n\n${resetUrl}\n\nJika Anda tidak memintanya, abaikan email ini.`;
        try {
            await sendEmail({
                email: user.email,
                subject: "Bimbel Ms Kiki - Reset Password",
                message: message
            });
            return true;
        } catch (error) {
            console.error("🔥 DEBUG EMAIL ERROR:", error);

            // Jika email gagal terkirim, hapus token di database agar bersih
            await UserModel.update(user.id, {
                resetPasswordToken: null,
                resetPasswordExpires: null
            });
            throw new Error("Gagal mengirim email reset password");
        }
    }
    // 4. Tambahkan fungsi resetPassword
    static async resetPassword(token, newPassword) {
        // Cari user yang tokennya cocok DAN belum kadaluarsa
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() } // Waktunya masih lebih besar dari waktu sekarang
            }
        });
        if (!user) throw new Error("Token tidak valid atau sudah kadaluarsa");
        // Hash password baru
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        // Update password di database dan hapus tokennya
        await UserModel.update(user.id, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        });
        return true;
    }
}

export default AuthService