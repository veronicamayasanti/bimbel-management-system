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

export const validateUpdateUser = [
    // optional() artinya: Boleh tidak dikirim. Tapi kalau dikirim, harus dicek.
    body('full_name')
        .optional()
        .trim()
        .notEmpty().withMessage('Nama lengkap tidak boleh kosong')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Nama lengkap hanya boleh berisi huruf dan spasi'),

    body('email')
        .optional()
        .isEmail().withMessage('Format email tidak valid'),

    body('telp_no')
        .optional()
        .isNumeric().withMessage('Nomor HP hanya boleh berisi angka')
        .isLength({ min: 10, max: 15 }).withMessage('Nomor HP harus antara 10 hingga 15 digit'),


];
