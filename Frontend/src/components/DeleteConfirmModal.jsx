import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, userName, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">

                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={40} className="text-red-500" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Hapus Pengguna?</h2>
                <p className="text-gray-500 mb-8">
                    Apakah Anda yakin ingin menghapus akun <span className="font-bold text-gray-800">"{userName}"</span>? Data tidak dapat dikembalikan.
                </p>

                <div className="flex gap-3 w-full">
                    <button onClick={onClose} disabled={isDeleting} className="flex-1 py-3 text-gray-600 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50">
                        Batal
                    </button>
                    <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50">
                        {isDeleting ? 'Menghapus...' : 'Ya, Hapus!'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
