import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { API_BASE_URL } from '../api/axiosInstance';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { Receipt, CheckCircle, XCircle, Clock, Eye, Search, Filter } from 'lucide-react';

const STATUS_CONFIG = {
    PENDING:  { label: 'Menunggu',    class: 'bg-amber-100 text-amber-800',  icon: Clock },
    VERIFIED: { label: 'Terverifikasi', class: 'bg-green-100 text-green-800', icon: CheckCircle },
    REJECTED: { label: 'Ditolak',     class: 'bg-red-100 text-red-800',      icon: XCircle },
};

const METHOD_CONFIG = {
    TRANSFER: { label: 'Transfer Bank', class: 'bg-blue-100 text-blue-700' },
    CASH:     { label: 'Tunai',         class: 'bg-purple-100 text-purple-700' },
};

const ProofImageModal = ({ url, onClose }) => {
    if (!url) return null;
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
            <div className="relative" onClick={e => e.stopPropagation()}>
                <img src={url} alt="Bukti Transfer" className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-2xl object-contain" />
                <button onClick={onClose} className="absolute top-2 right-2 bg-white/20 backdrop-blur text-white rounded-full p-1.5 hover:bg-white/40">
                    <XCircle size={20} />
                </button>
            </div>
        </div>
    );
};

const RejectNotesModal = ({ isOpen, onClose, onConfirm }) => {
    const [notes, setNotes] = useState('');
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6">
                <h4 className="font-bold text-gray-900 mb-3">Alasan Penolakan</h4>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-red-400 resize-none" placeholder="Contoh: Bukti transfer tidak jelas..." />
                <div className="flex gap-3 mt-4">
                    <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 rounded-xl font-medium hover:bg-gray-200">Batal</button>
                    <button onClick={() => { onConfirm(notes); setNotes(''); }} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700">Tolak</button>
                </div>
            </div>
        </div>
    );
};

const TransactionManagement = () => {
    const { user } = useOutletContext();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [search, setSearch] = useState('');

    const [proofImageUrl, setProofImageUrl] = useState(null);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedTxId, setSelectedTxId] = useState(null);

    const formatRupiah = (n) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filterStatus) params.append('paymentStatus', filterStatus);
            const res = await axiosInstance.get(`/transactions?${params.toString()}`);
            setTransactions(res.data.data);
        } catch {
            toast.error('Gagal memuat data transaksi');
        } finally {
            setLoading(false);
        }
    }, [filterStatus]);

    useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

    const handleVerify = async (id) => {
        try {
            await axiosInstance.put(`/transactions/${id}/verify`);
            toast.success('Transaksi berhasil diverifikasi! Paket siswa kini aktif.');
            fetchTransactions();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal memverifikasi transaksi');
        }
    };

    const handleReject = async (id, notes) => {
        try {
            await axiosInstance.put(`/transactions/${id}/reject`, { notes });
            toast.success('Transaksi berhasil ditolak');
            setIsRejectModalOpen(false);
            fetchTransactions();
        } catch (error) {
            toast.error('Gagal menolak transaksi');
        }
    };

    const isAdmin = user?.role === 'admin';

    const filtered = transactions.filter(tx => {
        const q = search.toLowerCase();
        return (
            tx.student?.fullName?.toLowerCase().includes(q) ||
            tx.programPackage?.name?.toLowerCase().includes(q) ||
            tx.id.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                <div className="flex items-center gap-3">
                    <Receipt className="text-indigo-700 w-8 h-8" />
                    <div>
                        <h3 className="text-3xl font-bold text-indigo-900 font-['Lexend']">
                            {isAdmin ? 'Manajemen Transaksi' : 'Riwayat Pembayaran'}
                        </h3>
                        <p className="text-gray-500 mt-1 text-sm">
                            {isAdmin ? 'Verifikasi & kelola semua pembayaran masuk' : 'Riwayat pembelian paket belajar anak Anda'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama siswa, paket, atau ID..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none text-sm" />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-white">
                        <option value="">Semua Status</option>
                        <option value="PENDING">Menunggu</option>
                        <option value="VERIFIED">Terverifikasi</option>
                        <option value="REJECTED">Ditolak</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-700"></div></div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <Receipt className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500">Belum ada transaksi ditemukan</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID / Tanggal</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Siswa</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Paket</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Metode</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    {isAdmin && <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map(tx => {
                                    const statusConf = STATUS_CONFIG[tx.paymentStatus] || {};
                                    const methodConf = METHOD_CONFIG[tx.paymentMethod] || {};
                                    const StatusIcon = statusConf.icon;
                                    return (
                                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-4">
                                                <p className="text-xs font-mono text-gray-400 truncate max-w-[120px]" title={tx.id}>{tx.id.split('-')[0]}...</p>
                                                <p className="text-xs text-gray-500 mt-1">{formatDate(tx.created_at)}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-gray-900 text-sm">{tx.student?.fullName || '-'}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-sm text-gray-700 font-medium">{tx.programPackage?.name || '-'}</p>
                                                <p className="text-xs text-gray-500">{tx.programPackage?.totalMeetings}x pertemuan</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-bold text-gray-900 text-sm">{formatRupiah(tx.amount)}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${methodConf.class}`}>{methodConf.label}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConf.class}`}>
                                                    {StatusIcon && <StatusIcon size={12} />} {statusConf.label}
                                                </span>
                                                {tx.paymentMethod === 'TRANSFER' && tx.paymentProof && (
                                                    <button onClick={() => setProofImageUrl(`${API_BASE_URL}/uploads/${tx.paymentProof}`)} className="mt-1 flex items-center gap-1 text-xs text-indigo-600 hover:underline">
                                                        <Eye size={12} /> Lihat Bukti
                                                    </button>
                                                )}
                                            </td>
                                            {isAdmin && (
                                                <td className="px-5 py-4 text-right">
                                                    {tx.paymentStatus === 'PENDING' && (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => handleVerify(tx.id)} className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1">
                                                                <CheckCircle size={13} /> Verifikasi
                                                            </button>
                                                            <button onClick={() => { setSelectedTxId(tx.id); setIsRejectModalOpen(true); }} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1">
                                                                <XCircle size={13} /> Tolak
                                                            </button>
                                                        </div>
                                                    )}
                                                    {tx.paymentStatus !== 'PENDING' && (
                                                        <span className="text-xs text-gray-400 italic">Sudah diproses</span>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ProofImageModal url={proofImageUrl} onClose={() => setProofImageUrl(null)} />
            <RejectNotesModal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} onConfirm={(notes) => handleReject(selectedTxId, notes)} />
        </div>
    );
};

export default TransactionManagement;
