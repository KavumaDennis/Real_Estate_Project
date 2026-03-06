import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogService from '../services/blogService';
import { HiOutlineCalendar, HiOutlineArrowNarrowLeft, HiOutlineShare, HiOutlineBookmark } from 'react-icons/hi';
import { BiBuildingHouse } from 'react-icons/bi';
import SafeImage from '../components/SafeImage';
import { useAuth } from '../context/AuthContext';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        try {
            const response = await blogService.getPost(slug);
            setPost(response.data.data);
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) {
            window.location.href = '/login';
            return;
        }
        setSaving(true);
        try {
            const res = await blogService.toggleSaved(post.id);
            setSaved(res.data.saved);
        } catch (err) {
            console.error('Failed to toggle saved post:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: post?.title, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!post) return (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Post Not Found</h2>
            <Link to="/blog" className="text-blue-600 font-bold">Back to Blog</Link>
        </div>
    );

    return (
        <div className="min-h-screen pb-32">
            {/* Article Header */}
            <header className="pt-10">
                <div className="w-full">

                    <div className="w-full flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-3">
                            <span className="px-6 py-3 border border-black/30 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                                {post.category?.name}
                            </span>
                            <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
                            <span className="block text-xs text-start font-black text-black uppercase tracking-widest">5 min read</span>
                        </div>
                        <Link to="/blog" className="px-6 py-3 flex gap-1 items-center border border-black/30 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                            <HiOutlineArrowNarrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm uppercase tracking-widest">Journal</span>
                        </Link>
                    </div>

                    <h1 className="text-lg text-black text-start font-black uppercase tracking-widest mb-3">
                        {post.title}
                    </h1>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-5 border-t border-black">
                        <div className="flex items-center space-x-4">
                            <div>
                                <p className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Written by</p>
                                <p className="px-6 py-3 border border-black/10 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">{post.author?.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-5">
                            <div className="flex items-center text-gray-400">
                                <HiOutlineCalendar className="mr-2 h-6 w-6 text-blue-600" />
                                <span className="block text-xs text-start font-black text-black/80 uppercase tracking-widest">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleShare}
                                    className="p-3 py-2 border border-black/10 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest white hover:bg-blue-600 transition shadow-lg"
                                    title="Share this article"
                                >
                                    <HiOutlineShare className="h-5 w-5 text-white" />
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    title={saved ? 'Remove from saved' : 'Save this article'}
                                    className={`flex items-center gap-2 px-4 py-2 border border-black/10 text-xs font-black uppercase tracking-widest text-white transition shadow-lg ${saved ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-blue-600'}`}
                                >
                                    <HiOutlineBookmark className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
                                    <span>{saved ? 'Saved' : 'Save'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            <div className="w-full mb-10">
                <div className="aspect-[21/9] overflow-hidden border border-black/30">
                    <SafeImage src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Content */}
            <div className="w-full ">
                <div className="prose prose-2xl prose-gray max-w-none grid grid-cols-2 gap-5">
                    <p className="block text-lg h-fit pl-2 text-start font-black text-black uppercase tracking-widest border-l-5 border-amber-600">
                        {post.excerpt}
                    </p>
                    <div className="text-lg text-justify text-blue-800 leading-[1.8] whitespace-pre-line space-y-6">
                        {post.content}
                    </div>
                </div>

                <div className="mt-24 p-12 bg-green-600 text-white relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-3xl"></div>
                    <div className="relative z-10">
                        <BiBuildingHouse className="h-16 w-16 text-blue-500 mx-auto mb-6" />
                        <h3 className="text-3xl text-amber-500 font-black mb-4">Start your journey today.</h3>
                        <p className="text-white text-lg mb-10 max-w-md mx-auto">Explore premium listings curated for those who seek the extraordinary.</p>
                        <Link to="/properties" className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                            Browse Properties
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
