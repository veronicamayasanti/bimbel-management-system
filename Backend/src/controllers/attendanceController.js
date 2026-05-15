import { prisma } from "../config/db.js";

// Status yang memotong kuota: PRESENT (hadir) dan ABSENT (alpa)
// Status yang TIDAK memotong kuota: PERMIT (izin) dan PENDING
const QUOTA_DEDUCTING_STATUSES = ['PRESENT', 'ABSENT'];

class AttendanceController {
    static async markAttendance(req, res, next) {
        try {
            const { attendanceId } = req.params;
            const { status, notes } = req.body;

            // 1. Dapatkan data absensi lama
            const oldAttendance = await prisma.attendance.findUnique({
                where: { id: parseInt(attendanceId) },
                include: { studentPackage: true }
            });

            if (!oldAttendance) {
                return res.status(404).json({ success: false, message: "Data absensi tidak ditemukan" });
            }

            // === DEBUG LOG ===
            console.log(`[Attendance] ID=${attendanceId} | Status: ${oldAttendance.status} -> ${status}`);
            console.log(`[Attendance] studentPackageId=${oldAttendance.studentPackageId} | package=`, oldAttendance.studentPackage ? `remainingMeetings=${oldAttendance.studentPackage.remainingMeetings}` : 'NULL!');

            const wasDeducting = QUOTA_DEDUCTING_STATUSES.includes(oldAttendance.status);
            const isDeducting = QUOTA_DEDUCTING_STATUSES.includes(status);
            console.log(`[Attendance] wasDeducting=${wasDeducting} | isDeducting=${isDeducting}`);

            // 2. Jika status BARU memotong kuota dan status LAMA tidak memotong -> Potong kuota
            if (isDeducting && !wasDeducting) {
                if (!oldAttendance.studentPackage) {
                    console.error(`[Attendance] ERROR: studentPackage is NULL for attendanceId=${attendanceId}. Sesi mungkin dibuat sebelum fix. Status tetap diupdate tanpa potong kuota.`);
                } else if (oldAttendance.studentPackage.remainingMeetings <= 0) {
                    return res.status(400).json({ success: false, message: "Kuota paket murid sudah habis" });
                } else {
                    await prisma.studentPackage.update({
                        where: { id: oldAttendance.studentPackageId },
                        data: {
                            remainingMeetings: { decrement: 1 },
                            status: oldAttendance.studentPackage.remainingMeetings - 1 <= 0 ? 'EXPIRED' : 'ACTIVE'
                        }
                    });
                    console.log(`[Attendance] Kuota dipotong. Sisa sebelumnya: ${oldAttendance.studentPackage.remainingMeetings}`);
                }
            }
            
            // 3. Jika status LAMA memotong kuota dan status BARU tidak memotong -> Kembalikan kuota
            else if (wasDeducting && !isDeducting) {
                if (oldAttendance.studentPackage) {
                    await prisma.studentPackage.update({
                        where: { id: oldAttendance.studentPackageId },
                        data: {
                            remainingMeetings: { increment: 1 },
                            status: 'ACTIVE'
                        }
                    });
                    console.log(`[Attendance] Kuota dikembalikan.`);
                }
            }
            // Jika keduanya sama-sama memotong (misal: PRESENT -> ABSENT atau sebaliknya) -> tidak ada perubahan kuota

            // 4. Update data absensi
            const updatedAttendance = await prisma.attendance.update({
                where: { id: parseInt(attendanceId) },
                data: {
                    status,
                    notes,
                    markedAt: new Date()
                }
            });

            res.json({ success: true, message: "Absensi berhasil diupdate", data: updatedAttendance });
        } catch (error) {
            next(error);
        }
    }

    static async getLessonAttendance(req, res, next) {
        try {
            const { lessonId } = req.params;
            const attendances = await prisma.attendance.findMany({
                where: { scheduleId: parseInt(lessonId) },
                include: { student: true, studentPackage: true }
            });
            res.json({ success: true, data: attendances });
        } catch (error) {
            next(error);
        }
    }
}

export default AttendanceController;
