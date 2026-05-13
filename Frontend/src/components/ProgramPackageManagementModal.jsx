import React, { useState, useEffect, useCallback } from 'react';
import { X, Package, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';

const ProgramPackageManagementModal = ({ isOpen, onClose, programId, programName }) => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', totalMeetings: 4, price: 0, isActive: true });
    
    // Delete state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteData, setDeleteData] = useState({ id: null, name: '' });

    const fetchPackages = useCallback(async () => {
        if (!programId) return;
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/program-packages?programId=${programId}`);
            setPackages(res.data.data);
        } catch (error) {
            toast.error('Gagal memuat daftar paket');
        } finally {
            setLoading(false);
        }
    }, [programId]);

    useEffect(() => {
        if (isOpen) {
            fetchPackages();
            setIsFormVisible(false);
        }
    }, [isOpen, fetchPackages]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleOpenAdd = () => {
        setEditingId(null);
        setFormData({ name: '', totalMeetings: 4, price: 0, isActive: true });
        setIsFormVisible(true);
    };

    const handleOpenEdit = (pkg) => {
        setEditingId(pkg.id);
        setFormData({ name: pkg.name, totalMeetings: pkg.totalMeetings, price: pkg.price, isActive: pkg.isActive });
        setIsFormVisible(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, programId, totalMeetings: parseInt(formData.totalMeetings), price: parseFloat(formData.price) };
            if (editingId) {
                await axiosInstance.put(`/program-packages/${editingId}`, payload);
                toast.success('Paket berhasil diperbarui');
            } else {
                await axiosInstance.post('/program-packages', payload);
                toast.success('Paket berhasil ditambahkan');
            }
            setIsFormVisible(false);
            fetchPackages();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menyimpan paket');
        }
    };

    const confirmDelete = async () => {
        try {
            await axiosInstance.delete(`/program-packages/${deleteData.id}`);
            toast.success('Paket berhasil dihapus');
            setIsDeleteModalOpen(false);
            fetchPackages();
        } catch (error) {
            toast.error('Gagal menghapus paket');
        }
    };

    if (!isOpen) return null;

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Package className="text-indigo-600" size={24} />
                        Kelola Paket: {programName}
                    </h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
                    {!isFormVisible ? (
                        <div className="mb-4 flex justify-between items-center">
                            <p className="text-gray-600 text-sm">Atur pilihan pertemuan dan harga untuk program ini.</p>
                            <button onClick={handleOpenAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-1 transition-colors">
                                <Plus size={16} /> Tambah Varian
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                            <h4 className="font-bold text-gray-800 mb-4">{editingId ? 'Edit Varian Paket' : 'Tambah Varian Paket Baru'}</h4>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Cth: Paket 4x Pertemuan" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Pertemuan</label>
                                    <select name="totalMeetings" value={formData.totalMeetings} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value="4">4x Pertemuan</option>
                                        <option value="8">8x Pertemuan</option>
                                        <option value="12">12x Pertemuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div className="flex items-center mt-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 relative"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-700">Status Aktif</span>
                                    </label>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                    <button type="button" onClick={() => setIsFormVisible(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">Batal</button>
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">Simpan</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div></div>
                    ) : packages.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                            <p className="text-gray-500">Belum ada varian paket untuk program ini.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Paket</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pertemuan</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {packages.map((pkg) => (
                                        <tr key={pkg.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pkg.totalMeetings}x</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{formatRupiah(pkg.price)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {pkg.isActive ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle size={12} /> Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        <XCircle size={12} /> Tidak Aktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleOpenEdit(pkg)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1.5 rounded"><Edit2 size={16}/></button>
                                                    <button onClick={() => { setDeleteData({id: pkg.id, name: pkg.name}); setIsDeleteModalOpen(true); }} className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded"><Trash2 size={16}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            
            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                userName={`Paket ${deleteData.name}`}
            />
        </div>
    );
};

export default ProgramPackageManagementModal;
