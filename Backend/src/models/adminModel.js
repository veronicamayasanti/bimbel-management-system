import { prisma } from "../config/db.js";

class AdminModel {
    static async findByUsername(username) {
        return prisma.admin.findUnique({
            where: { username },
        });
    }
}

export default AdminModel;
