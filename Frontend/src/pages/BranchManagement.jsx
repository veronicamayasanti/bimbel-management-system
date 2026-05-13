import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { Search, MapPin, Edit2, Trash2 } from 'lucide-react';
import BranchFormModal from '../components/BranchFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const BranchManagement = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [formData, setFormData] = useState({ name: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State Delete Modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteData, setDeleteData] = useState({ id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchBranches = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/branches?search=${search}`);
            setBranches(response.data.data);
        } catch (error) {
            toast.error('Gagal memuat data cabang');
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const timeoutId = setTimeout(() => fetchBranches(), 500);
        return () => clearTimeout(timeoutId);
    }, [fetchBranches]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setFormData({ name: '', address: '' });
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (branch) => {
        setModalMode('edit');
        setSelectedBranchId(branch.id);
        setFormData({
            name: branch.name, address: branch.address || ''
        });
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (modalMode === 'add') {
                await axiosInstance.post('/branches', formData);
                toast.success('Cabang berhasil ditambahkan!');
            } else {
                await axiosInstance.put(`/branches/${selectedBranchId}`, formData);
                toast.success('Data cabang berhasil diperbarui!');
            }
            setIsFormModalOpen(false);
            fetchBranches();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenDeleteModal = (id, name) => {
        setDeleteData({ id, name });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await axiosInstance.delete(`/branches/${deleteData.id}`);
            toast.success('Cabang berhasil dihapus!');
            setIsDeleteModalOpen(false);
            fetchBranches();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menghapus cabang');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-indigo-900 mb-2 font-['Lexend']">Manajemen Pusat Pembelajaran</h2>
                    <p className="text-gray-500 max-w-2xl font-['Plus_Jakarta_Sans']">Kelola lokasi operasional cabang dan program edukasi unggulan Rumah Belajar Ms Kiki dalam satu dashboard terpadu.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button onClick={handleOpenAddModal} className="flex w-full md:w-auto justify-center items-center gap-2 bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:shadow-xl hover:-translate-y-1 shadow-indigo-700/20">
                        <MapPin size={20} />
                        Tambah Cabang
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Section 1: Daftar Cabang (Bento Large Item) */}
                <section className="col-span-12 lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                                <MapPin size={22} />
                            </div>
                            <h3 className="text-xl font-semibold text-indigo-900">Daftar Cabang</h3>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 w-full sm:w-auto">
                            <Search className="text-gray-400" size={18} />
                            <input 
                                className="border-none focus:ring-0 text-sm bg-transparent w-full sm:w-48 outline-none" 
                                placeholder="Cari cabang..." 
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Nama Cabang</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Alamat Lengkap</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-gray-100 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                                {branches.length === 0 && loading ? (
                                    <tr><td colSpan="3" className="py-10 text-center text-gray-500 animate-pulse">Memuat data...</td></tr>
                                ) : branches.length === 0 && !loading ? (
                                    <tr><td colSpan="3" className="py-10 text-center text-gray-500">Tidak ada cabang yang ditemukan.</td></tr>
                                ) : (
                                    branches.map(branch => (
                                        <tr key={branch.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                                        <MapPin size={16} className="text-indigo-600" />
                                                    </div>
                                                    <span className="font-bold text-gray-800">{branch.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-gray-500 text-sm">{branch.address || '-'}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleOpenEditModal(branch)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"><Edit2 size={18} /></button>
                                                    <button onClick={() => handleOpenDeleteModal(branch.id, branch.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Section 2: Quick Stats / Visual Sidebar (Bento Medium) */}
                <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <div className="relative rounded-2xl overflow-hidden aspect-video shadow-lg group">
                        <img alt="Classroom" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop" />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-transparent flex flex-col justify-end p-6">
                            <h4 className="text-white font-bold text-xl">Statistik Cabang</h4>
                            <p className="text-white/80 text-sm mt-1">{branches.length} Cabang Terdaftar</p>
                        </div>
                    </div>
                    <div className="bg-amber-50 rounded-2xl p-6 shadow-sm border border-amber-200">
                        <h4 className="text-lg font-bold text-amber-900 mb-4">Informasi Penting</h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <span className="text-amber-700">📌</span>
                                <p className="text-sm text-amber-800">Pendaftaran kelas baru untuk Semester Genap akan dibuka pekan depan di semua cabang.</p>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>

            <BranchFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSubmit={handleSubmit} formData={formData} handleInputChange={handleInputChange} modalMode={modalMode} isSubmitting={isSubmitting} />

            <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} userName={deleteData.name} isDeleting={isDeleting} />
        </div>
    );
};

export default BranchManagement;
