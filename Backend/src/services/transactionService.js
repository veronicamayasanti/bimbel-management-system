import TransactionModel from "../models/transactionModel.js";

class TransactionService {
    static async getAllTransactions(filters) {
        return await TransactionModel.findAll(filters);
    }

    static async getTransactionById(id) {
        return await TransactionModel.findById(id);
    }

    static async createTransaction(data) {
        return await TransactionModel.create(data);
    }

    static async verifyTransaction(id, adminId) {
        return await TransactionModel.verify(id, adminId);
    }

    static async rejectTransaction(id, adminId, notes) {
        return await TransactionModel.reject(id, adminId, notes);
    }
}

export default TransactionService;
