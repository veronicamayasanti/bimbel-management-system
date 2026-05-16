import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BimbelPro Management System API',
            version: '1.0.0',
            description: `
## API Documentation — Bimbel Management System

Sistem manajemen bimbel belajar dengan fitur lengkap: autentikasi multi-role, manajemen siswa, jadwal, absensi, dan transaksi.

### Role Pengguna
| Role | Deskripsi |
|------|-----------|
| \`admin\` | Akses penuh ke seluruh sistem |
| \`teacher\` | Akses ke jadwal dan absensi |
| \`user\` | Orang tua — akses ke data anak dan transaksi |

### Cara Autentikasi
1. Login via \`POST /api/auth/login\`, \`/api/auth/login/admin\`, atau \`/api/auth/login/teacher\`
2. Salin **token** dari respons
3. Klik tombol **Authorize** di atas, isi: \`Bearer <token_anda>\`
            `,
            contact: {
                name: 'Veronica Maya Santi',
                email: 'veronicamayasanti@gmail.com',
                url: 'https://github.com/veronicamayasanti/bimbel-management-system'
            }
        },
        servers: [
            {
                url: process.env.BACKEND_URL || 'http://localhost:3000',
                description: 'Development Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Masukkan token JWT Anda: Bearer <token>'
                }
            },
            schemas: {
                // ====== AUTH ======
                LoginUserRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'orang_tua@gmail.com' },
                        password: { type: 'string', example: 'password123' }
                    }
                },
                LoginAdminRequest: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: { type: 'string', example: 'admin' },
                        password: { type: 'string', example: 'password123' }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Login berhasil' },
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                        role: { type: 'string', example: 'admin' }
                    }
                },
                // ====== USER ======
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'uuid-xxxx' },
                        full_name: { type: 'string', example: 'Budi Santoso' },
                        email: { type: 'string', example: 'budi@example.com' },
                        telp_no: { type: 'string', example: '08123456789' },
                        address: { type: 'string', example: 'Jl. Merdeka No. 1' },
                        avatar: { type: 'string', example: 'avatar_default.png' },
                        isActive: { type: 'boolean', example: true },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                CreateUserRequest: {
                    type: 'object',
                    required: ['full_name', 'email', 'password', 'telp_no'],
                    properties: {
                        full_name: { type: 'string', example: 'Budi Santoso' },
                        email: { type: 'string', example: 'budi@example.com' },
                        password: { type: 'string', minLength: 6, example: 'password123' },
                        telp_no: { type: 'string', example: '08123456789' },
                        address: { type: 'string', example: 'Jl. Merdeka No. 1' }
                    }
                },
                // ====== BRANCH ======
                Branch: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Cabang Jakarta Selatan' },
                        address: { type: 'string', example: 'Jl. Sudirman No. 10, Jakarta' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                BranchRequest: {
                    type: 'object',
                    required: ['name', 'address'],
                    properties: {
                        name: { type: 'string', example: 'Cabang Jakarta Selatan' },
                        address: { type: 'string', example: 'Jl. Sudirman No. 10, Jakarta' }
                    }
                },
                // ====== STUDENT ======
                Student: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        fullName: { type: 'string', example: 'Andi Pratama' },
                        schoolName: { type: 'string', example: 'SMA Negeri 1 Jakarta' },
                        branchId: { type: 'integer', example: 1 },
                        levelId: { type: 'integer', example: 2 },
                        branch: { $ref: '#/components/schemas/Branch' },
                        level: { $ref: '#/components/schemas/Level' }
                    }
                },
                StudentRequest: {
                    type: 'object',
                    required: ['fullName', 'schoolName', 'branchId', 'levelId'],
                    properties: {
                        fullName: { type: 'string', example: 'Andi Pratama' },
                        schoolName: { type: 'string', example: 'SMA Negeri 1 Jakarta' },
                        branchId: { type: 'integer', example: 1 },
                        levelId: { type: 'integer', example: 2 }
                    }
                },
                // ====== LEVEL ======
                Level: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'SMA Kelas 12' }
                    }
                },
                // ====== PROGRAM ======
                Program: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Matematika Intensif' },
                        description: { type: 'string', example: 'Program persiapan ujian nasional' }
                    }
                },
                // ====== TRANSACTION ======
                Transaction: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'uuid-txn' },
                        studentId: { type: 'integer', example: 1 },
                        programPackageId: { type: 'integer', example: 3 },
                        amount: { type: 'number', example: 1500000 },
                        paymentMethod: { type: 'string', enum: ['TRANSFER', 'CASH'] },
                        paymentStatus: { type: 'string', enum: ['PENDING', 'VERIFIED', 'REJECTED'] },
                        paymentProof: { type: 'string', example: 'bukti_transfer.jpg' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                // ====== GENERIC RESPONSES ======
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Operasi berhasil' },
                        data: { type: 'object' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Terjadi kesalahan' }
                    }
                },
                PaginatedResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: { type: 'array', items: { type: 'object' } },
                        pagination: {
                            type: 'object',
                            properties: {
                                total: { type: 'integer', example: 100 },
                                page: { type: 'integer', example: 1 },
                                limit: { type: 'integer', example: 10 },
                                totalPages: { type: 'integer', example: 10 }
                            }
                        }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Auth', description: 'Autentikasi & Manajemen Token' },
            { name: 'Users', description: 'Manajemen Akun Orang Tua / User' },
            { name: 'Students', description: 'Manajemen Data Siswa' },
            { name: 'Branches', description: 'Manajemen Cabang Bimbel' },
            { name: 'Levels', description: 'Manajemen Tingkat Kelas' },
            { name: 'Programs', description: 'Manajemen Program Belajar' },
            { name: 'Teachers', description: 'Manajemen Guru / Pengajar' },
            { name: 'Transactions', description: 'Manajemen Transaksi & Pembayaran' },
            { name: 'Schedules', description: 'Manajemen Jadwal Pelajaran' },
            { name: 'Attendance', description: 'Manajemen Absensi Siswa' }
        ]
    },
    apis: ['./src/routes/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);
