import LevelService from "../services/levelService.js";

class LevelController {
    static async getAllLevels(req, res, next) {
        try {
            const search = req.query.search || "";
            const levels = await LevelService.getAllLevels(search);
            
            res.json({
                success: true,
                message: "Berhasil mengambil data level",
                data: levels
            });
        } catch (error) {
            next(error);
        }
    }

    static async getLevelById(req, res, next) {
        try {
            const { id } = req.params;
            const level = await LevelService.getLevelById(id);
            
            if (level) {
                res.json({ success: true, message: "Berhasil mengambil data level", data: level });
            } else {
                res.status(404).json({ success: false, message: "Level tidak ditemukan" });
            }
        } catch (error) {
            next(error);
        }
    }

    static async createLevel(req, res, next) {
        try {
            // Hanya admin yang boleh create
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Akses ditolak! Hanya admin yang dapat menambah level." });
            }

            const { name } = req.body;
            
            const newLevel = await LevelService.createLevel({ name });
            res.status(201).json({ success: true, message: "Level berhasil ditambahkan", data: newLevel });
        } catch (error) {
            next(error);
        }
    }

    static async updateLevel(req, res, next) {
        try {
            // Hanya admin yang boleh update
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Akses ditolak! Hanya admin yang dapat mengubah level." });
            }

            const { id } = req.params;
            const { name } = req.body;

            const existingLevel = await LevelService.getLevelById(id);
            if (!existingLevel) {
                return res.status(404).json({ success: false, message: "Level tidak ditemukan" });
            }

            const updatedLevel = await LevelService.updateLevel(id, { name });
            res.json({ success: true, message: "Level berhasil diperbarui", data: updatedLevel });
        } catch (error) {
            next(error);
        }
    }

    static async deleteLevel(req, res, next) {
        try {
            // Hanya admin yang boleh delete
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Akses ditolak! Hanya admin yang dapat menghapus level." });
            }

            const { id } = req.params;
            
            const existingLevel = await LevelService.getLevelById(id);
            if (!existingLevel) {
                return res.status(404).json({ success: false, message: "Level tidak ditemukan" });
            }

            await LevelService.deleteLevel(id);
            res.json({ success: true, message: "Level berhasil dihapus" });
        } catch (error) {
            next(error);
        }
    }
}

export default LevelController;
