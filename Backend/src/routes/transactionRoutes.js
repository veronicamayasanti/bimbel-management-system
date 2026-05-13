import express from "express";
import TransactionController from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadAvatarMiddleware as upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, TransactionController.getAllTransactions);
router.get("/:id", authMiddleware, TransactionController.getTransactionById);
router.post("/", authMiddleware, upload.single('paymentProof'), TransactionController.createTransaction);
router.put("/:id/verify", authMiddleware, TransactionController.verifyTransaction);
router.put("/:id/reject", authMiddleware, TransactionController.rejectTransaction);

export default router;
