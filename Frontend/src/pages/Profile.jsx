import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axiosInstance, { API_BASE_URL } from '../api/axiosInstance';

const Profile = () => {
    // Mengambil data user yang sudah di-fetch oleh DashboardLayout
    const { user, setUser } = useOutletContext();

    // 1. STATE UNTUK GANTI PASSWORD
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [msgPass, setMsgPass] = useState({ type: '', text: '' });
    const [loadingPass, setLoadingPass] = useState(false);

    // 2. STATE UNTUK UPLOAD FOTO
    const [selectedFile, setSelectedFile] = useState(null);
    const [msgAvatar, setMsgAvatar] = useState({ type: '', text: '' });
    const [loadingAvatar, setLoadingAvatar] = useState(false);

    // 3. STATE UNTUK UPDATE BIODATA (Hanya untuk User)
    const [formData, setFormData] = useState({
        full_name: '',
        telp_no: '',
        address: ''
    });
    const [msgUpdate, setMsgUpdate] = useState({ type: '', text: '' });
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    // Otomatis mengisi form dengan data saat ini
    useEffect(() => {
        if (user && user.role === 'user') {
            setFormData({
                full_name: user.full_name || '',
                telp_no: user.telp_no || '',
                address: user.address || ''
            });
        }
        if (user && user.role === 'teacher') {
            setFormTeacher({
                fullName: user.fullName || user.full_name || '',
                telpNo: user.telpNo || user.telp_no || '',
            });
        }
    }, [user]);

    // 4. STATE & HANDLER UNTUK UPDATE BIODATA GURU
    const [formTeacher, setFormTeacher] = useState({ fullName: '', telpNo: '' });
    const [msgTeacher, setMsgTeacher] = useState({ type: '', text: '' });
    const [loadingTeacher, setLoadingTeacher] = useState(false);

    const handleUpdateTeacherData = async (e) => {
        e.preventDefault();
        setMsgTeacher({ type: '', text: '' });
        setLoadingTeacher(true);
        try {
            await axiosInstance.put(`/teachers/${user.id}`, formTeacher);
            setMsgTeacher({ type: 'success', text: 'Data berhasil diperbarui' });
            setUser({ ...user, fullName: formTeacher.fullName, full_name: formTeacher.fullName });
        } catch (error) {
            setMsgTeacher({ type: 'error', text: error.response?.data?.message || 'Gagal mengubah data' });
        } finally { setLoadingTeacher(false); }
    };

    // Fungsi Handle Form (diperpendek agar fokus pada yang penting)
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMsgPass({ type: '', text: '' });
        setLoadingPass(true);
        try {
            const response = await axiosInstance.put('/users/change-password', {
                old_password: oldPassword, new_password: newPassword
            });
            setMsgPass({ type: 'success', text: response.data.message });
            setOldPassword(''); setNewPassword('');
        } catch (error) {
            setMsgPass({ type: 'error', text: error.response?.data?.message || 'Gagal mengubah password' });
        } finally { setLoadingPass(false); }
    };

    const handleAvatarUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return setMsgAvatar({ type: 'error', text: 'Pilih file dulu' });
        setLoadingAvatar(true);
        const uploadData = new FormData(); uploadData.append('avatar', selectedFile);
        try {
            const res = await axiosInstance.post('/users/me/avatar', uploadData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setMsgAvatar({ type: 'success', text: res.data.message });
            setUser({ ...user, avatar: res.data.avatar_url.split('/').pop() });
            setSelectedFile(null);
        } catch (error) {
            setMsgAvatar({ type: 'error', text: 'Gagal mengunggah foto' });
        } finally { setLoadingAvatar(false); }
    };

    // Fungsi Baru: Update Biodata
    const handleUpdateData = async (e) => {
        e.preventDefault();
        setMsgUpdate({ type: '', text: '' });
        setLoadingUpdate(true);
        try {
            // Panggil API Update Data (PUT /api/users/:id)
            const response = await axiosInstance.put(`/users/${user.id}`, formData);
            setMsgUpdate({ type: 'success', text: response.data.message });

            // Perbarui data user di state agar tampilan langsung berubah
            setUser({ ...user, ...response.data.user });
        } catch (error) {
            setMsgUpdate({ type: 'error', text: error.response?.data?.message || 'Gagal mengubah data' });
        } finally { setLoadingUpdate(false); }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-10">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">Pengaturan Profil</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* KOLOM KIRI: Foto & Avatar */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <img
                            src={user.avatar ? `${API_BASE_URL}/uploads/${user.avatar}` : `${API_BASE_URL}/uploads/avatar_default.png`}
                            alt="Profile"
                            className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-indigo-50 shadow-md mb-4"
                        />
                        <h2 className="text-xl font-bold text-gray-800">{user.fullName || user.full_name}</h2>
                        <p className="text-sm font-semibold text-gray-500 mb-2">{user.role.toUpperCase()}</p>
                        <p className="text-sm text-indigo-600 font-medium bg-indigo-50 py-1 px-3 rounded-full inline-block">
                            {user.email || user.username}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Ubah Foto Profil</h3>
                        {msgAvatar.text && (<div className={`p-3 rounded-lg mb-4 text-sm font-medium ${msgAvatar.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{msgAvatar.text}</div>)}
                        <form onSubmit={handleAvatarUpload} className="space-y-4">
                            <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={(e) => { setSelectedFile(e.target.files[0]); setMsgAvatar({ type: '', text: '' }) }} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
                            <button type="submit" disabled={loadingAvatar || !selectedFile} className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">Upload Foto Baru</button>
                        </form>
                    </div>
                </div>

                {/* KOLOM KANAN: Form Update Data & Ganti Password */}
                <div className="md:col-span-2 space-y-6">

                    {/* FORM UPDATE BIODATA USER (Hanya Muncul Jika Role = user) */}
                    {user.role === 'user' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Informasi Pribadi</h3>
                            {msgUpdate.text && (<div className={`p-4 rounded-lg mb-6 text-sm font-medium ${msgUpdate.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{msgUpdate.text}</div>)}
                            <form onSubmit={handleUpdateData} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-gray-50" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                                    <input type="text" value={formData.telp_no} onChange={(e) => setFormData({ ...formData, telp_no: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Domisili</label>
                                    <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-gray-50" rows="3"></textarea>
                                </div>
                                <div className="md:col-span-2 text-right mt-2">
                                    <button type="submit" disabled={loadingUpdate} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 shadow-md">
                                        {loadingUpdate ? 'Menyimpan...' : 'Simpan Perubahan Data'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* FORM UPDATE BIODATA GURU */}
                    {user.role === 'teacher' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Informasi Guru</h3>
                            {msgTeacher.text && (<div className={`p-4 rounded-lg mb-6 text-sm font-medium ${msgTeacher.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{msgTeacher.text}</div>)}
                            <form onSubmit={handleUpdateTeacherData} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <input type="text" value={formTeacher.fullName} onChange={(e) => setFormTeacher({ ...formTeacher, fullName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-gray-50" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                                    <input type="text" value={formTeacher.telpNo} onChange={(e) => setFormTeacher({ ...formTeacher, telpNo: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
                                </div>
                                <div className="md:col-span-2 text-right mt-2">
                                    <button type="submit" disabled={loadingTeacher} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 shadow-md">
                                        {loadingTeacher ? 'Menyimpan...' : 'Simpan Perubahan Data'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* FORM GANTI PASSWORD */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Keamanan Akun (Ganti Password)</h3>
                        {msgPass.text && (<div className={`p-4 rounded-lg mb-6 text-sm font-medium ${msgPass.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{msgPass.text}</div>)}

                        <form onSubmit={handlePasswordChange} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-gray-50" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-gray-50" required />
                            </div>

                            <div className="pt-2 text-right">
                                <button type="submit" disabled={loadingPass} className="px-8 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition disabled:opacity-50 shadow-md">
                                    {loadingPass ? 'Menyimpan...' : 'Simpan Password Baru'}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
