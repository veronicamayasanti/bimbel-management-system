import { prisma } from "../config/db.js";

class LevelModel {
    static async findAll(search = "") {
        const whereCondition = search ? {
            name: { contains: search }
        } : {};

        return prisma.level.findMany({
            where: whereCondition,
            orderBy: { created_at: 'desc' }
        });
    }

    static async findById(id) {
        return prisma.level.findUnique({
            where: { id: parseInt(id) }
        });
    }

    static async create(data) {
        return prisma.level.create({
            data: {
                name: data.name
            }
        });
    }

    static async update(id, data) {
        return prisma.level.update({
            where: { id: parseInt(id) },
            data: {
                name: data.name
            }
        });
    }

    static async delete(id) {
        return prisma.level.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default LevelModel;
