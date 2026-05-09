import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        telp_no: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Memanggil endpoint create user public (tanpa auth)
            await axiosInstance.post('/users', formData);
            toast.success('Pendaftaran berhasil! Silakan login.');
            
            // Redirect ke halaman login setelah 2 detik
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err) {
            // Handle error dari express-validator atau error lain
            if (err.response?.data?.errors) {
                // Menampilkan error validasi pertama dari array
                toast.error(err.response.data.errors[0].message);
            } else {
                toast.error(err.response?.data?.message || 'Terjadi kesalahan saat mendaftar.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-white flex items-center justify-center p-4">
            <Toaster position="top-right" />
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-lg p-8 border border-white/50 my-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Buat Akun Baru ✨</h1>
                    <p className="text-gray-500 mt-2">Bergabung dengan Bimbel Management System</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 transition-all"
                            placeholder="Contoh: Budi Santoso"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 transition-all"
                            placeholder="budi@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 transition-all"
                            placeholder="Minimal 6 karakter"
                            minLength="6"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon / WA</label>
                        <input
                            type="tel"
                            name="telp_no"
                            value={formData.telp_no}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 transition-all"
                            placeholder="08123456789"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat (Opsional)</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 transition-all"
                            placeholder="Alamat lengkap Anda"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 mt-4 flex justify-center items-center rounded-xl text-white font-bold text-lg transition-all shadow-md hover:shadow-xl ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95'}`}
                    >
                        {loading ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-gray-200/60">
                    <p className="text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
