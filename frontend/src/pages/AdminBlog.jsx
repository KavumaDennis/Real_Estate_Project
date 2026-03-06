import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiOutlineSearch, HiOutlinePlus, HiOutlinePencil,
    HiOutlineTrash, HiOutlineNewspaper, HiOutlineEye,
    HiOutlineUser, HiOutlineCalendar,
    HiChevronRight
} from 'react-icons/hi';
import SafeImage from '../components/SafeImage';

const AdminBlog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/admin/posts');
            setPosts(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this blog post?')) return;
        try {
            await api.delete(`/admin/posts/${id}`);
            fetchPosts();
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Blog Management</h1>
                    <p className="px-6 py-3 border border-black/10 bg-green-600 relative text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        Create and manage educational content and news for your platform.</p>
                </div>
                <button className="px-6 py-3 flex items-center border border-black/30 relative z-10 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>Create New Post</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative flex-grow">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    className="flex-grow w-full pl-10 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold placeholder-black/70"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="border border-black/20 shadow-sm overflow-hidden overflow-x-auto scrollbar-hide">
                {loading ? (
                    <div className="p-40 flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Syncing articles...</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="p-40 text-center italic text-gray-400 font-medium">No blog posts found. Time to write something!</div>
                ) : (
                    <table className="w-full text-left relative z-10 border-collapse">
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <thead>
                            <tr className="bg-green-600 border-b border-black/20">
                                <th className="px-8 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em]">Article Info</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em]">Author</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em]">Date</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-50">
                            {filteredPosts.map((p) => (
                                <tr key={p.id} className="bg-green-100 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-14 w-20 bg-gray-100 border border-black/30 overflow-hidden shadow-sm flex-shrink-0">
                                                {p.featured_image ? <SafeImage src={p.featured_image} className="h-full w-full object-cover" alt="" /> : <div className="h-full w-full flex items-center justify-center text-gray-300"><HiOutlineNewspaper className="h-6 w-6" /></div>}
                                            </div>
                                            <div>
                                                <p className="font-black text-indigo-600 tracking-tight line-clamp-1">{p.title}</p>
                                                <p className="text-[10px] text-black font-black uppercase tracking-widest line-clamp-1">{p.category?.name || 'Uncategorized'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-2">
                                            <HiOutlineUser className="h-4 w-4 text-black" />
                                            <span className="text-sm font-bold text-black/80">{p.author?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-xs text-indigo-600 font-black uppercase tracking-widest">
                                            <HiOutlineCalendar className="mr-2 h-4 w-4" />
                                            <span>{new Date(p.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 text-[10px] border border-black/30 font-black uppercase tracking-widest ${p.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end space-x-2 z-10 relative">
                                            <button className="p-2 px-2.5 text-blue-50  bg-green-600 border border-black/30 relative z-10">
                                                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                <HiChevronRight className="h-5 w-5" />
                                            </button>
                                            <button className="p-2 px-2.5 text-indigo-100 border border-black/20 bg-indigo-600 relative z-10">
                                                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                <HiOutlinePencil className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="p-2 px-2.5 text-indigo-100 border border-black/20 relative z-10 bg-red-600"
                                            >
                                                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
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
        </div>
    );
};

export default AdminBlog;
