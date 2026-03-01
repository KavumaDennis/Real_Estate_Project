import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiOutlineSearch, HiOutlinePlus, HiOutlinePencil,
    HiOutlineTrash, HiOutlineDocumentText, HiOutlineEye,
    HiOutlineCheckCircle, HiOutlineClock
} from 'react-icons/hi';

const AdminPages = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState({
        title: '',
        content: '',
        meta_title: '',
        meta_description: '',
        is_published: true
    });

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await api.get('/admin/pages');
            setPages(res.data);
        } catch (err) {
            console.error('Failed to fetch pages:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/admin/pages/${currentPage.id}`, currentPage);
            } else {
                await api.post('/admin/pages', currentPage);
            }
            fetchPages();
            closeModal();
        } catch (err) {
            console.error('Error saving page:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this CMS page?')) return;
        try {
            await api.delete(`/admin/pages/${id}`);
            fetchPages();
        } catch (err) {
            console.error('Error deleting page:', err);
        }
    };

    const openModal = (page = { title: '', content: '', meta_title: '', meta_description: '', is_published: true }) => {
        setCurrentPage(page);
        setIsEditing(!!page.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPage({ title: '', content: '', meta_title: '', meta_description: '', is_published: true });
    };

    const filteredPages = pages.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">CMS Pages</h1>
                    <p className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Manage static content like Privacy Policy, Terms, and Custom Landing Pages.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-6 py-3 flex items-center border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>Create New Page</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative flex-grow">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search by title or slug..."
                    className="flex-grow w-full pl-10 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold placeholder-black/70"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="border border-dashed border-black/20 bg-white/50 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-40 flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Syncing CMS...</p>
                    </div>
                ) : filteredPages.length === 0 ? (
                    <div className="p-40 text-center italic text-gray-400 font-medium">No pages created yet.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-teal-700 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-white uppercase tracking-[0.2em]">Page Title</th>
                                <th className="px-8 py-6 text-[10px] font-black text-white uppercase tracking-[0.2em]">Route Slug</th>
                                <th className="px-8 py-6 text-[10px] font-black text-white uppercase tracking-[0.2em]">Last Updated</th>
                                <th className="px-8 py-6 text-[10px] font-black text-white uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-white uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/30">
                            {filteredPages.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 bg-gray-50 border border-black/30 text-gray-400 flex items-center justify-center group-hover:scale-105 transition">
                                                <HiOutlineDocumentText className="h-6 w-6" />
                                            </div>
                                            <p className="font-black text-gray-900 tracking-tight">{p.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <code className="text-[10px] font-black border border-black/30 bg-amber-500 px-3 py-1.5  text-black tracking-tight">
                                            /{p.slug}
                                        </code>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-xs text-teal-700 font-bold">
                                            <HiOutlineClock className="mr-2 h-4 w-4 opacity-50" />
                                            <span>{new Date(p.updated_at).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 border border-black/30 text-[10px] font-black uppercase tracking-widest inline-flex items-center ${p.is_published ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                                            {p.is_published ? <HiOutlineCheckCircle className="mr-2 h-4 w-4" /> : null}
                                            {p.is_published ? 'Live' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => openModal(p)}
                                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 rounded-2xl transition shadow-sm"
                                            >
                                                <HiOutlinePencil className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-2xl transition shadow-sm"
                                            >
                                                <HiOutlineTrash className="h-5 w-5" />
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-teal-700 border border-black/20 w-full max-w-4xl p-10 shadow-2xl animate-in duration-300">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-white text-start">{isEditing ? 'Edit CMS Page' : 'Create CMS Page'}</h2>
                            <p className="text-amber-500 font-medium text-start">Control static content and landing pages.</p>
                        </div>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-2 flex flex-col items-start md:col-span-2">
                                    <label className="text-[10px] font-black text-black text-start uppercase tracking-widest">Page Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-4 bg-gray-50 border border-black/80 text-black/70 p-3 focus:ring-0 text-sm font-bold placeholder-black/70"
                                        placeholder="e.g. Terms and Conditions"
                                        value={currentPage.title}
                                        onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col items-start md:col-span-2">
                                    <label className="text-[10px] font-black text-black text-start uppercase tracking-widest">Page Content</label>
                                    <textarea
                                        required
                                        rows="5"
                                        className="w-full pl-4 bg-gray-50 border border-black/80 text-black/70 p-3 focus:ring-0 text-sm font-bold placeholder-black/70 font-mono"
                                        placeholder="HTML or Text content goes here..."
                                        value={currentPage.content}
                                        onChange={(e) => setCurrentPage({ ...currentPage, content: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col items-start">
                                    <label className="text-[10px] font-black text-black text-start uppercase tracking-widest">Meta Title (SEO)</label>
                                    <input
                                        type="text"
                                        className="w-full pl-4 bg-gray-50 border border-black/80 text-black/70 p-3 focus:ring-0 text-sm font-bold placeholder-black/70"
                                        placeholder="Optional meta title"
                                        value={currentPage.meta_title}
                                        onChange={(e) => setCurrentPage({ ...currentPage, meta_title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col items-start">
                                    <label className="text-[10px] font-black text-black text-start uppercase tracking-widest">Meta Description (SEO)</label>
                                    <input
                                        type="text"
                                        className="w-full pl-4 bg-gray-50 border border-black/80 text-black/70 p-3 focus:ring-0 text-sm font-bold placeholder-black/70"
                                        placeholder="Optional meta description"
                                        value={currentPage.meta_description}
                                        onChange={(e) => setCurrentPage({ ...currentPage, meta_description: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 border-t border-black/10">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={currentPage.is_published}
                                        onChange={(e) => setCurrentPage({ ...currentPage, is_published: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-black text-gray-900 uppercase tracking-widest">Publish Page Live</span>
                                </label>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-grow px-6 py-3 w-fit flex justify-start border border-black/10 bg-white text-xs text-start font-black uppercase tracking-widest text-black hover:bg-blue-600 transition shadow-lg "
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-grow px-6 py-3 w-fit flex justify-start border border-black/10 bg-amber-500 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg "
                                >
                                    {isEditing ? 'Save Changes' : 'Publish Page'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPages;

