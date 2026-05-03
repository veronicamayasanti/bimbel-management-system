import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Panggil API Backend (Tanpa perlu Token Auth)
            const response = await axiosInstance.post('/auth/forgot-password', { email });
            toast.success(response.data.message || 'Tautan reset password telah dikirim!');
            setEmail(''); // Kosongkan input setelah sukses
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal mengirim email reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4 font-sans">
            {/* Pasang Toaster khusus untuk halaman ini karena berada di luar DashboardLayout */}
            <Toaster position="top-right" />

            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        {/* Ikon Kunci/Gembok Sederhana */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Lupa Password?</h1>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                        Jangan khawatir! Masukkan email yang terdaftar dan kami akan mengirimkan tautan untuk membuat password baru.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Anda</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="contoh@email.com"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-gray-50 outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Memproses...' : 'Kirim Tautan Reset'}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                    <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
                        &larr; Kembali ke halaman Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
