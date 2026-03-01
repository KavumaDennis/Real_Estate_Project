import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../services/blogService';
import SafeImage from '../components/SafeImage';
import { HiOutlineBookmark, HiOutlineCalendar, HiOutlineArrowNarrowRight } from 'react-icons/hi';

const SavedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSaved();
    }, []);

    const fetchSaved = async () => {
        setLoading(true);
        try {
            const res = await blogService.getSaved();
            setPosts(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch saved posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (id) => {
        try {
            await blogService.toggleSaved(id);
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Failed to unsave:', err);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Saved Articles</h1>
                    <p className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white shadow-lg">
                        Your bookmarked blog posts and articles.
                    </p>
                </div>
                <Link to="/blog" className="px-6 py-3 flex items-center gap-2 border border-black/10 bg-teal-700 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg w-fit">
                    Browse Blog
                </Link>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading saved articles...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="py-40 text-center border border-dashed border-black/20">
                    <HiOutlineBookmark className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">No Saved Articles</h2>
                    <p className="text-gray-400 font-medium mb-8">Start saving blog posts by clicking the bookmark button on any article.</p>
                    <Link to="/blog" className="px-6 py-3 inline-block border border-black/10 bg-amber-600 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                        Browse Journal
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <article key={post.id} className="group bg-white border border-black/10 overflow-hidden hover:shadow-xl transition-all duration-500">
                            <Link to={`/blog/${post.slug}`} className="block">
                                <div className="aspect-video overflow-hidden">
                                    <SafeImage
                                        src={post.featured_image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-5">
                                    <span className="inline-block mb-3 px-3 py-1 bg-amber-600/10 text-amber-700 text-[10px] font-black uppercase tracking-widest">
                                        {post.category?.name || 'Uncategorized'}
                                    </span>
                                    <h2 className="font-black text-black uppercase tracking-widest text-sm line-clamp-2 mb-3">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                                            <HiOutlineCalendar className="mr-1 h-4 w-4" />
                                            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center text-teal-700 text-xs font-black uppercase tracking-widest">
                                            Read <HiOutlineArrowNarrowRight className="ml-1 h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <div className="px-5 pb-4 border-t border-black/5 pt-3">
                                <button
                                    onClick={() => handleUnsave(post.id)}
                                    className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition"
                                >
                                    Remove from saved
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedPosts;
