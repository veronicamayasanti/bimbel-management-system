import ProgramPackageModel from "../models/programPackageModel.js";

class ProgramPackageService {
    static async getAllPackages(programId) {
        return await ProgramPackageModel.findAll(programId);
    }

    static async getPackageById(id) {
        return await ProgramPackageModel.findById(id);
    }

    static async createPackage(data) {
        return await ProgramPackageModel.create(data);
    }

    static async updatePackage(id, data) {
        return await ProgramPackageModel.update(id, data);
    }

    static async deletePackage(id) {
        return await ProgramPackageModel.delete(id);
    }
}

export default ProgramPackageService;
