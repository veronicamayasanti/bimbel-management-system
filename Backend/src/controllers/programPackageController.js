import ProgramPackageService from "../services/programPackageService.js";

class ProgramPackageController {
    static async getAllPackages(req, res, next) {
        try {
            const programId = req.query.programId;
            const packages = await ProgramPackageService.getAllPackages(programId);
            
            res.json({
                success: true,
                message: "Berhasil mengambil data paket program",
                data: packages
            });
        } catch (error) {
            next(error);
        }
    }

    static async getPackageById(req, res, next) {
        try {
            const { id } = req.params;
            const pkg = await ProgramPackageService.getPackageById(id);
            
            if (pkg) {
                res.json({ success: true, message: "Berhasil mengambil data paket program", data: pkg });
            } else {
                res.status(404).json({ success: false, message: "Paket program tidak ditemukan" });
            }
        } catch (error) {
            next(error);
        }
    }

    static async createPackage(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Akses ditolak! Hanya admin yang dapat menambah paket." });
            }

            const { programId, name, totalMeetings, price, isActive } = req.body;
            
            const newPackage = await ProgramPackageService.createPackage({ programId, name, totalMeetings, price, isActive });
            res.status(201).json({ success: true, message: "Paket program berhasil ditambahkan", data: newPackage });
        } catch (error) {
            next(error);
        }
    }

    static async updatePackage(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Akses ditolak! Hanya admin yang dapat mengubah paket." });
            }

            const { id } = req.params;
            const { programId, name, totalMeetings, price, isActive } = req.body;

            const existingPackage = await ProgramPackageService.getPackageById(id);
            if (!existingPackage) {
                return res.status(404).json({ success: false, message: "Paket program tidak ditemukan" });
            }

            const updatedPackage = await ProgramPackageService.updatePackage(id, { programId, name, totalMeetings, price, isActive });
            res.json({ success: true, message: "Paket program berhasil diperbarui", data: updatedPackage });
        } catch (error) {
            next(error);
        }
    }

    static async deletePackage(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Akses ditolak! Hanya admin yang dapat menghapus paket." });
            }

            const { id } = req.params;
            
            const existingPackage = await ProgramPackageService.getPackageById(id);
            if (!existingPackage) {
                return res.status(404).json({ success: false, message: "Paket program tidak ditemukan" });
            }

            await ProgramPackageService.deletePackage(id);
            res.json({ success: true, message: "Paket program berhasil dihapus" });
        } catch (error) {
            next(error);
        }
    }
}

export default ProgramPackageController;
