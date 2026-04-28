import request from 'supertest';
import { describe, it, expect } from 'vitest';

// Kita mengelompokkan tes untuk fitur User
describe('User API Tests', () => {

    // Ini adalah 1 skenario tes
    it('Harus gagal (401) saat mencoba GET All Users TANPA Token', async () => {

        // Komputer (Supertest) akan mencoba menembak API Anda seolah-olah dia adalah Postman
        const response = await request('http://localhost:3000').get('/api/users');

        // Kita "berharap" (expect) server menolaknya karena tidak ada token
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized: No token provided");
    });

});
