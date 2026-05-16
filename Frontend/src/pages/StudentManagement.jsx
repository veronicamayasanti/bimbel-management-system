import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { Users, Plus, Edit2, Trash2, MapPin, School, ShoppingCart, Layers, MoreVertical, Search, ListFilter } from 'lucide-react';
import StudentFormModal from '../components/StudentFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import PurchasePackageModal from '../components/PurchasePackageModal';
import Pagination from '../components/Pagination';

const StudentManagement = () => {
    const { user } = useOutletContext();
    const isAdmin = user?.role === 'admin';

    const [students, setStudents] = useState([]);
    const [branches, setBranches] = useState([]);
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination states
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });

    // Search & Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');

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

    const fetchData = useCallback(async (currentPage = 1) => {
        try {
            setLoading(true);
            // Only use pagination params if admin
            const params = { 
                search: searchTerm,
                ...(isAdmin && {
                    page: currentPage, 
                    limit: 10,
                    branchId: selectedBranch,
                    levelId: selectedLevel
                })
            };
            
            const [studentsRes, branchesRes, levelsRes] = await Promise.all([
                axiosInstance.get('/students', { params }),
                axiosInstance.get('/branches'),
                axiosInstance.get('/levels')
            ]);

            if (isAdmin && studentsRes.data.pagination) {
                setStudents(studentsRes.data.data);
                setPagination(studentsRes.data.pagination);
            } else {
                setStudents(studentsRes.data.data);
            }
            setBranches(branchesRes.data.data);
            setLevels(levelsRes.data.data);
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    }, [isAdmin, searchTerm, selectedBranch, selectedLevel]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchData(page);
        }, 500); // Debounce for search
        return () => clearTimeout(timeoutId);
    }, [fetchData, page, searchTerm, selectedBranch, selectedLevel]);



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
            fetchData(page);
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
            fetchData(page);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menghapus data siswa');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleOpenPurchaseModal = (student) => {
        setSelectedStudentForPurchase(student);
        setIsPurchaseModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <section className="col-span-12 mt-2">
                <div className="flex flex-col gap-6 mb-8">
                    {/* Page Breadcrumbs & Title */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-50 rounded-2xl">
                                <Users className="text-indigo-700 w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-indigo-900 font-['Lexend']">Manajemen Siswa</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1 font-medium">
                                    <span>Dashboard</span>
                                    <span>/</span>
                                    <span className="text-indigo-600">Students</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {!isAdmin && (
                                <button onClick={handleOpenAddModal} className="flex-1 md:flex-none bg-amber-500 text-amber-950 px-6 py-3 rounded-xl font-bold transition-all hover:bg-amber-400 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
                                    <Plus size={20} />
                                    Tambah Anak
                                </button>
                            )}
                            {isAdmin && (
                                <button className="flex-1 md:flex-none bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                                    <Plus size={20} />
                                    Pendaftaran Baru
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Dedicated Student Navbar / Filter Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="text-gray-400" size={18} />
                            </div>
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPage(1); // Reset to first page on search
                                }}
                                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border-transparent rounded-xl text-sm placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all" 
                                placeholder="Cari nama siswa, sekolah, atau orang tua..."
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-transparent hover:border-gray-200 transition-all cursor-pointer group">
                                <ListFilter className="text-gray-400 group-hover:text-indigo-600" size={18} />
                                <span className="text-sm font-semibold text-gray-600 group-hover:text-indigo-900">Filter</span>
                            </div>
                            <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>
                            <select 
                                value={selectedBranch}
                                onChange={(e) => {
                                    setSelectedBranch(e.target.value);
                                    setPage(1);
                                }}
                                className="bg-transparent border-none text-sm font-bold text-gray-600 focus:ring-0 cursor-pointer hover:text-indigo-600 transition-colors"
                            >
                                <option value="">Semua Cabang</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                            <select 
                                value={selectedLevel}
                                onChange={(e) => {
                                    setSelectedLevel(e.target.value);
                                    setPage(1);
                                }}
                                className="bg-transparent border-none text-sm font-bold text-gray-600 focus:ring-0 cursor-pointer hover:text-indigo-600 transition-colors"
                            >
                                <option value="">Semua Level</option>
                                {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
                    </div>
                ) : students.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                        <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Belum ada data siswa</h3>
                        {!isAdmin && (
                            <div className="mt-6">
                                <button onClick={handleOpenAddModal} className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                                    <Plus size={18} /> Daftarkan Anak
                                </button>
                            </div>
                        )}
                    </div>
                ) : isAdmin ? (
                    /* ADMIN VIEW: TABLE LAYOUT */
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Siswa</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Orang Tua</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sekolah</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Paket</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cabang</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Kelas</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {students.map((student) => {
                                        const activePackage = student.studentPackages?.length > 0 ? student.studentPackages[0] : null;
                                        return (
                                            <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm">
                                                            {student.fullName.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{student.fullName}</p>
                                                            <p className="text-[10px] text-gray-400">ID: STU-{student.id.toString().padStart(5, '0')}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-gray-700">{student.parent?.full_name || '-'}</p>
                                                    <p className="text-xs text-gray-400">{student.parent?.email || ''}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{student.schoolName}</td>
                                                <td className="px-6 py-4">
                                                    {activePackage ? (
                                                        <div>
                                                            <p className="text-xs font-bold text-indigo-900">{activePackage.programPackage?.name}</p>
                                                            <p className="text-[10px] text-indigo-500">{activePackage.remainingMeetings} Sesi Sisa</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-300 italic">No Package</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{student.branch?.name || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{student.level?.name || '-'}</td>
                                                <td className="px-6 py-4">
                                                    {activePackage ? (
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                            activePackage.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {activePackage.status}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-400 uppercase">N/A</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Footer */}
                        {/* Pagination Footer */}
                        <Pagination 
                            page={page} 
                            totalPages={pagination.totalPages} 
                            setPage={setPage} 
                        />
                    </div>
                ) : (
                    /* PARENT VIEW: CARD LAYOUT (Unchanged logic, just consistent styling) */
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
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 flex-1 text-sm">
                                    <div className="flex items-start gap-3 text-gray-600">
                                        <School className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                        <span>Asal Sekolah: <span className="font-medium text-gray-800">{student.schoolName}</span></span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-600">
                                        <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block">Tingkat Kelas: <span className="font-medium text-gray-800">{student.level?.name || '-'}</span></span>
                                            <span className="block mt-1">Cabang Bimbel: <span className="font-medium text-gray-800">{student.branch?.name || '-'}</span></span>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-3 mt-1 border-t border-dashed border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <Layers size={12} /> Paket Aktif
                                        </p>
                                        {student.studentPackages?.filter(p => p.status === 'ACTIVE').length > 0 ? (
                                            <div className="space-y-2">
                                                {student.studentPackages.filter(p => p.status === 'ACTIVE').map(pkg => (
                                                    <div key={pkg.id} className="bg-indigo-50/50 rounded-lg p-2.5 flex justify-between items-center border border-indigo-100">
                                                        <div>
                                                            <p className="text-xs font-bold text-indigo-900 leading-tight">{pkg.programPackage?.name}</p>
                                                            <p className="text-[10px] text-indigo-500 font-medium">Sisa: {pkg.remainingMeetings} / {pkg.totalMeetings} Sesi</p>
                                                        </div>
                                                        <div className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">AKTIF</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">Belum memiliki paket aktif</p>
                                        )}
                                    </div>
                                </div>

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
