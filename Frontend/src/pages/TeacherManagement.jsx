import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import axiosInstance, { API_BASE_URL } from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { Users, Plus, Edit2, Trash2, Search, UserCircle } from 'lucide-react';
import TeacherFormModal from '../components/TeacherFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const TeacherManagement = () => {
    const { user } = useOutletContext();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Form Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', telpNo: '', isActive: true });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteData, setDeleteData] = useState({ id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchTeachers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/teachers');
            setTeachers(response.data.data);
        } catch (error) {
            toast.error('Gagal memuat data guru');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setFormData({ fullName: '', email: '', password: '', telpNo: '', isActive: true });
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (teacher) => {
        setModalMode('edit');
        setSelectedTeacherId(teacher.id);
        setFormData({
            fullName: teacher.fullName,
            email: teacher.email,
            password: '',
            telpNo: teacher.telpNo || '',
            isActive: teacher.isActive
        });
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (modalMode === 'add') {
                await axiosInstance.post('/teachers', formData);
                toast.success('Guru berhasil ditambahkan!');
            } else {
                await axiosInstance.patch(`/teachers/${selectedTeacherId}`, formData);
                toast.success('Data guru berhasil diperbarui!');
            }
            setIsFormModalOpen(false);
            fetchTeachers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan');
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
            await axiosInstance.delete(`/teachers/${deleteData.id}`);
            toast.success('Guru berhasil dihapus!');
            setIsDeleteModalOpen(false);
            fetchTeachers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menghapus guru');
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredTeachers = teachers.filter(t => 
        t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-700">
                        <Users size={32} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 font-['Lexend']">Manajemen Guru</h3>
                        <p className="text-gray-500 font-['Plus_Jakarta_Sans']">Kelola data pengajar dan hak aksesnya</p>
                    </div>
                </div>
                <button 
                    onClick={handleOpenAddModal}
                    className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    Tambah Guru
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cari nama atau email guru..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-xl focus:border-indigo-500 focus:bg-white transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
                </div>
            ) : filteredTeachers.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                    <UserCircle className="mx-auto h-20 w-20 text-gray-200 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">Tidak ada guru ditemukan</h3>
                    <p className="text-gray-500 mt-2">Mulai tambahkan guru baru atau ubah kata kunci pencarian Anda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeachers.map((teacher) => (
                        <div key={teacher.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl overflow-hidden border border-indigo-100">
                                    {teacher.avatar ? (
                                        <img 
                                            src={`${API_BASE_URL}/uploads/${teacher.avatar}`} 
                                            alt={teacher.fullName} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        teacher.fullName.charAt(0)
                                    )}
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${teacher.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {teacher.isActive ? 'Aktif' : 'Nonaktif'}
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 line-clamp-1">{teacher.fullName}</h4>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-1">{teacher.email}</p>
                            
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                                    {teacher.telpNo || 'No telp -'}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                                <button 
                                    onClick={() => handleOpenEditModal(teacher)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button 
                                    onClick={() => handleOpenDeleteModal(teacher.id, teacher.fullName)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors"
                                >
                                    <Trash2 size={16} /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <TeacherFormModal 
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

export default TeacherManagement;
