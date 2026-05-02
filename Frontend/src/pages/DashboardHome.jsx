import React from 'react';
import { useOutletContext } from 'react-router-dom';

const DashboardHome = () => {
    const { user } = useOutletContext(); // Ambil data user yang sedang login

    // Membuat ucapan selamat Pagi/Siang/Malam otomatis sesuai jam komputer
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Selamat Pagi' : hour < 18 ? 'Selamat Siang' : 'Selamat Malam';

    return (
        <div className="space-y-6">

            {/* 1. BANNER UTAMA (Warna Gradien Mewah) */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                {/* Dekorasi Efek Cahaya di Latar Belakang */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-20 -mb-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold mb-2">{greeting}, {user.full_name}! 👋</h1>
                    <p className="text-indigo-100 text-lg max-w-xl">
                        {user.role === 'admin'
                            ? 'Selamat datang di Panel Kontrol Administrator. Anda memegang kendali penuh atas sistem BimbelPro hari ini.'
                            : 'Selamat datang di portal siswa BimbelPro. Tetap semangat belajar dan raih cita-citamu!'}
                    </p>
                </div>
            </div>

            {/* 2. KARTU INFORMASI SINGKAT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Kartu Status */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl font-bold">✓</div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Status Akun</p>
                        <h3 className="text-xl font-bold text-gray-800">Aktif</h3>
                    </div>
                </div>

                {/* Kartu Tipe Pengguna */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl">👤</div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tipe Pengguna</p>
                        <h3 className="text-xl font-bold text-gray-800 capitalize">{user.role}</h3>
                    </div>
                </div>

                {/* Kartu Tanggal Bergabung */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl">📅</div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Bergabung Sejak</p>
                        <h3 className="text-lg font-bold text-gray-800">
                            {/* Ubah format tanggal menjadi Bahasa Indonesia */}
                            {new Date(user.created_at || Date.now()).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        </h3>
                    </div>
                </div>

            </div>

            {/* 3. PAPAN PENGUMUMAN */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-4">📌 Papan Pengumuman</h2>

                {user.role === 'admin' ? (
                    <div className="text-gray-600 space-y-3">
                        <p>1. Jangan lupa untuk mengecek menu <span className="font-semibold text-indigo-600">Manajemen Akun</span> secara berkala.</p>
                        <p>2. Pastikan server Backend dan Database selalu dalam keadaan menyala.</p>
                    </div>
                ) : (
                    <div className="text-gray-600 space-y-3">
                        <p>🌟 Selamat bergabung di BimbelPro!</p>
                        <p>Segera lengkapi foto profil Anda di menu <span className="font-semibold text-indigo-600">Profil Saya</span> agar teman-teman dan guru bisa mengenali Anda.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default DashboardHome;
