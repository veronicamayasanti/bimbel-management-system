import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { Users, Plus, Edit2, Trash2, MapPin, School, ShoppingCart, BookOpen, Layers } from 'lucide-react';
import StudentFormModal from '../components/StudentFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import PurchasePackageModal from '../components/PurchasePackageModal';

const StudentManagement = () => {
    const { user } = useOutletContext();
    const [students, setStudents] = useState([]);
    const [branches, setBranches] = useState([]);
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [formData, setFormData] = useState({ fullName: '', schoolName: '', branchId: '', levelId: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteData, setDeleteData] = useState({ id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    // State untuk modal beli paket
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [selectedStudentForPurchase, setSelectedStudentForPurchase] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [studentsRes, branchesRes, levelsRes] = await Promise.all([
                axiosInstance.get('/students'),
                axiosInstance.get('/branches'),
                axiosInstance.get('/levels')
            ]);
            setStudents(studentsRes.data.data);
            setBranches(branchesRes.data.data);
            setLevels(levelsRes.data.data);
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleOpenPurchaseModal = (student) => {
        setSelectedStudentForPurchase(student);
        setIsPurchaseModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setFormData({ fullName: '', schoolName: '', branchId: '', levelId: '' });
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (student) => {
        setModalMode('edit');
        setSelectedStudentId(student.id);
        setFormData({
            fullName: student.fullName,
            schoolName: student.schoolName,
            branchId: student.branchId,
            levelId: student.levelId
        });
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (modalMode === 'add') {
                await axiosInstance.post('/students', formData);
                toast.success('Data siswa berhasil ditambahkan!');
            } else {
                await axiosInstance.put(`/students/${selectedStudentId}`, formData);
                toast.success('Data siswa berhasil diperbarui!');
            }
            setIsFormModalOpen(false);
            fetchData();
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
            await axiosInstance.delete(`/students/${deleteData.id}`);
            toast.success('Data siswa berhasil dihapus!');
            setIsDeleteModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menghapus data siswa');
        } finally {
            setIsDeleting(false);
        }
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div className="space-y-6">
            <section className="col-span-12 mt-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <Users className="text-indigo-700 w-8 h-8" />
                        <div>
                            <h3 className="text-3xl font-bold text-indigo-900 font-['Lexend']">Data Anak / Siswa</h3>
                            <p className="text-gray-500 mt-1 font-['Plus_Jakarta_Sans']">Kelola data pendaftaran bimbingan belajar</p>
                        </div>
                    </div>
                    {/* Admins cannot add students directly through this UI right now as per backend design */}
                    {!isAdmin && (
                        <button onClick={handleOpenAddModal} className="w-full md:w-auto bg-amber-500 text-amber-950 px-6 py-3 rounded-xl font-bold transition-all hover:bg-amber-400 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
                            <Plus size={20} />
                            Tambah Anak
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
                    </div>
                ) : students.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                        <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Belum ada data siswa</h3>
                        <p className="mt-1 text-gray-500">Mulai dengan mendaftarkan anak Anda ke bimbel.</p>
                        {!isAdmin && (
                            <div className="mt-6">
                                <button onClick={handleOpenAddModal} className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                                    <Plus size={18} /> Daftarkan Anak
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {students.map((student) => (
                            <div key={student.id} className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md relative group flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 flex justify-center items-center rounded-2xl font-bold text-xl uppercase">
                                            {student.fullName.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 leading-tight">{student.fullName}</h4>
                                            {isAdmin && student.parent && (
                                                <p className="text-xs text-indigo-600 mt-1 font-medium bg-indigo-50 inline-block px-2 py-0.5 rounded-full">
                                                    Orang Tua: {student.parent.full_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 flex-1">
                                    <div className="flex items-start gap-3 text-sm text-gray-600">
                                        <School className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                        <span>Asal Sekolah: <span className="font-medium text-gray-800">{student.schoolName}</span></span>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm text-gray-600">
                                        <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block">Tingkat Kelas: <span className="font-medium text-gray-800">{student.level?.name || '-'}</span></span>
                                            <span className="block mt-1">Cabang Bimbel: <span className="font-medium text-gray-800">{student.branch?.name || '-'}</span></span>
                                        </div>
                                    </div>
                                    
                                    {/* Display Packages */}
                                    <div className="pt-3 mt-1 border-t border-dashed border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <Layers size={12} /> Paket Aktif
                                        </p>
                                        {student.studentPackages && student.studentPackages.length > 0 ? (
                                            <div className="space-y-2">
                                                {student.studentPackages.filter(p => p.status === 'ACTIVE').map(pkg => (
                                                    <div key={pkg.id} className="bg-indigo-50/50 rounded-lg p-2.5 flex justify-between items-center border border-indigo-100">
                                                        <div>
                                                            <p className="text-xs font-bold text-indigo-900 leading-tight">{pkg.programPackage?.name}</p>
                                                            <p className="text-[10px] text-indigo-500 font-medium">Sisa: {pkg.remainingMeetings} / {pkg.totalMeetings} Sesi</p>
                                                        </div>
                                                        <div className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                            AKTIF
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">Belum memiliki paket aktif</p>
                                        )}
                                    </div>
                                </div>

                                {!isAdmin && (
                                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 mt-auto">
                                        <button 
                                            onClick={() => handleOpenPurchaseModal(student)}
                                            className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 rounded-xl transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
                                        >
                                            <ShoppingCart size={16} /> Beli Paket Belajar
                                        </button>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleOpenEditModal(student)} 
                                                className="flex-1 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-1"
                                            >
                                                <Edit2 size={14} /> Edit
                                            </button>
                                            <button 
                                                onClick={() => handleOpenDeleteModal(student.id, student.fullName)} 
                                                className="flex-1 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-1"
                                            >
                                                <Trash2 size={14} /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <StudentFormModal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)} 
                onSubmit={handleSubmit} 
                formData={formData} 
                handleInputChange={handleInputChange} 
                modalMode={modalMode} 
                isSubmitting={isSubmitting} 
                branches={branches}
                levels={levels}
            />

            <PurchasePackageModal
                isOpen={isPurchaseModalOpen}
                onClose={() => setIsPurchaseModalOpen(false)}
                student={selectedStudentForPurchase}
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

export default StudentManagement;
