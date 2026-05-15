/*
 * Copyright (c) 2026.
 * Project: Bimbel Manajemen Sistem
 * Author: Veronica Maya Santi
 * Github: https://github.com/veronicamayasanti
 * Email: veronicamayasanti@gmail.com
 */

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import cors from 'cors';
import branchRoutes from './routes/branchRoutes.js';
import programRoutes from './routes/programRoutes.js';
import programPackageRoutes from './routes/programPackageRoutes.js';
import levelRoutes from './routes/levelRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';

dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/program-packages", programPackageRoutes);
app.use("/api/levels", levelRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/schedules", scheduleRoutes);

app.use(errorMiddleware);

const port = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Failed to start server:", err);
});


