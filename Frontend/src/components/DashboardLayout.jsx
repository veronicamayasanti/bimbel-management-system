import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { API_BASE_URL } from '../api/axiosInstance';
import { Toaster } from 'react-hot-toast';
import { Menu, X, Home, User as UserIcon, GraduationCap, Receipt, BookOpen, CheckSquare, Users, Presentation, Calendar, MapPin, School, LogOut, AlertCircle } from 'lucide-react';

// Mapping pathname → judul halaman untuk header
const PAGE_TITLES = {
    '/dashboard': 'Selamat Datang',
    '/dashboard/profile': 'Profil Saya',
    '/dashboard/students': 'Manajemen Siswa',
    '/dashboard/teachers': 'Manajemen Guru',
    '/dashboard/users': 'Manajemen Akun',
    '/dashboard/branches': 'Manajemen Cabang',
    '/dashboard/levels': 'Manajemen Level',
    '/dashboard/programs': 'Program Belajar',
    '/dashboard/transactions': 'Transaksi & Pembayaran',
    '/dashboard/schedules': 'Master Jadwal',
    '/dashboard/attendance': 'Absensi',
};

// Komponen dialog konfirmasi logout
const LogoutConfirmDialog = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-50 rounded-xl">
                    <AlertCircle className="text-red-500 w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">Konfirmasi Keluar</h4>
                    <p className="text-sm text-gray-500">Yakin ingin keluar dari aplikasi?</p>
                </div>
            </div>
            <div className="flex gap-3 mt-5">
                <button onClick={onCancel} className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl font-semibold text-gray-700 hover:bg-gray-200 transition-colors text-sm">
                    Batal
                </button>
                <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors text-sm">
                    Ya, Keluar
                </button>
            </div>
        </div>
    </div>
);

const DashboardLayout = () => {
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Memanggil API GET /me saat halaman pertama kali dimuat
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('/users/me');
                setUser(response.data.user);
            } catch (error) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        };
        fetchProfile();
    }, [navigate]);

    // Tutup sidebar otomatis saat pindah rute di mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        setShowLogoutDialog(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center font-bold text-xl text-indigo-600 animate-pulse">Memuat Data...</div>;

    // Judul halaman dinamis berdasarkan pathname
    const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

    const navItems = [
        { to: "/dashboard", icon: <Home size={20} />, label: "Beranda" },
        { to: "/dashboard/profile", icon: <UserIcon size={20} />, label: "Profil Saya" },
    ];

    const parentItems = [
        { to: "/dashboard/students", icon: <GraduationCap size={20} />, label: "Data Anak / Siswa" },
        { to: "/dashboard/transactions", icon: <Receipt size={20} />, label: "Transaksi" },
    ];

    const commonItems = [
        { to: "/dashboard/programs", icon: <BookOpen size={20} />, label: "Program" },
    ];

    const adminTeacherItems = [
        { to: "/dashboard/attendance", icon: <CheckSquare size={20} />, label: "Absensi" },
    ];

    const adminManagementItems = [
        { to: "/dashboard/users", icon: <Users size={20} />, label: "Akun User" },
        { to: "/dashboard/students", icon: <GraduationCap size={20} />, label: "Data Siswa" },
        { to: "/dashboard/teachers", icon: <Presentation size={20} />, label: "Guru" },
        { to: "/dashboard/schedules", icon: <Calendar size={20} />, label: "Master Jadwal" },
        { to: "/dashboard/branches", icon: <MapPin size={20} />, label: "Cabang" },
        { to: "/dashboard/levels", icon: <School size={20} />, label: "Level Kelas" },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Dialog Konfirmasi Logout */}
            {showLogoutDialog && (
                <LogoutConfirmDialog
                    onConfirm={confirmLogout}
                    onCancel={() => setShowLogoutDialog(false)}
                />
            )}

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-indigo-950/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Kiri */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-indigo-950 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 flex items-center justify-between border-b border-indigo-900/50">
                    <h2 className="text-2xl font-black tracking-tight font-['Lexend']">Bimbel<span className="text-indigo-400">Pro</span></h2>
                    <button className="md:hidden p-2 hover:bg-indigo-900 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {navItems.map(item => (
                        <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.to ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-indigo-200 hover:bg-indigo-900/50 hover:text-white'}`}>
                            {item.icon}
                            <span className="font-semibold text-sm">{item.label}</span>
                        </Link>
                    ))}

                    {user.role === 'user' && parentItems.map(item => (
                        <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.to ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-indigo-200 hover:bg-indigo-900/50 hover:text-white'}`}>
                            {item.icon}
                            <span className="font-semibold text-sm">{item.label}</span>
                        </Link>
                    ))}

                    {commonItems.map(item => (
                        <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.to ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-indigo-200 hover:bg-indigo-900/50 hover:text-white'}`}>
                            {item.icon}
                            <span className="font-semibold text-sm">{item.label}</span>
                        </Link>
                    ))}

                    {(user.role === 'admin' || user.role === 'teacher') && adminTeacherItems.map(item => (
                        <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.to ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-indigo-200 hover:bg-indigo-900/50 hover:text-white'}`}>
                            {item.icon}
                            <span className="font-semibold text-sm">{item.label}</span>
                        </Link>
                    ))}

                    {user.role === 'admin' && (
                        <>
                            <div className="pt-6 pb-2 px-4 text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Sistem Manajemen</div>
                            {adminManagementItems.map(item => (
                                <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.to ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-indigo-200 hover:bg-indigo-900/50 hover:text-white'}`}>
                                    {item.icon}
                                    <span className="font-semibold text-sm">{item.label}</span>
                                </Link>
                            ))}
                        </>
                    )}
                </nav>

                <div className="p-4 mt-auto">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200 font-bold text-sm">
                        <LogOut size={18} />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Area Konten Utama */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header Atas */}
                <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 flex justify-between items-center z-30 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button 
                            className="md:hidden p-2 text-indigo-900 hover:bg-slate-100 rounded-xl transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-base md:text-xl font-bold text-slate-800 line-clamp-1">
                            {pageTitle}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 leading-tight">{user.full_name}</p>
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{user.role}</p>
                        </div>
                        <div className="relative group">
                            <img
                                src={user.avatar ? `${API_BASE_URL}/uploads/${user.avatar}` : `${API_BASE_URL}/uploads/avatar_default.png`}
                                alt="Avatar"
                                className="w-10 h-10 md:w-12 md:h-12 rounded-2xl border-2 border-white shadow-sm object-cover group-hover:scale-105 transition-transform cursor-pointer"
                            />
                        </div>
                    </div>
                </header>

                {/* Konten Halaman */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto">
                        <Outlet context={{ user, setUser }} />
                    </div>
                    <Toaster 
                        position="top-right"
                        toastOptions={{
                            className: 'font-semibold text-sm',
                            duration: 4000,
                        }}
                    />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
