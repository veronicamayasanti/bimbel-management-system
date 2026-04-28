import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validasi input gagal",
            errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
        });
    }
    next();
};

// 2. Aturan untuk Membuat User Baru (Create User)
export const validateCreateUser = [
    body('full_name')
        .trim()
        .notEmpty().withMessage('Nama lengkap wajib diisi')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Nama lengkap hanya boleh berisi huruf dan spasi'),

    body('email')
        .notEmpty().withMessage('Email wajib diisi')
        .isEmail().withMessage('Format email tidak valid'),

    body('password')
        .notEmpty().withMessage('Password wajib diisi')
        .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),

    body('telp_no')
        .notEmpty().withMessage('Nomor HP wajib diisi')
        .isNumeric().withMessage('Nomor HP hanya boleh berisi angka')
        .isLength({ min: 10, max: 15 }).withMessage('Nomor HP harus antara 10 hingga 15 digit'),
];
