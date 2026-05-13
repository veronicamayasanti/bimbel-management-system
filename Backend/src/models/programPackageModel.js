import { prisma } from "../config/db.js";

class ProgramPackageModel {
    static async findAll(programId) {
        const whereCondition = programId ? { programId: parseInt(programId) } : {};
        return prisma.programPackage.findMany({
            where: whereCondition,
            include: { program: true },
            orderBy: { created_at: 'desc' }
        });
    }

    static async findById(id) {
        return prisma.programPackage.findUnique({
            where: { id: parseInt(id) },
            include: { program: true }
        });
    }

    static async create(data) {
        return prisma.programPackage.create({
            data: {
                programId: parseInt(data.programId),
                name: data.name,
                totalMeetings: parseInt(data.totalMeetings),
                price: parseFloat(data.price),
                isActive: data.isActive !== undefined ? data.isActive : true
            }
        });
    }

    static async update(id, data) {
        return prisma.programPackage.update({
            where: { id: parseInt(id) },
            data: {
                programId: data.programId ? parseInt(data.programId) : undefined,
                name: data.name,
                totalMeetings: data.totalMeetings ? parseInt(data.totalMeetings) : undefined,
                price: data.price ? parseFloat(data.price) : undefined,
                isActive: data.isActive
            }
        });
    }

    static async delete(id) {
        return prisma.programPackage.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default ProgramPackageModel;
