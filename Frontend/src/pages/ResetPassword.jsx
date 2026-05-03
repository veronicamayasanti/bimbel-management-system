import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Ambil token dari URL query string (misal: ?token=abc123xyz)
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
        } else {
            toast.error('Token tidak ditemukan! Tautan tidak valid.');
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return toast.error('Tautan tidak valid (Token hilang)');

        if (newPassword !== confirmPassword) {
            return toast.error('Password baru dan konfirmasi tidak cocok!');
        }

        setLoading(true);

        try {
            // Panggil API Backend
            const response = await axiosInstance.post(`/auth/reset-password/${token}`, { newPassword });
            toast.success(response.data.message || 'Password berhasil diubah!');

            // Arahkan ke halaman login secara otomatis setelah sukses
            setTimeout(() => navigate('/login'), 2500);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal mengubah password. Token mungkin sudah kadaluarsa.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4 font-sans">
            <Toaster position="top-right" />

            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        {/* Ikon Gembok Terbuka Sederhana */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Buat Password Baru</h1>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                        Silakan masukkan password baru Anda. Pastikan Anda mengingatnya kali ini!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password Baru</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-gray-50 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-gray-50 outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !newPassword || !confirmPassword || !token}
                        className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                    <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                        Batal & Kembali ke Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
