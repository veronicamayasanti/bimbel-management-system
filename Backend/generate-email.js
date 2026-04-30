import nodemailer from 'nodemailer';

nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Gagal membuat akun:', err);
        return;
    }
    console.log('====== AKUN EMAIL BARU ANDA ======');
    console.log('EMAIL_USER=' + account.user);
    console.log('EMAIL_PASS=' + account.pass);
    console.log('==================================');
});
