import StudentModel from "../models/studentModel.js";

class StudentService {
    /**
     * Create a new student for a parent
     */
    static async createStudent(data) {
        return StudentModel.create(data);
    }

    /**
     * Get all students with pagination and filters (Admin use)
     */
    static async getAllStudents(page = 1, limit = 10, filters = {}) {
        const skip = (page - 1) * limit;
        const [students, total] = await Promise.all([
            StudentModel.findAll(skip, limit, filters),
            StudentModel.countAll(filters)
        ]);
        return { students, total };
    }

    /**
     * Get students by parent ID (User use)
     */
    static async getStudentsByParent(parentId, search = "") {
        return StudentModel.findByParentId(parentId, search);
    }

    /**
     * Get a single student by ID
     */
    static async getStudentById(id) {
        return StudentModel.findById(id);
    }

    /**
     * Update a student
     */
    static async updateStudent(id, data) {
        return StudentModel.update(id, data);
    }

    /**
     * Delete a student
     */
    static async deleteStudent(id) {
        return StudentModel.delete(id);
    }
}

export default StudentService;
