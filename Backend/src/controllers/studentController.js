import StudentService from "../services/studentService.js";

class StudentController {
    /**
     * Create a new student.
     * Only 'user' (parent) can create a student for themselves.
     */
    static async createStudent(req, res, next) {
        try {
            // Admins shouldn't create students directly through this parent endpoint
            if (req.user.role === 'admin') {
                return res.status(403).json({ message: "Forbidden: Admins cannot create students from this endpoint. Only parents can." });
            }

            // The parent ID comes securely from the auth token
            const parentId = req.user.id;
            const { branchId, levelId, fullName, schoolName } = req.body;

            const newStudent = await StudentService.createStudent({
                parentId,
                branchId: parseInt(branchId),
                levelId: parseInt(levelId),
                fullName,
                schoolName
            });

            res.status(201).json({
                success: true,
                message: "Data siswa berhasil ditambahkan",
                data: newStudent
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get students list.
     * Admin sees all, Parent sees only their own.
     */
    static async getStudents(req, res, next) {
        try {
            if (req.user.role === 'admin') {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                
                // Only pass filters that actually have values
                const filters = {};
                if (req.query.search) filters.search = req.query.search;
                if (req.query.branchId) filters.branchId = req.query.branchId;
                if (req.query.levelId) filters.levelId = req.query.levelId;
                
                const { students, total } = await StudentService.getAllStudents(page, limit, filters);
                
                return res.status(200).json({
                    success: true,
                    data: students,
                    pagination: {
                        total,
                        page,
                        limit,
                        totalPages: Math.ceil(total / limit)
                    }
                });
            } else {
                const search = req.query.search || "";
                const students = await StudentService.getStudentsByParent(req.user.id, search);
                return res.status(200).json({
                    success: true,
                    data: students
                });
            }
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a specific student by ID.
     */
    static async getStudentById(req, res, next) {
        try {
            const { id } = req.params;
            const student = await StudentService.getStudentById(id);

            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            // If user is not admin, ensure they own this student
            if (req.user.role !== 'admin' && student.parentId !== req.user.id) {
                return res.status(403).json({ message: "Forbidden: You don't have permission to access this student" });
            }

            res.status(200).json({
                success: true,
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update a student.
     * Only the parent that owns this student can update it.
     */
    static async updateStudent(req, res, next) {
        try {
            if (req.user.role === 'admin') {
                return res.status(403).json({ message: "Forbidden: Admins cannot update student data directly." });
            }

            const { id } = req.params;
            const student = await StudentService.getStudentById(id);

            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            // Ensure the student belongs to the logged-in parent
            if (student.parentId !== req.user.id) {
                return res.status(403).json({ message: "Forbidden: You can only update your own student data." });
            }

            const { branchId, levelId, fullName, schoolName } = req.body;

            const updatedStudent = await StudentService.updateStudent(id, {
                branchId: parseInt(branchId),
                levelId: parseInt(levelId),
                fullName,
                schoolName
            });

            res.status(200).json({
                success: true,
                message: "Data siswa berhasil diubah",
                data: updatedStudent
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete a student.
     * Only the parent that owns this student can delete it.
     */
    static async deleteStudent(req, res, next) {
        try {
            if (req.user.role === 'admin') {
                return res.status(403).json({ message: "Forbidden: Admins cannot delete student data directly." });
            }

            const { id } = req.params;
            const student = await StudentService.getStudentById(id);

            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            // Ensure the student belongs to the logged-in parent
            if (student.parentId !== req.user.id) {
                return res.status(403).json({ message: "Forbidden: You can only delete your own student data." });
            }

            await StudentService.deleteStudent(id);

            res.status(200).json({
                success: true,
                message: "Data siswa berhasil dihapus"
            });
        } catch (error) {
            next(error);
        }
    }
}

export default StudentController;
