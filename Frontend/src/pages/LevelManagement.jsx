import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { Layers, Plus, Edit2, Trash2 } from 'lucide-react';
import LevelFormModal from '../components/LevelFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const LevelManagement = () => {
    const { user } = useOutletContext();
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedLevelId, setSelectedLevelId] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteData, setDeleteData] = useState({ id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    // Selalu deklarasikan hooks sebelum conditional return (Rules of Hooks)
    const fetchLevels = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/levels`);
            setLevels(response.data.data);
        } catch (error) {
            toast.error('Gagal memuat data level');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLevels();
    }, [fetchLevels]);

    // Guard: Pastikan hanya admin yang bisa akses (diletakkan SETELAH semua hooks)
    if (user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setFormData({ name: '' });
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (level) => {
        setModalMode('edit');
        setSelectedLevelId(level.id);
        setFormData({ name: level.name });
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (modalMode === 'add') {
                await axiosInstance.post('/levels', formData);
                toast.success('Level berhasil ditambahkan!');
            } else {
                await axiosInstance.put(`/levels/${selectedLevelId}`, formData);
                toast.success('Data level berhasil diperbarui!');
            }
            setIsFormModalOpen(false);
            fetchLevels();
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
            await axiosInstance.delete(`/levels/${deleteData.id}`);
            toast.success('Level berhasil dihapus!');
            setIsDeleteModalOpen(false);
            fetchLevels();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menghapus level');
        } finally {
            setIsDeleting(false);
        }
    };

    const getCardStyle = (index) => {
        const styles = [
            { bg: 'bg-indigo-600', text: 'text-indigo-600', lightBg: 'bg-indigo-50', hoverBorder: 'hover:border-indigo-200' },
            { bg: 'bg-sky-500', text: 'text-sky-600', lightBg: 'bg-sky-50', hoverBorder: 'hover:border-sky-200' },
            { bg: 'bg-teal-500', text: 'text-teal-600', lightBg: 'bg-teal-50', hoverBorder: 'hover:border-teal-200' },
            { bg: 'bg-violet-600', text: 'text-violet-600', lightBg: 'bg-violet-50', hoverBorder: 'hover:border-violet-200' },
            { bg: 'bg-pink-500', text: 'text-pink-600', lightBg: 'bg-pink-50', hoverBorder: 'hover:border-pink-200' },
        ];
        return styles[index % styles.length];
    };

    return (
        <div className="space-y-6">
            <section className="col-span-12 mt-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <Layers className="text-indigo-700 w-8 h-8" />
                        <div>
                            <h3 className="text-3xl font-bold text-indigo-900 font-['Lexend']">Tingkat Kelas (Level)</h3>
                            <p className="text-gray-500 mt-1 font-['Plus_Jakarta_Sans']">Kelola tingkat pendidikan untuk siswa</p>
                        </div>
                    </div>
                    <button onClick={handleOpenAddModal} className="w-full md:w-auto bg-amber-500 text-amber-950 px-6 py-3 rounded-xl font-bold transition-all hover:bg-amber-400 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
                        <Plus size={20} />
                        Tambah Level
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
                    </div>
                ) : levels.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                        <Layers className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Belum ada level kelas</h3>
                        <p className="mt-1 text-gray-500">Mulai dengan menambahkan tingkat pendidikan baru.</p>
                        <div className="mt-6">
                            <button onClick={handleOpenAddModal} className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                                <Plus size={18} /> Tambah Level Pertama
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {levels.map((level, index) => {
                            const style = getCardStyle(index);
                            return (
                                <div key={level.id} className={`bg-white rounded-2xl p-6 border-2 border-gray-100 ${style.hoverBorder} transition-all flex flex-col relative group shadow-sm hover:shadow-md`}>
                                    <div className={`w-12 h-12 ${style.lightBg} rounded-xl flex items-center justify-center mb-4`}>
                                        <Layers className={`${style.text} w-6 h-6`} />
                                    </div>
                                    
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{level.name}</h4>
                                    
                                    <div className="flex-1"></div>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleOpenEditModal(level)} 
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                                title="Edit Level"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleOpenDeleteModal(level.id, level.name)} 
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                title="Hapus Level"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <LevelFormModal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)} 
                onSubmit={handleSubmit} 
                formData={formData} 
                handleInputChange={handleInputChange} 
                modalMode={modalMode} 
                isSubmitting={isSubmitting} 
            />

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                onConfirm={confirmDelete} 
                userName={deleteData.name} 
                isDeleting={isDeleting} 
            />
        </div>
    );
};

export default LevelManagement;
