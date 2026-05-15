import { prisma } from "../config/db.js";

class ScheduleModel {
    // --- Recurring Schedule ---
    static async createRecurring(data, studentIds, levelIds) {
        return prisma.recurringSchedule.create({
            data: {
                ...data,
                students: {
                    create: studentIds.map(studentId => ({ studentId }))
                },
                levels: {
                    create: levelIds.map(levelId => ({ levelId }))
                }
            },
            include: { students: true, levels: true }
        });
    }

    static async findAllRecurring() {
        return prisma.recurringSchedule.findMany({
            include: {
                teacher: { select: { fullName: true } },
                program: { select: { name: true } },
                branch: { select: { name: true } },
                levels: { include: { level: true } },
                students: { include: { student: true } }
            }
        });
    }

    static async updateRecurring(id, data, studentIds, levelIds) {
        // Gunakan transaksi untuk memastikan atomisitas
        return prisma.$transaction(async (tx) => {
            // Hapus semua murid lama dari jadwal ini
            await tx.recurringScheduleStudent.deleteMany({
                where: { recurringScheduleId: parseInt(id) }
            });

            // Hapus semua level lama dari jadwal ini
            await tx.recurringScheduleLevel.deleteMany({
                where: { recurringScheduleId: parseInt(id) }
            });

            // Update data jadwal dan tambahkan murid serta level baru
            return tx.recurringSchedule.update({
                where: { id: parseInt(id) },
                data: {
                    ...data,
                    students: {
                        create: studentIds.map(studentId => ({ studentId }))
                    },
                    levels: {
                        create: levelIds.map(levelId => ({ levelId }))
                    }
                },
                include: { students: true, levels: true }
            });
        });
    }

    static async deleteRecurring(id) {
        return prisma.recurringSchedule.delete({
            where: { id: parseInt(id) }
        });
    }

    // --- Lesson Schedule (Harian) ---
    static async createLessonSession(data, studentDetails) {
        // studentDetails: Array of { studentId, studentPackageId }
        return prisma.lessonSchedule.create({
            data: {
                ...data,
                attendances: {
                    create: studentDetails.map(detail => ({
                        studentId: detail.studentId,
                        studentPackageId: detail.studentPackageId
                    }))
                }
            },
            include: { attendances: true }
        });
    }

    static async findLessonsByDateRange(startDate, endDate, teacherId = null) {
        const whereClause = {
            date: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        };

        if (teacherId) {
            whereClause.teacherId = parseInt(teacherId);
        }

        return prisma.lessonSchedule.findMany({
            where: whereClause,
            include: {
                teacher: { select: { fullName: true } },
                program: { select: { name: true } },
                branch: { select: { name: true } },
                attendances: {
                    include: {
                        student: { select: { fullName: true } }
                    }
                }
            },
            orderBy: { startTime: 'asc' }
        });
    }

    static async findLessonById(id) {
        return prisma.lessonSchedule.findUnique({
            where: { id: parseInt(id) },
            include: {
                teacher: true,
                program: true,
                branch: true,
                attendances: {
                    include: {
                        student: true,
                        studentPackage: true
                    }
                }
            }
        });
    }

    static async updateLessonStatus(id, status) {
        return prisma.lessonSchedule.update({
            where: { id: parseInt(id) },
            data: { status }
        });
    }
}

export default ScheduleModel;
