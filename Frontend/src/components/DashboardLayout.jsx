import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Toaster } from 'react-hot-toast';


const DashboardLayout = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Memanggil API GET /me saat halaman pertama kali dimuat
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('/users/me');
                setUser(response.data.user);
            } catch (error) {
                // Jika token tidak valid / belum login, tendang ke halaman login
                localStorage.removeItem('token');
                navigate('/login');
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Tampilkan layar loading selama data belum didapat
    if (!user) return <div className="min-h-screen flex items-center justify-center font-bold text-xl text-indigo-600 animate-pulse">Memuat Data...</div>;

    return (
        <div className="flex h-screen bg-slate-50">

            {/* Sidebar Kiri */}
            <div className="w-64 bg-indigo-900 text-white flex flex-col shadow-xl">
                <div className="p-6 text-center border-b border-indigo-800">
                    <h2 className="text-2xl font-bold tracking-wider">Bimbel<span className="text-indigo-400">Pro</span></h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/dashboard" className="block px-4 py-3 rounded-lg hover:bg-indigo-800 transition-colors">🏠 Beranda</Link>
                    <Link to="/dashboard/profile" className="block px-4 py-3 rounded-lg hover:bg-indigo-800 transition-colors">👤 Profil Saya</Link>

                    {/* Menu Manajemen User HANYA muncul jika yang login adalah admin */}
                    {user.role === 'admin' && (
                        <Link to="/dashboard/users" className="block px-4 py-3 rounded-lg hover:bg-indigo-800 transition-colors">👥 Manajemen Akun</Link>
                    )}
                </nav>

                <div className="p-4 border-t border-indigo-800">
                    <button onClick={handleLogout} className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-medium">
                        🚪 Keluar
                    </button>
                </div>
            </div>

            {/* Area Konten Utama */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header Atas */}
                <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center z-10">
                    <h1 className="text-xl font-semibold text-gray-800">Dashboard Anda</h1>

                    {/* Menampilkan Nama dan Foto Profil */}
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-700">{user.full_name}</span>
                        <img
                            src={user.avatar ? `http://localhost:3000/uploads/${user.avatar}` : 'http://localhost:3000/uploads/avatar_default.png'}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full border-2 border-indigo-200 object-cover"
                        />
                    </div>
                </header>

                {/* Konten Halaman yang akan berubah-ubah (Dinamis) */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet context={{ user, setUser }} />
                    <Toaster position="top-right" />
                </main>

            </div>
        </div>
    );
};

export default DashboardLayout;
