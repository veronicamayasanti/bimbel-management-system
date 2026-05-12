import ProgramModel from "../models/programModel.js";

class ProgramService {
    static async getAllPrograms(search = "") {
        return await ProgramModel.findAll(search);
    }

    static async getProgramById(id) {
        return await ProgramModel.findById(id);
    }

    static async createProgram(data) {
        return await ProgramModel.create(data);
    }

    static async updateProgram(id, data) {
        return await ProgramModel.update(id, data);
    }

    static async deleteProgram(id) {
        return await ProgramModel.delete(id);
    }
}

export default ProgramService;
