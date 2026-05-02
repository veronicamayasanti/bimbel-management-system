import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import UserFormModal from '../components/UserFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Pagination from '../components/Pagination';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [search, setSearch] = useState('');

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [formData, setFormData] = useState({
        full_name: '', email: '', password: '', telp_no: '', address: '', isActive: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State Delete Modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteData, setDeleteData] = useState({ id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/users?page=${page}&limit=3&search=${search}`);
            setUsers(response.data.data);
            // BUG FIX: Backend mengirim `.meta`, bukan `.pagination`
            setTotalPages(response.data.meta.total_pages);
            setTotalUsers(response.data.meta.total_data);

        } catch (error) {
            toast.error('Gagal memuat data pengguna');
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        const timeoutId = setTimeout(() => fetchUsers(), 500);
        return () => clearTimeout(timeoutId);
    }, [fetchUsers]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setFormData({ full_name: '', email: '', password: '', telp_no: '', address: '', isActive: true });
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setModalMode('edit');
        setSelectedUserId(user.id);
        setFormData({
            full_name: user.full_name, email: user.email, password: '',
            telp_no: user.telp_no || '', address: user.address || '', isActive: user.isActive
        });
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (modalMode === 'add') {
                await axiosInstance.post('/users', formData);
                toast.success('Pengguna berhasil ditambahkan!');
            } else {
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;
                await axiosInstance.put(`/users/${selectedUserId}`, updateData);
                toast.success('Data pengguna berhasil diperbarui!');
            }
            setIsFormModalOpen(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Tampilkan Modal Delete
    const handleOpenDeleteModal = (id, name) => {
        setDeleteData({ id, name });
        setIsDeleteModalOpen(true);
    };

    // Eksekusi Hapus
    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await axiosInstance.delete(`/users/${deleteData.id}`);
            toast.success('Pengguna berhasil dihapus!');
            setIsDeleteModalOpen(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menghapus pengguna');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Manajemen Akun</h1>
                    <p className="text-gray-500 mt-1">Total {totalUsers} pengguna terdaftar di sistem.</p>
                </div>
                <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm">
                    <Plus size={20} /> Tambah Pengguna
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                <Search className="text-gray-400" size={20} />
                <input type="text" placeholder="Cari nama atau email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full focus:outline-none text-gray-700" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm border-b">
                                <th className="py-4 px-6 font-semibold">Profil</th>
                                <th className="py-4 px-6 font-semibold">Kontak</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                                <th className="py-4 px-6 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="4" className="py-10 text-center text-gray-500 animate-pulse">Memuat data...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="4" className="py-10 text-center text-gray-500">Tidak ada pengguna yang ditemukan.</td></tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50/50">
                                        <td className="py-4 px-6 flex items-center gap-3">
                                            <img src={user.avatar ? `http://localhost:3000/uploads/${user.avatar}` : 'http://localhost:3000/uploads/avatar_default.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover border" />
                                            <div>
                                                <p className="font-bold text-gray-800">{user.full_name}</p>
                                                <p className="text-xs text-gray-500">{new Date(user.created_at).toLocaleDateString('id-ID')}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-800">{user.email}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {user.isActive ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenEditModal(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                                                <button onClick={() => handleOpenDeleteModal(user.id, user.full_name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {!loading && (
                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                )}
            </div>

            {/* Komponen Modal yang Terpisah */}
            <UserFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSubmit={handleSubmit} formData={formData} handleInputChange={handleInputChange} modalMode={modalMode} isSubmitting={isSubmitting} />

            <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} userName={deleteData.name} isDeleting={isDeleting} />

        </div>
    );
};

export default UserManagement;
