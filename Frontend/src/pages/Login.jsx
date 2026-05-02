import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Login = () => {
    const [identifier, setIdentifier] = useState(''); // Bisa berupa email atau username
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let response;

            // LOGIKA PINTAR: Jika mengandung '@' berarti User. Jika tidak, berarti Admin.
            if (identifier.includes('@')) {
                response = await axiosInstance.post('/auth/login', {
                    email: identifier,
                    password
                });
            } else {
                response = await axiosInstance.post('/auth/login/admin', {
                    username: identifier,
                    password
                });
            }

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat terhubung ke server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-white flex items-center justify-center p-4">
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-md p-8 border border-white/50">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Selamat Datang 👋</h1>
                    <p className="text-gray-500 mt-2">Bimbel Management System</p>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 animate-pulse">
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email / Username</label>
                        <input
                            type="text" // Ubah jadi text (bukan email) agar bisa diisi username
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50"
                            placeholder="maya@example.com ATAU admin123"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50"
                            placeholder="••••••••"
                            required
                        />
                        <div className="flex justify-end mt-1">
                            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Lupa Password?</a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 flex justify-center items-center rounded-xl text-white font-bold text-lg transition-all shadow-md hover:shadow-xl ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95'}`}
                    >
                        {loading ? 'Memproses...' : 'Masuk Sekarang'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
