import BranchModel from "../models/branchModel.js";

class BranchService {
    static async getAllBranches(search = "") {
        return await BranchModel.findAll(search);
    }

    static async getBranchById(id) {
        return await BranchModel.findById(id);
    }

    static async createBranch(data) {
        return await BranchModel.create(data);
    }

    static async updateBranch(id, data) {
        return await BranchModel.update(id, data);
    }

    static async deleteBranch(id) {
        return await BranchModel.delete(id);
    }
}

export default BranchService;
