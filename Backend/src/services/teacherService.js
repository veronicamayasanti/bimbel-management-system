import TeacherModel from "../models/teacherModel.js";
import bcrypt from "bcryptjs";

class TeacherService {
    static async getAllTeachers() {
        return await TeacherModel.findAll();
    }

    static async getTeacherById(id) {
        return await TeacherModel.findById(id);
    }

    static async createTeacher(data) {
        const { fullName, email, password, telpNo } = data;

        // Check if email already exists
        const existingTeacher = await TeacherModel.findByEmail(email);
        if (existingTeacher) {
            throw new Error("Email sudah terdaftar");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return await TeacherModel.create({
            fullName,
            email,
            password: hashedPassword,
            telpNo
        });
    }

    static async updateTeacher(id, data) {
        const { fullName, email, password, telpNo, isActive } = data;
        const updateData = { fullName, email, telpNo, isActive };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        return await TeacherModel.update(id, updateData);
    }

    static async deleteTeacher(id) {
        return await TeacherModel.delete(id);
    }
}

export default TeacherService;
