import multer from 'multer';
import path from 'path';

// 1. Atur lokasi penyimpanan dan penamaan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Simpan di folder kita
    },
    filename: (req, file, cb) => {
        // Beri nama unik: IDUser-TanggalUpload.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. Filter agar HANYA MENERIMA gambar
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Gagal! Hanya diperbolehkan file gambar (JPG, PNG, WEBP)"));
    }
};

// 3. Ekspor middleware (Batas maksimal ukuran foto = 2 MB)
export const uploadAvatarMiddleware = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: fileFilter
});
