import { prisma } from "../config/db.js";

class ProgramModel {
    static async findAll(search = "") {
        const whereCondition = search ? {
            name: { contains: search }
        } : {};

        return prisma.program.findMany({
            where: whereCondition,
            orderBy: { created_at: 'desc' }
        });
    }

    static async findById(id) {
        return prisma.program.findUnique({
            where: { id: parseInt(id) }
        });
    }

    static async create(data) {
        return prisma.program.create({
            data: {
                name: data.name,
                description: data.description
            }
        });
    }

    static async update(id, data) {
        return prisma.program.update({
            where: { id: parseInt(id) },
            data: {
                name: data.name,
                description: data.description
            }
        });
    }

    static async delete(id) {
        return prisma.program.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default ProgramModel;
