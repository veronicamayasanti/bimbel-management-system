import TransactionService from "../services/transactionService.js";

class TransactionController {
    static async getAllTransactions(req, res, next) {
        try {
            const filters = {
                studentId: req.query.studentId,
                paymentStatus: req.query.paymentStatus,
                paymentMethod: req.query.paymentMethod
            };

            // If not admin, restrict to transactions of their own students
            if (req.user.role !== 'admin') {
                filters.parentId = req.user.id;
            }
            const transactions = await TransactionService.getAllTransactions(filters);
            
            res.json({
                success: true,
                message: "Berhasil mengambil data transaksi",
                data: transactions
            });
        } catch (error) {
            next(error);
        }
    }

    static async getTransactionById(req, res, next) {
        try {
            const { id } = req.params;
            const transaction = await TransactionService.getTransactionById(id);
            
            if (transaction) {
                res.json({ success: true, message: "Berhasil mengambil detail transaksi", data: transaction });
            } else {
                res.status(404).json({ success: false, message: "Transaksi tidak ditemukan" });
            }
        } catch (error) {
            next(error);
        }
    }

    static async createTransaction(req, res, next) {
        try {
            const { studentId, programPackageId, amount, paymentMethod, notes } = req.body;
            let paymentProof = null;
            
            // if method is TRANSFER, user must upload proof (if using multer, it's in req.file)
            if (paymentMethod === 'TRANSFER') {
                if (!req.file) {
                    return res.status(400).json({ success: false, message: "Bukti transfer wajib diunggah" });
                }
                paymentProof = req.file.filename;
            }

            const newTx = await TransactionService.createTransaction({
                studentId,
                programPackageId,
                amount,
                paymentMethod,
                paymentProof,
                notes
            });
            res.status(201).json({ success: true, message: "Transaksi berhasil dibuat", data: newTx });
        } catch (error) {
            next(error);
        }
    }

    static async verifyTransaction(req, res, next) {
        try {
            // Hanya admin yang bisa memverifikasi
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Akses ditolak! Hanya admin yang dapat memverifikasi transaksi." });
            }

            const { id } = req.params;
            const adminId = req.user.id;

            const updatedTx = await TransactionService.verifyTransaction(id, adminId);
            res.json({ success: true, message: "Transaksi berhasil diverifikasi dan paket aktif", data: updatedTx });
        } catch (error) {
            next(error);
        }
    }
    
    static async rejectTransaction(req, res, next) {
        try {
            // Hanya admin yang bisa me-reject
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Akses ditolak! Hanya admin yang dapat menolak transaksi." });
            }

            const { id } = req.params;
            const adminId = req.user.id;
            const { notes } = req.body;

            const updatedTx = await TransactionService.rejectTransaction(id, adminId, notes);
            res.json({ success: true, message: "Transaksi berhasil ditolak", data: updatedTx });
        } catch (error) {
            next(error);
        }
    }
}

export default TransactionController;
