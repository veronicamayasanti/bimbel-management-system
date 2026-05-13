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

// Validasi untuk Cabang (Branch)
export const validateBranch = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama cabang tidak boleh kosong')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Nama cabang hanya boleh berisi huruf dan spasi'),
        
        
    body('address')
        .trim()
        .notEmpty().withMessage('Alamat cabang tidak boleh kosong dan wajib diisi')
];

// Validasi untuk Program
export const validateProgram = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama program tidak boleh kosong')
        .matches(/[a-zA-Z]/).withMessage('Nama program harus mengandung huruf'),
        
    body('description')
        .trim()
        .notEmpty().withMessage('Deskripsi program tidak boleh kosong')
];

// Validasi untuk Level
export const validateLevel = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama level tidak boleh kosong atau hanya berisi spasi')
        .matches(/[a-zA-Z]/).withMessage('Nama level harus mengandung huruf')
];

// Validasi untuk Student
export const validateStudent = [
    body('branchId')
        .notEmpty().withMessage('Cabang (Branch) wajib dipilih')
        .isInt().withMessage('ID Cabang harus berupa angka'),

    body('levelId')
        .notEmpty().withMessage('Tingkat Kelas (Level) wajib dipilih')
        .isInt().withMessage('ID Level harus berupa angka'),

    body('fullName')
        .trim()
        .notEmpty().withMessage('Nama lengkap siswa tidak boleh kosong')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Nama lengkap hanya boleh berisi huruf dan spasi'),

    body('schoolName')
        .trim()
        .notEmpty().withMessage('Nama sekolah tidak boleh kosong')
];
