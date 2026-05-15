import ScheduleService from "../services/scheduleService.js";

class ScheduleController {
    // Master Jadwal Rutin
    static async createRecurring(req, res, next) {
        try {
            const { teacherId, programId, branchId, dayOfWeek, startTime, endTime, studentIds, levelIds } = req.body;
            
            const recurring = await ScheduleService.createRecurring({
                teacherId: parseInt(teacherId),
                programId: parseInt(programId),
                branchId: parseInt(branchId),
                dayOfWeek: parseInt(dayOfWeek),
                startTime,
                endTime
            }, studentIds, levelIds);

            res.status(201).json({ success: true, data: recurring });
        } catch (error) {
            next(error);
        }
    }

    static async getAllRecurring(req, res, next) {
        try {
            const recurring = await ScheduleService.getAllRecurring();
            res.json({ success: true, data: recurring });
        } catch (error) {
            next(error);
        }
    }

    static async updateRecurring(req, res, next) {
        try {
            const { id } = req.params;
            const { teacherId, programId, branchId, dayOfWeek, startTime, endTime, studentIds, levelIds } = req.body;

            const updated = await ScheduleService.updateRecurring(id, {
                teacherId: parseInt(teacherId),
                programId: parseInt(programId),
                branchId: parseInt(branchId),
                dayOfWeek: parseInt(dayOfWeek),
                startTime,
                endTime
            }, studentIds, levelIds);

            res.json({ success: true, data: updated });
        } catch (error) {
            next(error);
        }
    }

    static async deleteRecurring(req, res, next) {
        try {
            const { id } = req.params;
            await ScheduleService.deleteRecurring(id);
            res.json({ success: true, message: "Jadwal rutin berhasil dihapus" });
        } catch (error) {
            next(error);
        }
    }

    // Generate Sesi Harian dari Jadwal Rutin
    static async generateSessions(req, res, next) {
        try {
            const { startDate, endDate } = req.body;
            const createdCount = await ScheduleService.generateSessions(startDate, endDate);
            res.json({ success: true, message: `${createdCount} sesi berhasil digenerate` });
        } catch (error) {
            next(error);
        }
    }

    static async getDailyLessons(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            const role = req.user.role;
            const teacherId = role === 'teacher' ? req.user.id : null;

            const lessons = await ScheduleService.getDailyLessons(startDate, endDate, teacherId);
            res.json({ success: true, data: lessons });
        } catch (error) {
            next(error);
        }
    }

    static async getStudentsByProgram(req, res, next) {
        try {
            const { programId } = req.params;
            const { branchId, levelIds } = req.query;
            const rawLevels = req.query.levelIds || req.query['levelIds[]'];
            
            const students = await ScheduleService.getStudentsForSchedule(programId, branchId, rawLevels);

            res.json({ success: true, data: students });
        } catch (error) {
            next(error);
        }
    }
}

export default ScheduleController;
