import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-[#f8f9fa] text-[#191c1d] font-['Plus_Jakarta_Sans',sans-serif]">
            {/* Inject CSS custom for symbols and fonts - menggunakan pendekatan standar React */}
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
                .font-lexend { font-family: 'Lexend', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                .btn-shadow { box-shadow: 0 4px 0 0 rgba(0, 30, 64, 0.2); }
                .btn-shadow:active { transform: translateY(2px); box-shadow: 0 2px 0 0 rgba(0, 30, 64, 0.2); }
                .card-soft-shadow { box-shadow: 0 10px 25px -5px rgba(0, 30, 64, 0.08); }
            `}} />

            {/* TopNavBar */}
            <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-sm shadow-blue-900/5">
                <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <img 
                            alt="Rumah Belajar Ms Kiki Logo" 
                            className="h-10 w-auto" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX6n8YUNF0Gc5k6Ppuy2HtsTmuJqHCmR3eBCNoh7rPj8pmNAVuZ0qNvwp3U9iP-KWYVglLw3p19oFM_75HbtGXH5hptVgjVqBQOAgBkc8aAanSHML-3xW7VDWW6MNo8PTxeKVjx9a-IB9S0gLAi8wH1TdrGpFtfd2uL9VSJNyyAG9ufyUGcF1cYj8uhUoerHTXTTLry2FY8exWSVuXs_sDDof0UP-mmQaHSgfI8d-7Ai4-WznDjiwSld_ueDMCMeR4iTdnyEXZPh8"
                        />
                        <span className="text-xl font-black text-blue-900 tracking-tight font-lexend">Rumah Belajar Ms Kiki</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 font-lexend font-medium text-base">
                        <a className="text-blue-900 font-bold border-b-2 border-yellow-400 pb-1" href="#">Home</a>
                        <a className="text-slate-600 hover:text-blue-800 transition-all duration-200" href="#">Programs</a>
                        <a className="text-slate-600 hover:text-blue-800 transition-all duration-200" href="#">Tutors</a>
                        <a className="text-slate-600 hover:text-blue-800 transition-all duration-200" href="#">Pricing</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        {/* Tombol Login diarahkan ke halaman /login */}
                        <Link to="/login" className="px-5 py-2.5 font-bold text-[#001e40] hover:bg-slate-50 rounded-lg transition-all active:scale-95">Login</Link>
                        <Link to="/register" className="px-6 py-2.5 bg-[#fcd400] text-[#001e40] font-bold rounded-xl btn-shadow transition-all active:scale-95 text-center">Register Now</Link>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-12 pb-20 px-6">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div className="z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d5e3ff] rounded-full mb-6">
                                <span className="material-symbols-outlined text-[#001e40] text-sm">auto_awesome</span>
                                <span className="text-[#001e40] font-bold text-sm">Pilihan Terbaik Orang Tua Cerdas</span>
                            </div>
                            <h1 className="font-lexend text-4xl md:text-5xl font-bold text-[#001e40] mb-6 leading-tight">Nurturing Curiosity through Academic Excellence.</h1>
                            <p className="text-lg text-[#43474f] mb-10 max-w-lg">Bimbingan belajar interaktif untuk tingkat TK hingga kelas 6 SD dengan metode yang menyenangkan, membuat anak lebih bersemangat dalam belajar.</p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/register" className="px-8 py-4 bg-[#001e40] text-white font-lexend font-semibold text-lg rounded-2xl flex items-center gap-3 btn-shadow active:scale-95 transition-all w-fit">
                                    Daftar Sekarang
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                                <button className="px-8 py-4 bg-white border-2 border-[#c3c6d1] text-[#001e40] font-lexend font-semibold text-lg rounded-2xl flex items-center gap-3 hover:bg-[#f8f9fa] transition-all">
                                    Lihat Kurikulum
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#fcd400]/20 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#641700]/10 rounded-full blur-3xl"></div>
                            <div className="relative bg-white p-4 rounded-3xl card-soft-shadow">
                                <img 
                                    alt="Happy children learning" 
                                    className="rounded-2xl w-full h-[450px] object-cover" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLFsjNxqVo7lmc8AYEDBul5mU7bDY2r329lIyoRxJNXNWYTPKSfeYW9IfHMZmo46Y5Cj0PGT2lr8Xn8MlUqKd9Om_NOPV_j3NRsN_-R9j9xGXwDKd6PdifKt6j0R-o3Z9xkmBqXXGCHqhgpDOYKKnM-u_OcaY6v9YfwY1hw2a4dtllMqDX7d9ICuP_JgV8dUrsp2QY32nQI2wGgA_GkQp9y4GiJ0Jrr0qozw9eSy7IdAKYjPXY61zso7HItLHa1W8HQLsY0gIXWxo"
                                />
                                {/* Floating Badge */}
                                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#ff6f44]/20 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[#ff6f44]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#43474f] font-medium">Rating Orang Tua</p>
                                        <p className="text-lg font-bold text-[#001e40]">4.9 / 5.0</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Program Packages (Bento Style) */}
                <section className="bg-[#f3f4f5] py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="font-lexend text-3xl font-bold text-[#001e40] mb-4">Pilihan Paket Kelas</h2>
                            <p className="text-[#43474f]">Kurikulum yang dirancang khusus sesuai kebutuhan tumbuh kembang si kecil.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Package 1: Calistung */}
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 card-soft-shadow group hover:-translate-y-2 transition-all duration-300">
                                <div className="w-16 h-16 bg-[#d5e3ff] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#001e40] group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl text-[#001e40] group-hover:text-white">menu_book</span>
                                </div>
                                <h3 className="font-lexend text-xl font-bold text-[#001e40] mb-3">Paket Calistung</h3>
                                <p className="text-[#43474f] mb-6">Metode membaca, menulis, dan berhitung yang menyenangkan untuk persiapan masuk SD.</p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 font-semibold text-[#191c1d]">
                                        <span className="material-symbols-outlined text-[#705d00] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        Level TK A & TK B
                                    </li>
                                    <li className="flex items-center gap-3 font-semibold text-[#191c1d]">
                                        <span className="material-symbols-outlined text-[#705d00] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        Max 5 Siswa / Kelas
                                    </li>
                                </ul>
                                <button className="w-full py-4 bg-[#e7e8e9] rounded-xl font-bold text-[#001e40] group-hover:bg-[#fcd400] transition-colors">Pilih Paket</button>
                            </div>

                            {/* Package 2: English */}
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 card-soft-shadow group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-[#ff6f44] px-6 py-2 rounded-bl-2xl text-white font-bold text-sm">Terpopuler</div>
                                <div className="w-16 h-16 bg-[#d5e3ff] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#001e40] group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl text-[#001e40] group-hover:text-white">language</span>
                                </div>
                                <h3 className="font-lexend text-xl font-bold text-[#001e40] mb-3">Paket English</h3>
                                <p className="text-[#43474f] mb-6">Membangun kepercayaan diri berbicara bahasa Inggris sejak dini dengan native style.</p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 font-semibold text-[#191c1d]">
                                        <span className="material-symbols-outlined text-[#705d00] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        Speaking & Phonics
                                    </li>
                                    <li className="flex items-center gap-3 font-semibold text-[#191c1d]">
                                        <span className="material-symbols-outlined text-[#705d00] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        Interactive Games
                                    </li>
                                </ul>
                                <button className="w-full py-4 bg-[#001e40] text-white rounded-xl font-bold btn-shadow transition-all">Pilih Paket</button>
                            </div>

                            {/* Package 3: SD */}
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 card-soft-shadow group hover:-translate-y-2 transition-all duration-300">
                                <div className="w-16 h-16 bg-[#d5e3ff] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#001e40] group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl text-[#001e40] group-hover:text-white">school</span>
                                </div>
                                <h3 className="font-lexend text-xl font-bold text-[#001e40] mb-3">Paket SD</h3>
                                <p className="text-[#43474f] mb-6">Pendampingan tugas sekolah dan pemantapan materi kelas 1-6 SD untuk semua mata pelajaran.</p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 font-semibold text-[#191c1d]">
                                        <span className="material-symbols-outlined text-[#705d00] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        Persiapan Ujian
                                    </li>
                                    <li className="flex items-center gap-3 font-semibold text-[#191c1d]">
                                        <span className="material-symbols-outlined text-[#705d00] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        Free Modul Belajar
                                    </li>
                                </ul>
                                <button className="w-full py-4 bg-[#e7e8e9] rounded-xl font-bold text-[#001e40] group-hover:bg-[#fcd400] transition-colors">Pilih Paket</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-8 py-12 max-w-7xl mx-auto">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <span className="text-lg font-extrabold text-blue-900 font-lexend">Rumah Belajar Ms Kiki</span>
                        <p className="text-sm text-slate-500 max-w-xs text-center md:text-left">© 2026 Rumah Belajar Ms Kiki. Nurturing curiosity through academic excellence.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8">
                        <a className="text-sm text-slate-500 hover:text-yellow-600 underline underline-offset-4 transition-all opacity-80 hover:opacity-100" href="#">Curriculum</a>
                        <a className="text-sm text-slate-500 hover:text-yellow-600 underline underline-offset-4 transition-all opacity-80 hover:opacity-100" href="#">Parent Portal</a>
                        <a className="text-sm text-slate-500 hover:text-yellow-600 underline underline-offset-4 transition-all opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
                        <a className="text-sm text-slate-500 hover:text-yellow-600 underline underline-offset-4 transition-all opacity-80 hover:opacity-100" href="#">Contact Us</a>
                    </div>
                    <div className="flex gap-4">
                        <a className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[#001e40] hover:bg-[#001e40] hover:text-white transition-all" href="#">
                            <span className="material-symbols-outlined text-lg">public</span>
                        </a>
                        <a className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[#001e40] hover:bg-[#001e40] hover:text-white transition-all" href="#">
                            <span className="material-symbols-outlined text-lg">share</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
