import { prisma } from "../config/db.js";

class StudentModel {
    static async create(data) {
        return prisma.student.create({
            data: {
                parentId: data.parentId,
                branchId: data.branchId,
                levelId: data.levelId,
                fullName: data.fullName,
                schoolName: data.schoolName
            },
            include: {
                branch: true,
                level: true,
                studentPackages: {
                    include: {
                        programPackage: true
                    }
                }
            }
        });
    }

    static async findAll() {
        return prisma.student.findMany({
            include: {
                parent: {
                    select: { id: true, full_name: true, email: true }
                },
                branch: true,
                level: true,
                studentPackages: {
                    include: {
                        programPackage: true
                    }
                }
            },
            orderBy: { created_at: "desc" }
        });
    }

    static async findByParentId(parentId) {
        return prisma.student.findMany({
            where: { parentId },
            include: {
                branch: true,
                level: true,
                studentPackages: {
                    include: {
                        programPackage: true
                    }
                }
            },
            orderBy: { created_at: "desc" }
        });
    }

    static async findById(id) {
        return prisma.student.findUnique({
            where: { id: parseInt(id) },
            include: {
                parent: {
                    select: { id: true, full_name: true, email: true }
                },
                branch: true,
                level: true,
                studentPackages: {
                    include: {
                        programPackage: true
                    }
                }
            }
        });
    }

    static async update(id, data) {
        return prisma.student.update({
            where: { id: parseInt(id) },
            data: {
                branchId: data.branchId,
                levelId: data.levelId,
                fullName: data.fullName,
                schoolName: data.schoolName
            },
            include: {
                branch: true,
                level: true,
                studentPackages: {
                    include: {
                        programPackage: true
                    }
                }
            }
        });
    }

    static async delete(id) {
        return prisma.student.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default StudentModel;
