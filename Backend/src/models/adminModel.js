import { prisma } from "../config/db.js";

class AdminModel {
    static async findByUsername(username) {
        return prisma.admin.findUnique({
            where: { username },
        });
    }

    static async findById(id) {
        return prisma.admin.findUnique({
            where: { id: id },
        });
    }

    static async update(id, data) {
        return prisma.admin.update({
            where: { id: id },
            data: data
        });
    }
}

export default AdminModel;
