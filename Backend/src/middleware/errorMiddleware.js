import { Prisma } from "@prisma/client";

const errorMiddleware = (err, req, res, next) => {
    console.error("🔥 Error Captured:", err.message || err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 409; // Conflict
            message = "Data yang dimasukkan sudah ada (Unique Constraint Violation).";
        } else if (err.code === 'P2025') {
            statusCode = 404; // Not Found
            message = "Data yang dicari atau akan diupdate/hapus tidak ditemukan.";
        } else {
            statusCode = 400; // Bad Request
            message = `Database Error: ${err.message}`;
        }
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
}

export default errorMiddleware;