import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-5xl font-extrabold text-indigo-900 mb-4">
                Bimbel<span className="text-indigo-500">Pro</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Sistem manajemen bimbingan belajar terbaik. Atur siswa, kelas, dan pembayaran dalam satu tempat.
            </p>

            <div className="flex gap-4">
                <Link
                    to="/login"
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all"
                >
                    Masuk ke Aplikasi
                </Link>
            </div>
        </div>
    );
};

export default Home;
