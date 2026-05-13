import { prisma } from "../config/db.js";

class TransactionModel {
    static async findAll(filters = {}) {
        const where = {};
        if (filters.studentId) where.studentId = parseInt(filters.studentId);
        if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;
        if (filters.paymentMethod) where.paymentMethod = filters.paymentMethod;
        if (filters.parentId) {
            where.student = {
                parentId: filters.parentId
            };
        }

        return prisma.transaction.findMany({
            where,
            include: { student: true, programPackage: true, verifiedBy: true },
            orderBy: { created_at: 'desc' }
        });
    }

    static async findById(id) {
        return prisma.transaction.findUnique({
            where: { id },
            include: { student: true, programPackage: true }
        });
    }

    static async create(data) {
        return prisma.transaction.create({
            data: {
                studentId: parseInt(data.studentId),
                programPackageId: parseInt(data.programPackageId),
                amount: parseFloat(data.amount),
                paymentMethod: data.paymentMethod,
                paymentProof: data.paymentProof || null,
                notes: data.notes || null,
                paymentStatus: 'PENDING'
            }
        });
    }

    static async verify(id, adminId) {
        return prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.findUnique({
                where: { id },
                include: { programPackage: true }
            });

            if (!transaction) throw new Error("Transaksi tidak ditemukan");
            if (transaction.paymentStatus === 'VERIFIED') throw new Error("Transaksi sudah diverifikasi");

            // 1. Update Transaction Status
            const updatedTx = await tx.transaction.update({
                where: { id },
                data: {
                    paymentStatus: 'VERIFIED',
                    verifiedById: adminId,
                    verifiedAt: new Date()
                }
            });

            // 2. Create StudentPackage
            await tx.studentPackage.create({
                data: {
                    studentId: transaction.studentId,
                    programPackageId: transaction.programPackageId,
                    transactionId: transaction.id,
                    totalMeetings: transaction.programPackage.totalMeetings,
                    remainingMeetings: transaction.programPackage.totalMeetings,
                    status: 'ACTIVE'
                }
            });

            return updatedTx;
        });
    }
    
    static async reject(id, adminId, notes) {
        return prisma.transaction.update({
            where: { id },
            data: {
                paymentStatus: 'REJECTED',
                verifiedById: adminId,
                verifiedAt: new Date(),
                notes: notes || undefined
            }
        });
    }
}

export default TransactionModel;
