import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { BookOpen, Plus, Edit2, Trash2, Library, Eye, Package } from 'lucide-react';
import ProgramFormModal from '../components/ProgramFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import ProgramDetailModal from '../components/ProgramDetailModal';
import ProgramPackageManagementModal from '../components/ProgramPackageManagementModal';

const ProgramManagement = () => {
    const { user } = useOutletContext();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form Modal states (Admin only)

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedProgramId, setSelectedProgramId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State Delete Modal (Admin only)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteData, setDeleteData] = useState({ id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    // Detail Modal states (For Regular Users)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedDetailId, setSelectedDetailId] = useState(null);

    // Paket modal state (Admin)
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
    const [selectedPackageProgram, setSelectedPackageProgram] = useState({ id: null, name: '' });

    const fetchPrograms = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/programs`);
            setPrograms(response.data.data);
        } catch (error) {
            toast.error('Gagal memuat data program');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setFormData({ name: '', description: '' });
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (program) => {
        setModalMode('edit');
        setSelectedProgramId(program.id);
        setFormData({
            name: program.name, description: program.description || ''
        });
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (modalMode === 'add') {
                await axiosInstance.post('/programs', formData);
                toast.success('Program berhasil ditambahkan!');
            } else {
                await axiosInstance.put(`/programs/${selectedProgramId}`, formData);
                toast.success('Data program berhasil diperbarui!');
            }
            setIsFormModalOpen(false);
            fetchPrograms();
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
            await axiosInstance.delete(`/programs/${deleteData.id}`);
            toast.success('Program berhasil dihapus!');
            setIsDeleteModalOpen(false);
            fetchPrograms();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menghapus program');
        } finally {
            setIsDeleting(false);
        }
    };

    const openProgramDetail = (id) => {
        setSelectedDetailId(id);
        setIsDetailModalOpen(true);
    };

    const handleOpenPackageModal = (program) => {
        setSelectedPackageProgram({ id: program.id, name: program.name });
        setIsPackageModalOpen(true);
    };

    // Helper for dynamic colors
    const getCardStyle = (index) => {
        const styles = [
            { bg: 'bg-blue-600', text: 'text-blue-600', lightBg: 'bg-blue-50', hoverBorder: 'hover:border-blue-200' },
            { bg: 'bg-amber-500', text: 'text-amber-600', lightBg: 'bg-amber-50', hoverBorder: 'hover:border-amber-200' },
            { bg: 'bg-emerald-600', text: 'text-emerald-600', lightBg: 'bg-emerald-50', hoverBorder: 'hover:border-emerald-200' },
            { bg: 'bg-purple-600', text: 'text-purple-600', lightBg: 'bg-purple-50', hoverBorder: 'hover:border-purple-200' },
            { bg: 'bg-rose-500', text: 'text-rose-600', lightBg: 'bg-rose-50', hoverBorder: 'hover:border-rose-200' },
        ];
        return styles[index % styles.length];
    };

    return (
        <div className="space-y-6">
            <section className="col-span-12 mt-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <BookOpen className="text-indigo-700 w-8 h-8" />
                        <div>
                            <h3 className="text-3xl font-bold text-indigo-900 font-['Lexend']">Program Belajar</h3>
                            <p className="text-gray-500 mt-1 font-['Plus_Jakarta_Sans']">Kelola pilihan program edukasi untuk siswa</p>
                        </div>
                    </div>
                    {user?.role === 'admin' && (
                        <button onClick={handleOpenAddModal} className="w-full md:w-auto bg-amber-500 text-amber-950 px-6 py-3 rounded-xl font-bold transition-all hover:bg-amber-400 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
                            <Plus size={20} />
                            Tambah Program
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
                    </div>
                ) : programs.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                        <Library className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Belum ada program</h3>
                        <p className="mt-1 text-gray-500">
                            {user?.role === 'admin' ? 'Mulai dengan menambahkan program belajar baru.' : 'Saat ini belum ada program belajar yang tersedia.'}
                        </p>
                        {user?.role === 'admin' && (
                            <div className="mt-6">
                                <button onClick={handleOpenAddModal} className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                                    <Plus size={18} /> Tambah Program Pertama
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programs.map((program, index) => {
                            const style = getCardStyle(index);
                            return (
                                <div key={program.id} className={`bg-white/80 backdrop-blur-sm rounded-[24px] p-8 border-2 border-gray-100 ${style.hoverBorder} transition-all flex flex-col relative overflow-hidden group shadow-sm hover:shadow-md`}>
                                    <div className={`absolute -right-8 -top-8 w-24 h-24 ${style.lightBg} rounded-full transition-transform duration-500 group-hover:scale-150`}></div>
                                    
                                    <div className={`w-16 h-16 ${style.bg} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/5 relative z-10`}>
                                        <BookOpen className="text-white w-8 h-8" />
                                    </div>
                                    
                                    <h4 className="text-xl font-bold text-gray-900 mb-3 relative z-10">{program.name}</h4>
                                    
                                    <p className="text-gray-600 text-sm mb-8 flex-1 relative z-10 line-clamp-3">
                                        {program.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 relative z-10">
                                        <div className="flex gap-2">
                                            {user?.role === 'admin' ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleOpenPackageModal(program)}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                                                        title="Kelola Paket"
                                                    >
                                                        <Package size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleOpenEditModal(program)} 
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                                        title="Edit Program"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleOpenDeleteModal(program.id, program.name)} 
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                        title="Hapus Program"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => openProgramDetail(program.id)}
                                                    className="px-4 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
                                                >
                                                    <Eye size={16} /> Lihat Detail
                                                </button>
                                            )}
                                        </div>
                                        <span className={`px-4 py-1.5 ${style.lightBg} ${style.text} rounded-full text-xs font-bold`}>
                                            Aktif
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <ProgramFormModal 
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

            <ProgramDetailModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                programId={selectedDetailId} 
            />

            <ProgramPackageManagementModal
                isOpen={isPackageModalOpen}
                onClose={() => setIsPackageModalOpen(false)}
                programId={selectedPackageProgram.id}
                programName={selectedPackageProgram.name}
            />
        </div>
    );
};

export default ProgramManagement;
