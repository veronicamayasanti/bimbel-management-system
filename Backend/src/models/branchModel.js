import { prisma } from "../config/db.js";

class BranchModel {
    static async findAll(search = "") {
        const whereCondition = search ? {
            name: { contains: search }
        } : {};

        return prisma.branch.findMany({
            where: whereCondition,
            orderBy: { created_at: 'desc' }
        });
    }

    static async findById(id) {
        return prisma.branch.findUnique({
            where: { id: parseInt(id) }
        });
    }

    static async create(data) {
        return prisma.branch.create({
            data: {
                name: data.name,
                address: data.address
            }
        });
    }

    static async update(id, data) {
        return prisma.branch.update({
            where: { id: parseInt(id) },
            data: {
                name: data.name,
                address: data.address
            }
        });
    }

    static async delete(id) {
        return prisma.branch.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default BranchModel;
