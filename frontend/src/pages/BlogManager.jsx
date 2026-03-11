import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiX, HiCheck, HiPhotograph, HiEye, HiSearch, HiChevronRight, HiOutlineBookmark } from 'react-icons/hi';
import api from '../services/api';
import SafeImage from '../components/SafeImage';
import { Link } from 'react-router-dom';

const FALLBACK = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80';

// ── Post Form Modal ──────────────────────────────────────────
const PostModal = ({ post, categories, onClose, onSaved, adminMode = false }) => {
    const isEdit = !!post;
    const [form, setForm] = useState({
        title: post?.title || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        category_id: post?.category?.id || '',
        status: post?.status || 'draft',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(post?.featured_image || null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => v !== '' && fd.append(k, v));
            if (imageFile) fd.append('image', imageFile);

            const basePath = adminMode ? '/admin/posts' : '/my-posts';
            if (isEdit) {
                await api.post(`${basePath}/${post.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post(basePath, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            onSaved();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save post. Please check your inputs.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 h-full backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-green-900 border border-white/30 w-full max-w-3xl z-10 relative  shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                <div className="flex items-center justify-between p-4 px-8 border-b">
                    <h2 className="text-2xl font-black text-indigo-100">{isEdit ? 'Edit Post' : 'New Post'}</h2>
                    <button onClick={onClose} className="h-10 w-10 bg-gray-900 border border-black/30 z-10 relative  flex items-center justify-center hover:bg-indigo-600 transition">
                        <HiX className="h-5 w-5" />
                    </button>
                </div>

                {error && (
                    <div className="mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-5 flex-1 z-10 relative">
                    {/* Featured Image */}
                    <div>
                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Featured Image</label>
                        <label className="relative block cursor-pointer group">
                            {imagePreview ? (
                                <div className="relative h-48 w-full rounded-2xl overflow-hidden">
                                    <SafeImage src={imagePreview} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                        <p className="text-white font-bold text-sm">Change Image</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center hover:border-blue-400 transition">
                                    <HiPhotograph className="h-8 w-8 text-gray-300 mb-2" />
                                    <p className="text-amber-500 text-sm font-medium">Upload featured image</p>
                                </div>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Title </label>
                        <input className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter post title..." required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Category</label>
                            <select className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                                <option value="">No Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Status</label>
                            <select className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Excerpt</label>
                        <textarea rows="2" className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Short summary shown in blog listings..." />
                    </div>

                    <div>
                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Content *</label>
                        <textarea rows="10" className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your full post content here..." required />
                    </div>
                </form>

                <div className="p-8 flex gap-3 border-t justify-end bg-green-900 relative pt-5">
                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <button onClick={onClose} className="px-6 py-3 relative z-10 bg-white border border-black text-xs text-start font-black uppercase tracking-widest text-black hover:bg-blue-600 transition shadow-lg">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className={`px-6 py-3 relative z-10 border border-black/10 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg ${form.status === 'published' ? ' hover:bg-green-700' : ' hover:bg-blue-700'}`}
                    >
                        {saving ? 'Saving...' : isEdit ? 'Update Post' : (form.status === 'published' ? 'Publish Post' : 'Save as Draft')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Delete Modal ─────────────────────────────────────────────
const DeleteModal = ({ post, onClose, onDeleted, adminMode = false }) => {
    const [deleting, setDeleting] = useState(false);
    const handle = async () => {
        setDeleting(true);
        const basePath = adminMode ? '/admin/posts' : '/my-posts';
        try { await api.delete(`${basePath}/${post.id}`); onDeleted(); }
        catch { setDeleting(false); }
    };
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-teal-700 border border-black/30 w-full max-w-md shadow-2xl p-8 text-center">
                <div className="h-16 w-16 bg-red-50/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HiTrash className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-amber-500 mb-3">Delete Post?</h2>
                <p className="text-white mb-8">
                    "<span className="font-bold ">{post.title}</span>" will be permanently removed.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-6 py-3 border border-black/30 bg-white text-xs text-center font-black uppercase tracking-widest text-black hover:bg-blue-600 transition shadow-lg">Cancel</button>
                    <button onClick={handle} disabled={deleting} className="flex-1 px-6 py-3 border border-black/30 bg-amber-600 text-xs text-center font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg transition disabled:opacity-50">
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main ─────────────────────────────────────────────────────
const BlogManager = ({ adminMode = false }) => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState(null);
    const [showNew, setShowNew] = useState(false);
    const [deletingPost, setDeletingPost] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [toast, setToast] = useState(null);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const postsEndpoint = adminMode ? '/admin/posts' : '/my-posts';
            const [postsRes, catsRes] = await Promise.all([
                api.get(postsEndpoint),
                api.get('/post-categories'),
            ]);
            setPosts(postsRes.data.data || []);
            setCategories(catsRes.data.data || catsRes.data || []);
        } catch (err) {
            console.error('Failed to load posts', err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

    const handleSaved = () => { setEditingPost(null); setShowNew(false); fetchData(); showToast('Post saved!'); };
    const handleDeleted = () => { setDeletingPost(null); fetchData(); showToast('Post deleted.'); };

    const filtered = posts.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-8">
            {toast && (
                <div className="fixed top-6 right-6 z-50 flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl bg-green-600 text-white font-bold text-sm">
                    <HiCheck className="h-5 w-5" />
                    <span>{toast}</span>
                </div>
            )}

            {(showNew || editingPost) && (
                <PostModal
                    post={editingPost}
                    categories={categories}
                    onClose={() => { setShowNew(false); setEditingPost(null); }}
                    onSaved={handleSaved}
                    adminMode={adminMode}
                />
            )}
            {deletingPost && (
                <DeleteModal post={deletingPost} onClose={() => setDeletingPost(null)} onDeleted={handleDeleted} adminMode={adminMode} />
            )}

            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">{adminMode ? 'Admin Blog Manager' : 'Blog Manager'}</h1>
                    <p className="px-6 py-3 border border-black/30 relative bg-green-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        {adminMode ? 'Create, update, delete, and view all platform blog posts.' : 'Write, edit, and publish your blog posts.'}</p>
                </div>
                <div className="flex items-center gap-2">
                    {!adminMode && (
                        <Link
                            to="/dashboard/saved-posts"
                            className="px-6 py-2.5 flex items-center z-10 relative gap-3 border border-black/10 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                        >
                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <HiOutlineBookmark className="h-5 w-5" />
                            <span>Saved Posts</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setShowNew(true)}
                        className="px-6 py-2.5 flex items-center gap-3 z-10 relative border border-black/10 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                    >
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <HiPlus className="h-5 w-5" />
                        <span>New Post</span>
                    </button>
                </div>

            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/70 h-5 w-5" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search posts..."
                        className="w-full bg-gray-50 border border-black/80 p-2 pl-10 focus:ring-0 text-sm font-bold text-black/70"
                    />
                </div>
                <div className="flex gap-3 overflow-hidden ">
                    {[
                        { label: 'All', value: 'all' },
                        { label: 'Published', value: 'published' },
                        { label: 'Draft', value: 'draft' },
                    ].map((s) => (
                        <button
                            key={s.value}
                            onClick={() => setStatusFilter(s.value)}
                            className={`w-full border border-black/30 relative px-4 p-2 focus:ring-0 text-sm font-bold text-black/70 ${statusFilter === s.value ? 'bg-gray-900 text-white' : 'text-black  bg-white  hover:bg-gray-50'}`}
                        >
                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Posts', value: posts.length },
                    { label: 'Published', value: posts.filter(p => p.status === 'published').length },
                    { label: 'Drafts', value: posts.filter(p => p.status === 'draft').length },
                ].map(stat => (
                    <div key={stat.label} className=" bg-gray-900 relative p-6 border border-black/30">
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <p className="block text-xl text-start font-black text-white uppercase tracking-widest  mb-1">{stat.value}</p>
                        <p className="block text-xs text-start font-black text-black uppercase tracking-widest ">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Posts Table */}
            <div className="bg-white relative shadow-sm border border-black/30  overflow-hidden">

                {loading ? (
                    <div className="p-16 text-center text-gray-400 font-medium">Loading posts...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-16 text-center">
                        <p className="text-gray-400 font-bold mb-4">No posts found.</p>
                        <button onClick={() => setShowNew(true)} className="px-6 py-3 relative z-10 bg-gray-900 border border-black/30 text-white font-bold">
                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            Write First Post</button>
                    </div>
                ) : (
                    <table className="w-full text-left z-10 relative">
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <thead>
                            <tr className="bg-green-600 border-b">
                                <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest">Post</th>
                                <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 relative">
                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            {filtered.map(post => (
                                <tr key={post.id} className="bg-green-100/50 transition z-10 relative">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-14 w-20 bg-gray-100 border border-black/30 overflow-hidden flex-shrink-0">
                                                <SafeImage
                                                    src={post.featured_image || FALLBACK}
                                                    className="w-full h-full object-cover"
                                                    alt=""
                                                />
                                            </div>
                                            <div>
                                                <p className="font-black text-indigo-600 line-clamp-1">{post.title}</p>
                                                <p className="text-xs text-black mt-0.5 line-clamp-1">{post.excerpt || 'No excerpt'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-green-600">{post.category?.name || '—'}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 text-xs font-black uppercase border border-black/30 ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-indigo-600">
                                        {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-end space-x-1">
                                            <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="p-2 text-indigo-100 px-2.5 relative z-10 bg-green-600 border border-black/30 transition" title="View">
                                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                <HiChevronRight className="h-5 w-5" />
                                            </a>
                                            <button onClick={() => setEditingPost(post)} className="p-2 px-2.5 relative z-10 bg-gray-900 border border-black/30 transition" title="Edit">
                                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                <HiPencil className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => setDeletingPost(post)} className="p-2 px-2.5 relative z-10 bg-rose-600 border border-black/30 transition" title="Delete">
                                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                <HiTrash className="h-5 w-5" />
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

export default BlogManager;
