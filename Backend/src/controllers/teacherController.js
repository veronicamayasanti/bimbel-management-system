import TeacherService from "../services/teacherService.js";

class TeacherController {
    static async getAllTeachers(req, res, next) {
        try {
            const teachers = await TeacherService.getAllTeachers();
            res.json({
                success: true,
                data: teachers
            });
        } catch (error) {
            next(error);
        }
    }

    static async getTeacherById(req, res, next) {
        try {
            const { id } = req.params;
            const teacher = await TeacherService.getTeacherById(id);
            if (!teacher) {
                return res.status(404).json({ success: false, message: "Guru tidak ditemukan" });
            }
            res.json({
                success: true,
                data: teacher
            });
        } catch (error) {
            next(error);
        }
    }

    static async createTeacher(req, res, next) {
        try {
            const teacher = await TeacherService.createTeacher(req.body);
            res.status(201).json({
                success: true,
                message: "Guru berhasil ditambahkan",
                data: teacher
            });
        } catch (error) {
            if (error.message === "Email sudah terdaftar") {
                return res.status(400).json({ success: false, message: error.message });
            }
            next(error);
        }
    }

    // Guru update diri sendiri (dari halaman profil)
    static async updateTeacherSelf(req, res, next) {
        try {
            const { id } = req.params;
            const requesterId = req.user.id;
            const role = req.user.role;

            // Guru hanya bisa update diri sendiri, admin bisa update semua
            if (role !== 'admin' && parseInt(id) !== parseInt(requesterId)) {
                return res.status(403).json({ success: false, message: 'Anda hanya bisa mengubah data diri sendiri' });
            }

            const { fullName, telpNo } = req.body;
            const teacher = await TeacherService.updateTeacher(id, { fullName, telpNo });
            res.json({
                success: true,
                message: 'Data berhasil diperbarui',
                data: teacher
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateTeacher(req, res, next) {
        try {
            const { id } = req.params;
            const teacher = await TeacherService.updateTeacher(id, req.body);
            res.json({
                success: true,
                message: "Data guru berhasil diupdate",
                data: teacher
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteTeacher(req, res, next) {
        try {
            const { id } = req.params;
            await TeacherService.deleteTeacher(id);
            res.json({
                success: true,
                message: "Guru berhasil dihapus"
            });
        } catch (error) {
            next(error);
        }
    }
}

export default TeacherController;
