import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // 1. Buat "Transporter" (Kendaraan pengirim email)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // 2. Tentukan isi emailnya
    const mailOptions = {
        from: '"Bimbel Ms Kiki Admin" <admin@bimbelmskiki.com>', // Pengirim
        to: options.email, // Penerima (dari parameter)
        subject: options.subject,
        text: options.message
    };

    // 3. Kirim email
    const info = await transporter.sendMail(mailOptions);

    // 4. (Khusus Development) Tampilkan link untuk melihat email bohongan di terminal
    console.log("Email terkirim! Lihat emailnya di sini: %s", nodemailer.getTestMessageUrl(info));
};

export default sendEmail;
