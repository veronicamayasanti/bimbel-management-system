import { prisma } from "../config/db.js";

class StudentPackageModel {
    static async findByStudentId(studentId) {
        return prisma.studentPackage.findMany({
            where: { studentId: parseInt(studentId) },
            include: { programPackage: true, transaction: true },
            orderBy: { created_at: 'desc' }
        });
    }
}
export default StudentPackageModel;
