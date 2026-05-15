import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { CheckCircle2, Clock, Calendar, User, BookOpen, AlertCircle, Save } from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import id from 'date-fns/locale/id';

const AttendanceManagement = () => {
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchSessions = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/schedules/daily`, {
                params: { 
                    startDate: format(startOfDay(new Date(selectedDate)), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
                    endDate: format(endOfDay(new Date(selectedDate)), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
                }
            });
            setSessions(res.data.data);
            setSelectedSession(null);
            setAttendances([]);
        } catch (error) {
            toast.error('Gagal memuat sesi');
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const fetchAttendance = async (session) => {
        try {
            setSelectedSession(session);
            const res = await axiosInstance.get(`/schedules/attendance/${session.id}`);
            setAttendances(res.data.data);
        } catch (error) {
            toast.error('Gagal memuat data absensi');
        }
    };

    const handleUpdateAttendance = async (attendanceId, status, notes) => {
        setIsUpdating(true);
        try {
            await axiosInstance.patch(`/schedules/attendance/${attendanceId}`, { status, notes });
            toast.success('Absensi diperbarui');
            // Refresh current attendance list
            fetchAttendance(selectedSession);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal update absensi');
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PRESENT': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'ABSENT': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'PERMIT': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-700">
                        <CheckCircle2 size={32} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 font-['Lexend']">Absensi & Sesi Les</h3>
                        <p className="text-gray-500 font-['Plus_Jakarta_Sans']">Monitor kehadiran dan kuota paket belajar</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-full md:w-auto">
                    <Calendar size={20} className="text-indigo-500 ml-2" />
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="p-2 outline-none font-bold text-gray-700 cursor-pointer"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* List Sesi */}
                <div className="lg:col-span-4 space-y-4">
                    <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Clock size={20} className="text-indigo-600" />
                        Sesi Hari Ini
                    </h4>
                    
                    {loading ? (
                        <div className="py-10 text-center text-gray-400">Memuat sesi...</div>
                    ) : sessions.length === 0 ? (
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center text-gray-400 font-semibold italic">
                            Tidak ada jadwal untuk tanggal ini
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => fetchAttendance(session)}
                                className={`w-full p-6 rounded-3xl border-2 transition-all text-left group ${selectedSession?.id === session.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white border-gray-50 hover:border-indigo-100 shadow-sm'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedSession?.id === session.id ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                                        {session.status}
                                    </span>
                                    <span className="text-xs opacity-70">
                                        {format(new Date(session.startTime), 'HH:mm')} - {format(new Date(session.endTime), 'HH:mm')}
                                    </span>
                                </div>
                                <h5 className="font-bold text-lg mb-0.5">{session.program.name}</h5>
                                <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${selectedSession?.id === session.id ? 'text-indigo-200' : 'text-indigo-600'}`}>
                                    📍 {session.branch?.name || 'Cabang'}
                                </p>
                                <p className={`text-xs ${selectedSession?.id === session.id ? 'text-indigo-100' : 'text-gray-500'}`}>
                                    Guru: {session.teacher.fullName}
                                </p>
                            </button>
                        ))
                    )}
                </div>

                {/* Detail Absensi */}
                <div className="lg:col-span-8">
                    {!selectedSession ? (
                        <div className="h-full flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
                            <AlertCircle size={48} className="text-gray-300 mb-4" />
                            <p className="text-gray-500 font-bold">Pilih sesi untuk melihat dan mengisi absensi</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-indigo-700 p-8 text-white">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-white/20 p-3 rounded-2xl">
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold">{selectedSession.program.name}</h4>
                                        <p className="text-indigo-100 text-sm">
                                            {format(new Date(selectedSession.date), 'EEEE, d MMMM yyyy', { locale: id })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-xs font-semibold text-indigo-100">
                                    <div className="flex items-center gap-1">
                                        <User size={14} /> {selectedSession.teacher.fullName}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} /> {format(new Date(selectedSession.startTime), 'HH:mm')} - {format(new Date(selectedSession.endTime), 'HH:mm')}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="space-y-4">
                                    {attendances.map((att) => (
                                        <div key={att.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-gray-100 shadow-sm">
                                                    {att.student.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h6 className="font-bold text-gray-900">{att.student.fullName}</h6>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                        Sisa Kuota: {att.studentPackage.remainingMeetings} Sesi
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 w-full md:w-auto">
                                                <select
                                                    value={att.status}
                                                    onChange={(e) => handleUpdateAttendance(att.id, e.target.value, att.notes)}
                                                    disabled={isUpdating}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold border-2 outline-none transition-all cursor-pointer ${getStatusColor(att.status)}`}
                                                >
                                                    <option value="PENDING">BELUM ABSEN</option>
                                                    <option value="PRESENT">HADIR</option>
                                                    <option value="ABSENT">ALPA (Pangkas Kuota)</option>
                                                    <option value="PERMIT">IZIN (Simpan Kuota)</option>
                                                </select>
                                                
                                                <input 
                                                    type="text" 
                                                    placeholder="Catatan..."
                                                    defaultValue={att.notes || ''}
                                                    onBlur={(e) => handleUpdateAttendance(att.id, att.status, e.target.value)}
                                                    className="flex-1 md:w-48 p-2 bg-white border-2 border-gray-100 rounded-xl text-sm outline-none focus:border-indigo-400"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceManagement;
