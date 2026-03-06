import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../services/blogService';
import { HiOutlineChevronRight, HiOutlineCalendar, HiOutlineUserCircle, HiOutlineArrowNarrowRight } from 'react-icons/hi';
import SafeImage from '../components/SafeImage';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [postsRes, catsRes] = await Promise.all([
                blogService.getPosts(),
                blogService.getCategories(),
            ]);
            setPosts(postsRes.data.data);
            setCategories(catsRes.data.data);
        } catch (error) {
            console.error('Error fetching blog data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-emerald-100/80 backdrop-blur-2xl min-h-screen mt-1">
            {/* Blog Hero */}
            <section className="bg-gray-900 py-24 relative overflow-hidden">
                <SafeImage src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover  absolute inset-0 opacity-100 " alt="Team" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/60 to-black/60"></div>
                <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                    <div className="w-full">
                        <span className="inline-flex items-center space-x-2 bg-indigo-600 backdrop-blur-md px-5 py-2.5 border border-white/20 mb-8 text-white text-sm font-black uppercase tracking-widest">Our Journal</span>
                        <h1 className="text-[40px] mx-auto  font-black bg-green-300/10 backdrop-blur-md border border-white/10 text-white/80  p-6 w-fit mb-8 leading-[0.9] tracking-tighter">Mastering the Art of Real Estate.</h1>
                        <p className="block max-w-2xl mx-auto my-6 text-center text-xs font-black text-white uppercase tracking-widest">Expert insights, market trends, and curated home design inspiration for the modern homeowner.</p>
                    </div>
                </div>
            </section>

            {/* Category Bar */}
            <div className="border-b sticky top-0 w-fit bg-green-600 border border-black/30 backdrop-blur-md z-40 mt-5">
                <div className="w-full">
                    <div className="flex items-center space-x-5 overflow-x-auto no-scrollbar pr-5">
                        <button className="px-6 py-3 border border-black/10 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">All Stories</button>
                        {categories.map(cat => (
                            <button key={cat.id} className="block text-xs text-start font-black text-black uppercase tracking-widest">
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="py-10 pt-1">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-96 bg-gray-100 rounded-[50px] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                        {posts.map((post, i) => (
                            <article key={post.id} className={`group ${i === 0 ? 'md:col-span-1' : ''}`}>
                                <Link to={`/blog/${post.slug}`} className="block">
                                    <div className={`relative overflow-hidden shadow-xl h-70`}>
                                        <SafeImage
                                            src={post.featured_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-white/20 backdrop-blur-md px-6 py-2 text-white text-xs font-black uppercase tracking-widest border border-white/20">
                                                {post.category?.name}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/20 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>

                                    <div className={i === 0 ? 'max-w-4xl' : ''}>
                                        <div className="flex items-center space-x-4 text-sm font-bold text-gray-400 uppercase tracking-[.2em] mb-2">
                                            <div className="flex items-center px-6 py-3 border border-black/30 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                                                <HiOutlineCalendar className="mr-2 h-5 w-5" />
                                                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </div>


                                        </div>
                                        <h2 className='block text-lg text-start font-black text-black uppercase tracking-widest'>
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-500 text-start text-lg leading-relaxed mb-5 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-xs text-start font-black text-black uppercase tracking-widest">
                                                <HiOutlineUserCircle className="mr-2 h-5 w-5" />
                                                {post.author?.name}
                                            </div>
                                            <div className="flex items-center w-fit px-6 py-2.5 border border-black/30 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                                                <span>Read Full Article</span>
                                                <HiOutlineArrowNarrowRight className="h-6 w-6" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <div className="text-center py-40">
                        <h2 className="text-4xl font-black text-gray-900">No stories found.</h2>
                        <p className="text-gray-500 mt-4">Check back later for new updates.</p>
                    </div>
                )}
            </main>

            {/* Newsletter Section */}
            <section className=" py-10">
                <div className="w-full">
                    <div className="bg-indigo-600 p-12 md:p-20 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-5 skew-x-12 translate-x-1/4"></div>
                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="block text-xl text-start font-black text-black uppercase tracking-widest mb-3">Stay ahead of the market.</h2>
                                <p className="text-xl text-start text-blue-100">Subscribe to our newsletter and get the latest real estate trends straight to your inbox.</p>
                            </div>
                            <div className="">
                                <form className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full bg-gray-50 border border-black p-2 focus:ring-0 text-sm font-bold placeholder-black/70"
                                    />
                                    <button className="flex items-center w-fit gap-1 px-6 py-3 bg-green-600 border border-black/10 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Blog;
