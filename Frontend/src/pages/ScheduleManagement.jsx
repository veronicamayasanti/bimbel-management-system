import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { Calendar, Plus, Trash2, Edit2, RefreshCw, Clock, Users, BookOpen, AlertTriangle, X } from 'lucide-react';
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';

const ScheduleManagement = () => {
    const [recurringSchedules, setRecurringSchedules] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [branches, setBranches] = useState([]);
    const [levels, setLevels] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Form & Modal states
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [generateDates, setGenerateDates] = useState({
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
    });
    
    const [formData, setFormData] = useState({
        teacherId: '',
        programId: '',
        branchId: '',
        levelIds: [],
        dayOfWeek: '1',
        startTime: '16:00',
        endTime: '17:30',
        studentIds: []
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [recurringRes, teachersRes, programsRes, branchesRes, levelsRes] = await Promise.all([
                axiosInstance.get('/schedules/recurring'),
                axiosInstance.get('/teachers'),
                axiosInstance.get('/programs'),
                axiosInstance.get('/branches'),
                axiosInstance.get('/levels')
            ]);
            setRecurringSchedules(recurringRes.data.data);
            setTeachers(teachersRes.data.data);
            setPrograms(programsRes.data.data);
            setBranches(branchesRes.data.data);
            setLevels(levelsRes.data.data);
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Effect to fetch students when programId, branchId or levelIds changes
    useEffect(() => {
        const fetchStudentsByProgram = async () => {
            if (!formData.programId || !formData.branchId || formData.levelIds.length === 0) {
                setFilteredStudents([]);
                return;
            }
            setLoadingStudents(true);
            try {
                const res = await axiosInstance.get(`/schedules/students-by-program/${formData.programId}`, {
                    params: { 
                        branchId: formData.branchId,
                        levelIds: formData.levelIds 
                    }
                });
                setFilteredStudents(res.data.data);
            } catch (error) {
                toast.error('Gagal memuat data murid untuk kriteria ini');
            } finally {
                setLoadingStudents(false);
            }
        };
        fetchStudentsByProgram();
    }, [formData.programId, formData.branchId, formData.levelIds]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Reset studentIds if criteria changes
        if (name === 'programId' || name === 'branchId') {
            setFormData({ ...formData, [name]: value, studentIds: [] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleLevelToggle = (levelId) => {
        const currentIds = [...formData.levelIds];
        let newIds;
        if (currentIds.includes(levelId)) {
            newIds = currentIds.filter(id => id !== levelId);
        } else {
            newIds = [...currentIds, levelId];
        }
        setFormData({ ...formData, levelIds: newIds, studentIds: [] });
    };

    const handleStudentToggle = (studentId) => {
        const currentIds = [...formData.studentIds];
        if (currentIds.includes(studentId)) {
            setFormData({ ...formData, studentIds: currentIds.filter(id => id !== studentId) });
        } else {
            setFormData({ ...formData, studentIds: [...currentIds, studentId] });
        }
    };

    const handleEdit = (schedule) => {
        setEditingId(schedule.id);
        setFormData({
            teacherId: schedule.teacherId,
            programId: schedule.programId,
            branchId: schedule.branchId || '',
            levelIds: schedule.levels.map(l => l.levelId),
            dayOfWeek: schedule.dayOfWeek.toString(),
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            studentIds: schedule.students.map(s => s.studentId)
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/schedules/recurring/${deleteId}`);
            toast.success('Jadwal dihapus');
            setShowDeleteModal(false);
            setDeleteId(null);
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.levelIds.length === 0) {
            return toast.error('Pilih minimal satu level kelas');
        }
        if (formData.studentIds.length === 0) {
            return toast.error('Pilih minimal satu murid');
        }
        try {
            if (editingId) {
                await axiosInstance.put(`/schedules/recurring/${editingId}`, formData);
                toast.success('Jadwal rutin berhasil diperbarui');
            } else {
                await axiosInstance.post('/schedules/recurring', formData);
                toast.success('Jadwal rutin berhasil dibuat');
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ teacherId: '', programId: '', branchId: '', levelIds: [], dayOfWeek: '1', startTime: '16:00', endTime: '17:30', studentIds: [] });
            fetchData();
        } catch (error) {
            toast.error(editingId ? 'Gagal memperbarui jadwal' : 'Gagal membuat jadwal');
        }
    };

    const handleGenerate = () => {
        setShowGenerateModal(true);
    };

    const handleConfirmGenerate = async () => {
        if (!generateDates.startDate || !generateDates.endDate) {
            return toast.error('Tanggal mulai dan selesai wajib diisi');
        }
        if (new Date(generateDates.startDate) > new Date(generateDates.endDate)) {
            return toast.error('Tanggal mulai tidak boleh lebih dari tanggal selesai');
        }
        setShowGenerateModal(false);
        setIsGenerating(true);
        try {
            const res = await axiosInstance.post('/schedules/generate', {
                startDate: generateDates.startDate,
                endDate: generateDates.endDate
            });
            toast.success(res.data.message);
        } catch (error) {
            toast.error('Gagal men-generate sesi');
        } finally {
            setIsGenerating(false);
        }
    };

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-3 rounded-2xl text-amber-700">
                        <Calendar size={32} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 font-['Lexend']">Master Jadwal Rutin</h3>
                        <p className="text-gray-500 font-['Plus_Jakarta_Sans']">Atur jadwal mingguan tetap berdasarkan program</p>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex-1 md:flex-none bg-indigo-50 text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={20} className={isGenerating ? 'animate-spin' : ''} />
                        Generate Sesi
                    </button>
                    <button 
                        onClick={() => {
                            if (showForm && editingId) {
                                setEditingId(null);
                                setFormData({ teacherId: '', programId: '', branchId: '', dayOfWeek: '1', startTime: '16:00', endTime: '17:30', studentIds: [] });
                            } else {
                                setShowForm(!showForm);
                            }
                        }}
                        className="flex-1 md:flex-none bg-amber-500 text-amber-950 px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
                    >
                        {showForm && editingId ? <RefreshCw size={20} /> : <Plus size={20} />}
                        {showForm && editingId ? 'Batal Edit' : 'Tambah Jadwal'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-amber-100 animate-in slide-in-from-top duration-300">
                    <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        {editingId ? 'Edit Jadwal Rutin' : 'Tambah Jadwal Baru'}
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Cabang</label>
                                <select 
                                    name="branchId" 
                                    value={formData.branchId} 
                                    onChange={handleInputChange} 
                                    required
                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-amber-500"
                                >
                                    <option value="">Pilih Cabang</option>
                                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Program / Mata Pelajaran</label>
                                <select 
                                    name="programId" 
                                    value={formData.programId} 
                                    onChange={handleInputChange} 
                                    required
                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-amber-500"
                                >
                                    <option value="">Pilih Program</option>
                                    {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Guru</label>
                                <select 
                                    name="teacherId" 
                                    value={formData.teacherId} 
                                    onChange={handleInputChange} 
                                    required
                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-amber-500"
                                >
                                    <option value="">Pilih Guru</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Hari</label>
                                <select 
                                    name="dayOfWeek" 
                                    value={formData.dayOfWeek} 
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-amber-500"
                                >
                                    {days.map((day, i) => <option key={i} value={i}>{day}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Jam Mulai</label>
                                <input 
                                    type="time" 
                                    name="startTime" 
                                    value={formData.startTime} 
                                    onChange={handleInputChange} 
                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-amber-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Jam Selesai</label>
                                <input 
                                    type="time" 
                                    name="endTime" 
                                    value={formData.endTime} 
                                    onChange={handleInputChange} 
                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-amber-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700">Target Level Kelas (Bisa pilih banyak)</label>
                            <div className="flex flex-wrap gap-3">
                                {levels.map(level => (
                                    <button
                                        key={level.id}
                                        type="button"
                                        onClick={() => handleLevelToggle(level.id)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${formData.levelIds.includes(level.id) ? 'bg-amber-500 border-amber-500 text-amber-950 shadow-md' : 'bg-white border-gray-100 text-gray-500 hover:border-amber-200'}`}
                                    >
                                        {level.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                Murid Terdaftar di Program, Cabang & Level Ini
                                {loadingStudents && <RefreshCw size={14} className="animate-spin text-amber-500" />}
                            </label>
                            
                            {!formData.programId || !formData.branchId || formData.levelIds.length === 0 ? (
                                <p className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-100">
                                    Silakan pilih Cabang, Program, & Level terlebih dahulu untuk melihat daftar murid.
                                </p>
                            ) : filteredStudents.length === 0 && !loadingStudents ? (
                                <p className="text-sm text-rose-400 font-bold bg-rose-50 p-4 rounded-2xl border-2 border-dashed border-rose-100">
                                    Tidak ada murid yang sesuai dengan kriteria kelas & program di cabang tersebut.
                                </p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-48 overflow-y-auto p-2 border-2 border-gray-50 rounded-2xl bg-gray-50/50">
                                    {filteredStudents.map(s => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => handleStudentToggle(s.id)}
                                            className={`p-2 text-xs font-bold rounded-lg transition-all border-2 ${formData.studentIds.includes(s.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-gray-100 text-gray-600 hover:border-indigo-200'}`}
                                        >
                                            <div className="text-[10px] opacity-70 mb-1">{s.level?.name}</div>
                                            {s.fullName}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors">Batal</button>
                            <button type="submit" className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200">Simpan Jadwal Rutin</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recurringSchedules.map((schedule) => (
                        <div key={schedule.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 flex gap-1">
                                <button onClick={() => handleEdit(schedule)} className="p-2 text-gray-300 hover:text-indigo-600 transition-colors">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={() => confirmDelete(schedule.id)} className="p-2 text-gray-300 hover:text-rose-500 transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xl font-bold text-gray-900">{schedule.program.name}</h4>
                                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                            {schedule.branch?.name || 'Semua Cabang'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-1 mb-2">
                                        {schedule.levels.map(sl => (
                                            <span key={sl.id} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold rounded-md border border-amber-100">
                                                {sl.level.name}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-500 text-sm font-semibold">{days[schedule.dayOfWeek]}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock size={18} className="text-indigo-500" />
                                    <span className="text-sm font-bold">{schedule.startTime} - {schedule.endTime}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Users size={18} className="text-indigo-500" />
                                    <span className="text-sm font-bold">{schedule.teacher.fullName}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Murid Terdaftar</p>
                                <div className="flex flex-wrap gap-2">
                                    {schedule.students.map(rs => (
                                        <span key={rs.id} className="px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-xs font-bold border border-gray-100">
                                            {rs.student.fullName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Modal Generate Sesi */}
            {showGenerateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowGenerateModal(false)}></div>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setShowGenerateModal(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <RefreshCw size={28} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-gray-900">Generate Sesi Absensi</h4>
                                <p className="text-gray-500 text-sm">Buat sesi harian dari jadwal rutin yang aktif</p>
                            </div>
                        </div>

                        <div className="bg-indigo-50 rounded-2xl p-4 mb-6 text-sm text-indigo-700 font-medium">
                            💡 Sistem akan otomatis membuat sesi pelajaran beserta daftar absensi untuk setiap hari dalam rentang tanggal yang dipilih.
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={generateDates.startDate}
                                    onChange={(e) => setGenerateDates({ ...generateDates, startDate: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-indigo-500 font-medium text-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    value={generateDates.endDate}
                                    onChange={(e) => setGenerateDates({ ...generateDates, endDate: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-indigo-500 font-medium text-gray-700"
                                />
                            </div>
                        </div>

                        {generateDates.startDate && generateDates.endDate && (
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-6 text-center">
                                <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">Rentang Periode</p>
                                <p className="text-amber-900 font-bold mt-1">
                                    {format(new Date(generateDates.startDate), 'd MMM yyyy', { locale: idLocale })} 
                                    &nbsp;→&nbsp;
                                    {format(new Date(generateDates.endDate), 'd MMM yyyy', { locale: idLocale })}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowGenerateModal(false)}
                                className="flex-1 px-6 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmGenerate}
                                className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} />
                                Generate Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
                                <AlertTriangle size={32} />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-2">Hapus Jadwal?</h4>
                            <p className="text-gray-500 mb-8">
                                Jadwal rutin ini akan dihapus secara permanen. Sesi yang sudah tergenerate tidak akan terpengaruh.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-6 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="flex-1 px-6 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all"
                                >
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleManagement;
