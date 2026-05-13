import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const StudentFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    formData,
    handleInputChange,
    modalMode,
    isSubmitting,
    branches,
    levels
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
                    <h3 className="text-xl font-bold text-gray-900">
                        {modalMode === 'add' ? 'Tambah Data Anak' : 'Edit Data Anak'}
                    </h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-5 overflow-y-auto">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1">
                            Nama Lengkap Siswa <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName || ''}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            placeholder="Contoh: Budi Santoso"
                        />
                    </div>

                    <div>
                        <label htmlFor="schoolName" className="block text-sm font-semibold text-gray-700 mb-1">
                            Asal Sekolah <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="schoolName"
                            name="schoolName"
                            value={formData.schoolName || ''}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            placeholder="Contoh: SDN 1 Jakarta"
                        />
                    </div>

                    <div>
                        <label htmlFor="branchId" className="block text-sm font-semibold text-gray-700 mb-1">
                            Cabang Bimbel <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="branchId"
                            name="branchId"
                            value={formData.branchId || ''}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white"
                        >
                            <option value="" disabled>-- Pilih Cabang --</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="levelId" className="block text-sm font-semibold text-gray-700 mb-1">
                            Tingkat Kelas <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="levelId"
                            name="levelId"
                            value={formData.levelId || ''}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white"
                        >
                            <option value="" disabled>-- Pilih Tingkat Kelas --</option>
                            {levels && levels.map(level => (
                                <option key={level.id} value={level.id}>
                                    {level.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-white transition-all ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200'}`}
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentFormModal;
