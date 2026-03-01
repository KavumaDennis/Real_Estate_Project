import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiX, HiCheck, HiPhotograph, HiEye, HiSearch, HiChevronRight, HiOutlineBookmark } from 'react-icons/hi';
import api from '../services/api';
import SafeImage from '../components/SafeImage';
import { Link } from 'react-router-dom';

const FALLBACK = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80';

// ── Post Form Modal ──────────────────────────────────────────
const PostModal = ({ post, categories, onClose, onSaved }) => {
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

            if (isEdit) {
                await api.post(`/admin/posts/${post.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/admin/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            onSaved();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save post. Please check your inputs.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 h-full backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-teal-700 border border-black/30 w-full max-w-3xl  shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 px-8 border-b">
                    <h2 className="text-2xl font-black text-gray-900">{isEdit ? 'Edit Post' : 'New Post'}</h2>
                    <button onClick={onClose} className="h-10 w-10 bg-amber-600  flex items-center justify-center hover:bg-gray-200 transition">
                        <HiX className="h-5 w-5" />
                    </button>
                </div>

                {error && (
                    <div className="mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-5 flex-1">
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

                <div className="p-8 flex gap-3 border-t justify-end bg-teal-700 pt-5">
                    <button onClick={onClose} className="px-6 py-3 border border-black text-xs text-start font-black uppercase tracking-widest text-black hover:bg-blue-600 transition shadow-lg">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className={`px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg ${form.status === 'published' ? ' hover:bg-green-700' : ' hover:bg-blue-700'}`}
                    >
                        {saving ? 'Saving...' : isEdit ? 'Update Post' : (form.status === 'published' ? 'Publish Post' : 'Save as Draft')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Delete Modal ─────────────────────────────────────────────
const DeleteModal = ({ post, onClose, onDeleted }) => {
    const [deleting, setDeleting] = useState(false);
    const handle = async () => {
        setDeleting(true);
        try { await api.delete(`/admin/posts/${post.id}`); onDeleted(); }
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
const BlogManager = () => {
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
            const [postsRes, catsRes] = await Promise.all([
                api.get('/admin/posts'),
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
                />
            )}
            {deletingPost && (
                <DeleteModal post={deletingPost} onClose={() => setDeletingPost(null)} onDeleted={handleDeleted} />
            )}

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Blog Manager</h1>
                    <p className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Write, edit, and publish your blog posts.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        to="/dashboard/saved-posts"
                        className="px-6 py-3 flex items-center gap-3 border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                    >
                        <HiOutlineBookmark className="h-5 w-5" />
                        <span>Saved Posts</span>
                    </Link>
                    <button
                        onClick={() => setShowNew(true)}
                        className="px-6 py-3 flex items-center gap-3 border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                    >
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
                    {['All', 'Published', 'Draft'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`w-full border border-black/30 px-4 p-2 focus:ring-0 text-sm font-bold text-black/70 ${statusFilter === s ? 'bg-teal-700 text-white' : 'text-gray-500  bg-white  hover:bg-gray-50'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Posts', value: posts.length, color: 'bg-teal-700text-blue-600' },
                    { label: 'Published', value: posts.filter(p => p.status === 'published').length, color: 'bg-teal-700 text-green-600' },
                    { label: 'Drafts', value: posts.filter(p => p.status === 'draft').length, color: 'bg-teal-700 text-orange-600' },
                ].map(stat => (
                    <div key={stat.label} className={`${stat.color} bg-teal-700 p-6 border border-black/30`}>
                        <p className="block text-xl text-start font-black text-white uppercase tracking-widest  mb-1">{stat.value}</p>
                        <p className="block text-xs text-start font-black text-black uppercase tracking-widest ">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Posts Table */}
            <div className="bg-white shadow-sm border border-black/30  overflow-hidden">
                {loading ? (
                    <div className="p-16 text-center text-gray-400 font-medium">Loading posts...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-16 text-center">
                        <p className="text-gray-400 font-bold mb-4">No posts found.</p>
                        <button onClick={() => setShowNew(true)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl">Write First Post</button>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-amber-600 border-b">
                                <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest">Post</th>
                                <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2">
                            {filtered.map(post => (
                                <tr key={post.id} className="bg-teal-700 transition">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-14 w-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                                <SafeImage
                                                    src={post.featured_image || FALLBACK}
                                                    className="w-full h-full object-cover"
                                                    alt=""
                                                />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 line-clamp-1">{post.title}</p>
                                                <p className="text-xs text-white mt-0.5 line-clamp-1">{post.excerpt || 'No excerpt'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-amber-500">{post.category?.name || '—'}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 text-xs font-black uppercase ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-white">
                                        {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-end space-x-1">
                                            <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-blue-600 border border-blue-50 transition" title="View">
                                                <HiChevronRight className="h-5 w-5" />
                                            </a>
                                            <button onClick={() => setEditingPost(post)} className="p-2 text-indigo-950 transition" title="Edit">
                                                <HiPencil className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => setDeletingPost(post)} className="p-2 text-rose-600/95 transition" title="Delete">
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
