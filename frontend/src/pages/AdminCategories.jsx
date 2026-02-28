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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Standard Categories</h1>
                    <p className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Manage descriptions for the platform's core property types.</p>
                </div>
                <div className="flex items-center space-x-2 text-blue-600 font-bold bg-blue-50 px-6 py-3 border border-blue-100 uppercase text-[10px] tracking-widest shadow-sm">
                    <HiOutlineInformationCircle className="h-5 w-5" />
                    <span>Fixed Architecture: 4 Types</span>
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
            <div className="bg-white/50 border border-dashed border-black/20 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-40 flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Syncing categories...</p>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="p-40 text-center italic text-gray-400 font-medium">No categories found.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-amber-600 border-b border-black/20">
                                <th className="px-8 py-6 text-[10px] font-black text-white uppercase tracking-[0.2em]">Category Info</th>
                                <th className="px-8 py-6 text-[10px] font-black text-white uppercase tracking-[0.2em]">System ID</th>
                                <th className="px-8 py-6 text-[10px] font-black text-white uppercase tracking-[0.2em]">Listings</th>
                                <th className="px-8 py-6 text-[10px] font-black text-white uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCategories.map((c) => (
                                <tr key={c.id} className="bg-teal-700 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition shadow-sm">
                                                <HiOutlineCollection className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-white tracking-tight capitalize">{c.name}</p>
                                                <p className="text-xs text-black line-clamp-1 max-w-xs">{c.description || 'Core platform type.'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <code className="text-[10px] font-black bg-white/20 border border-white/10 px-3 py-1.5 rounded-lg text-white uppercase tracking-widest">
                                            {c.slug}
                                        </code>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-sm font-bold text-amber-500">
                                            <HiOutlineExternalLink className="mr-2 text-gray-300" />
                                            <span>Dynamic Count</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => openModal(c)}
                                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 rounded-2xl transition shadow-sm"
                                                title="Edit Description"
                                            >
                                                <HiOutlinePencil className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-300">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-gray-900">Edit {currentCategory.name}</h2>
                            <p className="text-gray-500 font-medium">Update the public description for this category.</p>
                        </div>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2 opacity-50 cursor-not-allowed">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">System Name (Locked)</label>
                                <input
                                    type="text"
                                    disabled
                                    className="w-full px-6 py-4 bg-gray-100 border-transparent rounded-2xl font-bold"
                                    value={currentCategory.name}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Description</label>
                                <textarea
                                    className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition font-medium min-h-[120px]"
                                    placeholder="Describe this property type..."
                                    value={currentCategory.description || ''}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                />
                            </div>
                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-grow py-4 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-grow py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-100 uppercase tracking-widest text-xs"
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
