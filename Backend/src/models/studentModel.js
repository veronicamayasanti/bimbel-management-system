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

    static async findAll(skip = 0, take = 10, filters = {}) {
        const andConditions = [];
        
        if (filters.branchId) {
            const bId = parseInt(filters.branchId);
            if (!isNaN(bId)) andConditions.push({ branchId: bId });
        }
        
        if (filters.levelId) {
            const lId = parseInt(filters.levelId);
            if (!isNaN(lId)) andConditions.push({ levelId: lId });
        }
        
        if (filters.search) {
            andConditions.push({
                OR: [
                    { fullName: { contains: filters.search } },
                    { schoolName: { contains: filters.search } },
                    { parent: { full_name: { contains: filters.search } } }
                ]
            });
        }

        const where = andConditions.length > 0 ? { AND: andConditions } : {};

        return prisma.student.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(take),
            include: {
                parent: {
                    select: { id: true, full_name: true, email: true }
                },
                branch: true,
                level: true,
                studentPackages: {
                    include: {
                        programPackage: true
                    },
                    orderBy: { created_at: 'desc' }
                }
            },
            orderBy: { created_at: "desc" }
        });
    }

    static async countAll(filters = {}) {
        const andConditions = [];
        
        if (filters.branchId) {
            const bId = parseInt(filters.branchId);
            if (!isNaN(bId)) andConditions.push({ branchId: bId });
        }
        
        if (filters.levelId) {
            const lId = parseInt(filters.levelId);
            if (!isNaN(lId)) andConditions.push({ levelId: lId });
        }
        
        if (filters.search) {
            andConditions.push({
                OR: [
                    { fullName: { contains: filters.search } },
                    { schoolName: { contains: filters.search } },
                    { parent: { full_name: { contains: filters.search } } }
                ]
            });
        }

        const where = andConditions.length > 0 ? { AND: andConditions } : {};

        return prisma.student.count({ where });
    }

    static async findByParentId(parentId, search = "") {
        const where = {
            parentId,
            OR: search ? [
                { fullName: { contains: search } },
                { schoolName: { contains: search } }
            ] : undefined
        };

        return prisma.student.findMany({
            where,
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
