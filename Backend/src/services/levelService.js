import LevelModel from "../models/levelModel.js";

class LevelService {
    static async getAllLevels(search = "") {
        return await LevelModel.findAll(search);
    }

    static async getLevelById(id) {
        return await LevelModel.findById(id);
    }

    static async createLevel(data) {
        return await LevelModel.create(data);
    }

    static async updateLevel(id, data) {
        return await LevelModel.update(id, data);
    }

    static async deleteLevel(id) {
        return await LevelModel.delete(id);
    }
}

export default LevelService;
