import ScheduleModel from "../models/scheduleModel.js";
import { prisma } from "../config/db.js";

class ScheduleService {
    static async createRecurring(data, studentIds, levelIds) {
        return await ScheduleModel.createRecurring(data, studentIds, levelIds);
    }

    static async getAllRecurring() {
        return await ScheduleModel.findAllRecurring();
    }

    static async updateRecurring(id, data, studentIds, levelIds) {
        return await ScheduleModel.updateRecurring(id, data, studentIds, levelIds);
    }

    static async deleteRecurring(id) {
        return await ScheduleModel.deleteRecurring(id);
    }

    static async generateSessions(startDate, endDate) {
        console.log(`Generating sessions from ${startDate} to ${endDate}`);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const recurringSchedules = await prisma.recurringSchedule.findMany({
            include: { 
                students: { 
                    include: { 
                        student: { 
                            include: { 
                                studentPackages: { 
                                    where: { status: 'ACTIVE' },
                                    include: {
                                        programPackage: true
                                    }
                                } 
                            } 
                        } 
                    } 
                } 
            }
        });

        console.log(`Found ${recurringSchedules.length} recurring schedules`);
        let createdCount = 0;

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dayOfWeek = d.getDay();
            const relevantSchedules = recurringSchedules.filter(s => s.dayOfWeek === dayOfWeek);
            
            // Tanggal murni tanpa jam untuk perbandingan
            const dateOnly = new Date(d);
            dateOnly.setHours(0, 0, 0, 0);

            for (const schedule of relevantSchedules) {
                // Cek apakah sudah ada sesi untuk jadwal ini di tanggal ini
                const existing = await prisma.lessonSchedule.findFirst({
                    where: {
                        teacherId: schedule.teacherId,
                        programId: schedule.programId,
                        branchId: schedule.branchId,
                        date: dateOnly
                    }
                });

                if (existing) continue;

                const [startH, startM] = schedule.startTime.split(':');
                const [endH, endM] = schedule.endTime.split(':');
                
                const sessionStart = new Date(d);
                sessionStart.setHours(parseInt(startH), parseInt(startM), 0, 0);
                
                const sessionEnd = new Date(d);
                sessionEnd.setHours(parseInt(endH), parseInt(endM), 0, 0);

                const studentDetails = schedule.students.map(rs => {
                    // Cari paket yang sesuai dengan programId dari jadwal ini
                    const activePackage = rs.student.studentPackages.find(pkg => pkg.programPackage.programId === schedule.programId);
                    if (activePackage) {
                        return { studentId: rs.studentId, studentPackageId: activePackage.id };
                    }
                    return null;
                }).filter(s => s !== null);

                if (studentDetails.length > 0) {
                    await ScheduleModel.createLessonSession({
                        teacherId: schedule.teacherId,
                        programId: schedule.programId,
                        branchId: schedule.branchId,
                        date: dateOnly,
                        startTime: sessionStart,
                        endTime: sessionEnd
                    }, studentDetails);
                    createdCount++;
                } else {
                    console.log(`Schedule ID ${schedule.id} skipped: No active packages for students`);
                }
            }
        }

        console.log(`Successfully generated ${createdCount} sessions`);
        return createdCount;
    }

    static async getDailyLessons(startDate, endDate, teacherId = null) {
        return await ScheduleModel.findLessonsByDateRange(startDate, endDate, teacherId);
    }

    static async getStudentsForSchedule(programId, branchId, levelIds) {
        const whereClause = {
            studentPackages: {
                some: {
                    status: 'ACTIVE',
                    programPackage: {
                        programId: parseInt(programId)
                    }
                }
            }
        };

        if (branchId) {
            whereClause.branchId = parseInt(branchId);
        }

        if (levelIds) {
            const levelIdList = (Array.isArray(levelIds) ? levelIds : [levelIds])
                .map(id => parseInt(id))
                .filter(id => !isNaN(id));
            
            if (levelIdList.length > 0) {
                whereClause.levelId = { in: levelIdList };
            }
        }
        
        return await prisma.student.findMany({
            where: whereClause,
            include: {
                level: true,
                studentPackages: {
                    where: {
                        status: 'ACTIVE',
                        programPackage: {
                            programId: parseInt(programId)
                        }
                    }
                }
            }
        });
    }
}

export default ScheduleService;
