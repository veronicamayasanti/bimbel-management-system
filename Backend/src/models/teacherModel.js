import { prisma } from "../config/db.js";

class TeacherModel {
    static async create(data) {
        return prisma.teacher.create({
            data: data
        });
    }

    static async findAll() {
        return prisma.teacher.findMany({
            orderBy: { created_at: 'desc' }
        });
    }

    static async findById(id) {
        return prisma.teacher.findUnique({
            where: { id: parseInt(id) },
            include: {
                schedules: true,
                recurring: true
            }
        });
    }

    static async findByEmail(email) {
        return prisma.teacher.findUnique({
            where: { email }
        });
    }

    static async update(id, data) {
        return prisma.teacher.update({
            where: { id: parseInt(id) },
            data: data
        });
    }

    static async delete(id) {
        return prisma.teacher.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default TeacherModel;
