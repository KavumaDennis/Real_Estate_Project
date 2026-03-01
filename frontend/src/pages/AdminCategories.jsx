import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiOutlineSearch, HiOutlinePencil,
    HiOutlineCollection, HiOutlineExternalLink, HiOutlineInformationCircle
} from 'react-icons/hi';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', slug: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);

    const STANDARD_CATEGORIES = ['house', 'apartment', 'commercial', 'land'];

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/admin/categories');
            // Ensure only standard categories are shown/managed if needed, 
            // but for now we'll just show what's in the DB and highlight they are fixed.
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/admin/categories/${currentCategory.id}`, currentCategory);
            }
            fetchCategories();
            closeModal();
        } catch (err) {
            console.error('Error saving category:', err);
        }
    };

    const openModal = (category) => {
        setCurrentCategory(category);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCategory({ name: '', slug: '', description: '' });
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Standard Categories</h1>
                    <p className="px-4 sm:px-6 py-2 sm:py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg shrink-0">Manage core property types.</p>
                </div>
                <div className="flex items-center space-x-2 text-blue-600 font-black bg-blue-50 px-4 py-2 border border-blue-100 uppercase text-[9px] tracking-widest shadow-sm w-fit">
                    <HiOutlineInformationCircle className="h-4 w-4" />
                    <span>Fixed: 4 Types</span>
                </div>
            </div>

            {/* Search */}
            <div className="relative flex-grow">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Filter categories..."
                    className="flex-grow w-full pl-10 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold placeholder-black/70"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Categories List */}
            <div className="bg-white/50 border border-dashed border-black/20 shadow-sm overflow-x-auto scrollbar-hide">
                {loading ? (
                    <div className="p-20 sm:p-40 flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                        <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Syncing...</p>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="p-20 sm:p-40 text-center italic text-gray-400 font-bold uppercase text-[10px] tracking-widest">No categories.</div>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-amber-600 border-b border-black/20">
                                <th className="px-6 py-5 text-[9px] font-black text-white uppercase tracking-[0.2em]">Category Info</th>
                                <th className="px-6 py-5 text-[9px] font-black text-white uppercase tracking-[0.2em]">System ID</th>
                                <th className="px-6 py-5 text-[9px] font-black text-white uppercase tracking-[0.2em]">Usage</th>
                                <th className="px-6 py-5 text-[9px] font-black text-white uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/10">
                            {filteredCategories.map((c) => (
                                <tr key={c.id} className="bg-teal-700 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 w-10 bg-white/10 text-amber-500 border border-white/10 flex items-center justify-center shrink-0">
                                                <HiOutlineCollection className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-black text-white text-sm tracking-tight capitalize">{c.name}</p>
                                                <p className="text-[10px] text-white/50 line-clamp-1 max-w-[200px]">{c.description || 'Core platform type.'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <code className="text-[9px] font-black bg-black/20 border border-white/5 px-2 py-1 text-amber-500 uppercase tracking-widest">
                                            {c.slug}
                                        </code>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                            <HiOutlineExternalLink className="mr-2 h-3.5 w-3.5" />
                                            <span>Active</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => openModal(c)}
                                            className="p-2.5 bg-amber-600 text-white hover:bg-white hover:text-amber-600 transition shadow-sm border border-black/10"
                                            title="Edit"
                                        >
                                            <HiOutlinePencil className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-teal-700 border border-black/20 w-full max-w-md p-6 sm:p-10 shadow-2xl animate-in zoom-in duration-300">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Edit Category</h2>
                            <p className="text-white/50 text-xs font-black uppercase tracking-widest mt-2">Update public description.</p>
                        </div>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2 opacity-40">
                                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest">System Name (Locked)</label>
                                <input
                                    type="text"
                                    disabled
                                    className="w-full bg-gray-50 border border-black/80 p-3 text-sm font-black text-black/50 tracking-widest uppercase"
                                    value={currentCategory.name}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Description</label>
                                <textarea
                                    className="w-full bg-gray-50 border border-black/80 p-3 focus:ring-0 text-sm font-bold text-black/70 min-h-[120px] resize-none"
                                    placeholder="Describe this property type..."
                                    value={currentCategory.description || ''}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-4 bg-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/20 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-amber-600 text-white font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition shadow-xl"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
