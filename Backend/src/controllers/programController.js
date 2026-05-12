import ProgramService from "../services/programService.js";

class ProgramController {
    static async getAllPrograms(req, res, next) {
        try {
            const search = req.query.search || "";
            const programs = await ProgramService.getAllPrograms(search);
            
            res.json({
                success: true,
                message: "Berhasil mengambil data program",
                data: programs
            });
        } catch (error) {
            next(error);
        }
    }

    static async getProgramById(req, res, next) {
        try {
            const { id } = req.params;
            const program = await ProgramService.getProgramById(id);
            
            if (program) {
                res.json({ success: true, message: "Berhasil mengambil data program", data: program });
            } else {
                res.status(404).json({ success: false, message: "Program tidak ditemukan" });
            }
        } catch (error) {
            next(error);
        }
    }

    static async createProgram(req, res, next) {
        try {
            // Hanya admin yang boleh create
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Akses ditolak! Hanya admin yang dapat menambah program." });
            }

            const { name, description } = req.body;
            
            const newProgram = await ProgramService.createProgram({ name, description });
            res.status(201).json({ success: true, message: "Program berhasil ditambahkan", data: newProgram });
        } catch (error) {
            next(error);
        }
    }

    static async updateProgram(req, res, next) {
        try {
            // Hanya admin yang boleh update
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Akses ditolak! Hanya admin yang dapat mengubah program." });
            }

            const { id } = req.params;
            const { name, description } = req.body;

            const existingProgram = await ProgramService.getProgramById(id);
            if (!existingProgram) {
                return res.status(404).json({ success: false, message: "Program tidak ditemukan" });
            }

            const updatedProgram = await ProgramService.updateProgram(id, { name, description });
            res.json({ success: true, message: "Program berhasil diperbarui", data: updatedProgram });
        } catch (error) {
            next(error);
        }
    }

    static async deleteProgram(req, res, next) {
        try {
            // Hanya admin yang boleh delete
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Akses ditolak! Hanya admin yang dapat menghapus program." });
            }

            const { id } = req.params;
            
            const existingProgram = await ProgramService.getProgramById(id);
            if (!existingProgram) {
                return res.status(404).json({ success: false, message: "Program tidak ditemukan" });
            }

            await ProgramService.deleteProgram(id);
            res.json({ success: true, message: "Program berhasil dihapus" });
        } catch (error) {
            next(error);
        }
    }
}

export default ProgramController;
