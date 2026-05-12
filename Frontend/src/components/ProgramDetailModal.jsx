import React, { useState, useEffect } from 'react';
import { X, BookOpen } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const ProgramDetailModal = ({ isOpen, onClose, programId }) => {
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && programId) {
            const fetchProgramDetail = async () => {
                setLoading(true);
                setError('');
                try {
                    const response = await axiosInstance.get(`/programs/${programId}`);
                    setProgram(response.data.data);
                } catch (err) {
                    setError('Gagal memuat detail program.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProgramDetail();
        }
    }, [isOpen, programId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <BookOpen className="text-indigo-600" size={24} />
                        Detail Program
                    </h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-700"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500 font-medium">{error}</div>
                    ) : program ? (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{program.name}</h2>
                                <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold">
                                    Program Tersedia
                                </span>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Deskripsi Lengkap</h4>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {program.description}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
                
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2.5 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-colors">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProgramDetailModal;
