import BranchService from "../services/branchService.js";

class BranchController {
    static async getAllBranches(req, res, next) {
        try {
            const search = req.query.search || "";
            const branches = await BranchService.getAllBranches(search);
            
            res.json({
                success: true,
                message: "Berhasil mengambil data cabang",
                data: branches
            });
        } catch (error) {
            next(error);
        }
    }

    static async getBranchById(req, res, next) {
        try {
            const { id } = req.params;
            const branch = await BranchService.getBranchById(id);
            
            if (branch) {
                res.json({ success: true, message: "Berhasil mengambil data cabang", data: branch });
            } else {
                res.status(404).json({ success: false, message: "Cabang tidak ditemukan" });
            }
        } catch (error) {
            next(error);
        }
    }

    static async createBranch(req, res, next) {
        try {
            // Hanya admin yang boleh create
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Akses ditolak! Hanya admin yang dapat menambah cabang." });
            }

            const { name, address } = req.body;
            
            if (!name) {
                return res.status(400).json({ success: false, message: "Nama cabang wajib diisi." });
            }

            const newBranch = await BranchService.createBranch({ name, address });
            res.status(201).json({ success: true, message: "Cabang berhasil ditambahkan", data: newBranch });
        } catch (error) {
            next(error);
        }
    }

    static async updateBranch(req, res, next) {
        try {
            // Hanya admin yang boleh update
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Akses ditolak! Hanya admin yang dapat mengubah cabang." });
            }

            const { id } = req.params;
            const { name, address } = req.body;

            const existingBranch = await BranchService.getBranchById(id);
            if (!existingBranch) {
                return res.status(404).json({ success: false, message: "Cabang tidak ditemukan" });
            }

            const updatedBranch = await BranchService.updateBranch(id, { name, address });
            res.json({ success: true, message: "Cabang berhasil diperbarui", data: updatedBranch });
        } catch (error) {
            next(error);
        }
    }

    static async deleteBranch(req, res, next) {
        try {
            // Hanya admin yang boleh delete
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Akses ditolak! Hanya admin yang dapat menghapus cabang." });
            }

            const { id } = req.params;
            
            const existingBranch = await BranchService.getBranchById(id);
            if (!existingBranch) {
                return res.status(404).json({ success: false, message: "Cabang tidak ditemukan" });
            }

            await BranchService.deleteBranch(id);
            res.json({ success: true, message: "Cabang berhasil dihapus" });
        } catch (error) {
            next(error);
        }
    }
}

export default BranchController;
