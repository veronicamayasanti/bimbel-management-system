import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { BookOpen, Calendar, CheckCircle, Clock, User } from 'lucide-react';

const DashboardHome = () => {
    const { user } = useOutletContext();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            if (user.role === 'user') { // Hanya untuk Wali Murid
                try {
                    setLoading(true);
                    const res = await axiosInstance.get('/students');
                    setStudents(res.data.data);
                } catch (error) {
                    console.error("Gagal mengambil data siswa:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchStudents();
    }, [user.role]);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Selamat Pagi' : hour < 18 ? 'Selamat Siang' : 'Selamat Malam';

    // Flatten all active packages from all students
    const activePackages = students.flatMap(student => 
        (student.studentPackages || []).map(pkg => ({
            ...pkg,
            studentName: student.fullName
        }))
    ).filter(pkg => pkg.status === 'ACTIVE');

    return (
        <div className="space-y-6">
            {/* 1. BANNER UTAMA */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-20 -mb-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold mb-2">{greeting}, {user.fullName || user.full_name}! 👋</h1>
                    <p className="text-indigo-100 text-lg max-w-xl">
                        {user.role === 'admin'
                            ? 'Selamat datang di Panel Kontrol Administrator. Anda memegang kendali penuh atas sistem BimbelPro hari ini.'
                            : user.role === 'teacher'
                            ? 'Selamat datang, Guru! Semangat mengajar hari ini. Jangan lupa cek jadwal dan isi absensi murid Anda.'
                            : 'Selamat datang di portal siswa BimbelPro. Tetap semangat belajar dan raih cita-citamu!'}
                    </p>
                </div>
            </div>

            {/* 2. PAKET BELAJAR AKTIF (Khusus Wali Murid saja) */}
            {user.role === 'user' && (
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <BookOpen className="text-indigo-600" size={24} />
                            Paket Belajar Aktif
                        </h2>
                        <Link to="/students" className="text-indigo-600 text-sm font-semibold hover:underline">Lihat Semua Siswa</Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2].map(i => (
                                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-40"></div>
                            ))}
                        </div>
                    ) : activePackages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activePackages.map((pkg) => (
                                <div key={pkg.id} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-indigo-50 hover:border-indigo-200 transition-all relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3">
                                        <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Aktif
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{pkg.programPackage?.name}</h3>
                                    <p className="text-sm text-indigo-600 font-medium mb-4 flex items-center gap-1">
                                        <User size={14} /> {pkg.studentName}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Sisa Pertemuan</p>
                                            <p className="text-2xl font-black text-indigo-700">{pkg.remainingMeetings} <span className="text-sm font-normal text-gray-400">/ {pkg.totalMeetings}</span></p>
                                        </div>
                                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                            <Calendar size={24} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-indigo-50/50 rounded-2xl p-8 text-center border-2 border-dashed border-indigo-100">
                            <Clock className="mx-auto text-indigo-300 mb-3" size={40} />
                            <p className="text-gray-600 font-medium">Belum ada paket belajar yang aktif.</p>
                            <Link to="/students" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all">
                                Pilih & Beli Paket
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* 3. KARTU INFORMASI SINGKAT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl font-bold">✓</div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Status Akun</p>
                        <h3 className="text-xl font-bold text-gray-800">Aktif</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl">👤</div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tipe Pengguna</p>
                        <h3 className="text-xl font-bold text-gray-800 capitalize">{user.role}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl">📅</div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Bergabung Sejak</p>
                        <h3 className="text-lg font-bold text-gray-800">
                            {new Date(user.created_at || Date.now()).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        </h3>
                    </div>
                </div>
            </div>

            {/* 4. PAPAN PENGUMUMAN */}
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
