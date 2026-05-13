import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { X, ShoppingCart, CreditCard, Upload, CheckCircle, Loader } from 'lucide-react';

const MEETING_OPTIONS = [
    { value: 4, label: '4x Pertemuan' },
    { value: 8, label: '8x Pertemuan' },
    { value: 12, label: '12x Pertemuan' },
];

const PurchasePackageModal = ({ isOpen, onClose, student }) => {
    const [programs, setPrograms] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loadingPrograms, setLoadingPrograms] = useState(false);
    const [loadingPackages, setLoadingPackages] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [step, setStep] = useState(1); // 1: pilih paket, 2: pilih metode bayar, 3: sukses
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('TRANSFER');
    const [proofFile, setProofFile] = useState(null);
    const [proofPreview, setProofPreview] = useState(null);
    const [notes, setNotes] = useState('');

    const formatRupiah = (number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);

    const fetchPrograms = useCallback(async () => {
        try {
            setLoadingPrograms(true);
            const res = await axiosInstance.get('/programs');
            setPrograms(res.data.data);
        } catch {
            toast.error('Gagal memuat program');
        } finally {
            setLoadingPrograms(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchPrograms();
            setStep(1);
            setSelectedProgram('');
            setSelectedPackage(null);
            setPaymentMethod('TRANSFER');
            setProofFile(null);
            setProofPreview(null);
            setNotes('');
        }
    }, [isOpen, fetchPrograms]);

    useEffect(() => {
        if (!selectedProgram) { setPackages([]); return; }
        const fetchPkg = async () => {
            try {
                setLoadingPackages(true);
                setSelectedPackage(null);
                const res = await axiosInstance.get(`/program-packages?programId=${selectedProgram}`);
                setPackages(res.data.data.filter(p => p.isActive));
            } catch {
                toast.error('Gagal memuat paket');
            } finally {
                setLoadingPackages(false);
            }
        };
        fetchPkg();
    }, [selectedProgram]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { toast.error('Ukuran file maksimal 2 MB'); return; }
        setProofFile(file);
        setProofPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        if (!selectedPackage) return;
        if (paymentMethod === 'TRANSFER' && !proofFile) {
            toast.error('Harap unggah bukti transfer terlebih dahulu');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('studentId', student.id);
            formData.append('programPackageId', selectedPackage.id);
            formData.append('amount', selectedPackage.price);
            formData.append('paymentMethod', paymentMethod);
            if (notes) formData.append('notes', notes);
            if (proofFile) formData.append('paymentProof', proofFile);

            await axiosInstance.post('/transactions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal membuat transaksi');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ShoppingCart size={24} />
                        <div>
                            <h3 className="font-bold text-lg">Beli Paket Belajar</h3>
                            <p className="text-indigo-200 text-sm">{student?.fullName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Step Indicator */}
                {step < 3 && (
                    <div className="flex items-center px-6 py-3 bg-indigo-50 border-b border-indigo-100">
                        {['Pilih Paket', 'Pembayaran'].map((label, i) => (
                            <React.Fragment key={i}>
                                <div className={`flex items-center gap-2 text-sm font-medium ${step === i + 1 ? 'text-indigo-700' : step > i + 1 ? 'text-green-600' : 'text-gray-400'}`}>
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === i + 1 ? 'bg-indigo-600 text-white' : step > i + 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</span>
                                    {label}
                                </div>
                                {i < 1 && <div className="flex-1 h-px bg-gray-200 mx-3"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                )}

                <div className="p-6">
                    {/* STEP 1: Pilih Program & Paket */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Program Belajar</label>
                                {loadingPrograms ? <div className="h-10 bg-gray-100 animate-pulse rounded-lg"></div> : (
                                    <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                        <option value="">-- Pilih Program --</option>
                                        {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                )}
                            </div>

                            {selectedProgram && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Varian Paket</label>
                                    {loadingPackages ? (
                                        <div className="space-y-2">
                                            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl"></div>)}
                                        </div>
                                    ) : packages.length === 0 ? (
                                        <p className="text-center text-gray-500 py-4 bg-gray-50 rounded-xl">Belum ada paket tersedia untuk program ini</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {packages.map(pkg => (
                                                <button key={pkg.id} onClick={() => setSelectedPackage(pkg)}
                                                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedPackage?.id === pkg.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}>
                                                    <div className="text-left">
                                                        <p className="font-semibold text-gray-900">{pkg.name}</p>
                                                        <p className="text-xs text-gray-500">{pkg.totalMeetings}x pertemuan</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-indigo-700">{formatRupiah(pkg.price)}</p>
                                                        {selectedPackage?.id === pkg.id && <CheckCircle size={18} className="text-indigo-600 ml-auto mt-1" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2: Pembayaran */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <div className="bg-indigo-50 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-indigo-600 font-medium">Paket Dipilih</p>
                                    <p className="font-bold text-indigo-900">{selectedPackage?.name}</p>
                                </div>
                                <p className="text-xl font-extrabold text-indigo-700">{formatRupiah(selectedPackage?.price)}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Metode Pembayaran</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[{ value: 'TRANSFER', label: '🏦 Transfer Bank', desc: 'Upload bukti TF' }, { value: 'CASH', label: '💵 Bayar Tunai', desc: 'Langsung ke kasir' }].map(m => (
                                        <button key={m.value} onClick={() => setPaymentMethod(m.value)}
                                            className={`p-3 rounded-xl border-2 text-left transition-all ${paymentMethod === m.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <p className="font-semibold text-sm text-gray-900">{m.label}</p>
                                            <p className="text-xs text-gray-500">{m.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {paymentMethod === 'TRANSFER' && (
                                <div>
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
                                        <p className="text-sm text-amber-800 font-medium">Info Rekening Transfer</p>
                                        <p className="text-sm text-amber-700 mt-1">BCA: <span className="font-bold">1234-5678-9012</span></p>
                                        <p className="text-sm text-amber-700">a.n. <span className="font-bold">Bimbel Pro Indonesia</span></p>
                                    </div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Bukti Transfer <span className="text-red-500">*</span></label>
                                    <div onClick={() => document.getElementById('proofInput').click()}
                                        className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                                        {proofPreview ? (
                                            <img src={proofPreview} alt="Bukti Transfer" className="max-h-36 mx-auto rounded-lg object-contain" />
                                        ) : (
                                            <div className="py-4">
                                                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                                                <p className="text-sm text-gray-500">Klik untuk pilih gambar (JPG/PNG, max 2MB)</p>
                                            </div>
                                        )}
                                    </div>
                                    <input id="proofInput" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </div>
                            )}

                            {paymentMethod === 'CASH' && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <p className="text-sm text-green-800">Silakan datang ke cabang bimbel Anda dan lakukan pembayaran tunai. Admin akan mengaktifkan paket setelah pembayaran diterima.</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Catatan (Opsional)</label>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Tambahkan catatan jika diperlukan..." />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Sukses */}
                    {step === 3 && (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="text-green-500" size={36} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Pesanan Terkirim!</h4>
                            <p className="text-gray-600 text-sm">
                                {paymentMethod === 'TRANSFER'
                                    ? 'Pesanan Anda menunggu verifikasi Admin. Paket akan aktif setelah pembayaran dikonfirmasi.'
                                    : 'Pesanan Anda telah dibuat. Silakan datang ke kasir untuk melakukan pembayaran tunai.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Navigasi */}
                <div className="px-6 pb-6 flex justify-between items-center gap-3">
                    {step < 3 ? (
                        <>
                            <button onClick={() => step === 1 ? onClose() : setStep(1)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                                {step === 1 ? 'Batal' : 'Kembali'}
                            </button>
                            {step === 1 ? (
                                <button onClick={() => setStep(2)} disabled={!selectedPackage} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                    <CreditCard size={18} /> Lanjut ke Pembayaran
                                </button>
                            ) : (
                                <button onClick={handleSubmit} disabled={isSubmitting || (paymentMethod === 'TRANSFER' && !proofFile)} className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                    {isSubmitting ? <><Loader size={16} className="animate-spin" /> Memproses...</> : <><CheckCircle size={16} /> Konfirmasi Pesanan</>}
                                </button>
                            )}
                        </>
                    ) : (
                        <button onClick={onClose} className="w-full px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                            Selesai
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchasePackageModal;
