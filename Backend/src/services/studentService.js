import StudentModel from "../models/studentModel.js";

class StudentService {
    /**
     * Create a new student for a parent
     */
    static async createStudent(data) {
        return StudentModel.create(data);
    }

    /**
     * Get all students (Admin use)
     */
    static async getAllStudents() {
        return StudentModel.findAll();
    }

    /**
     * Get students by parent ID (User use)
     */
    static async getStudentsByParent(parentId) {
        return StudentModel.findByParentId(parentId);
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
