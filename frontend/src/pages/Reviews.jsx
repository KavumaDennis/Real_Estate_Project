import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiStar, HiAnnotation, HiCheckCircle, HiEyeOff,
    HiTrash, HiSearch, HiFilter, HiUser, HiOutlineOfficeBuilding
} from 'react-icons/hi';
import SafeImage from '../components/SafeImage';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await api.get('/reviews');
            setReviews(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleApproval = async (id) => {
        try {
            const res = await api.post(`/reviews/${id}/toggle-approval`);
            setReviews(reviews.map(r => r.id === id ? res.data.data : r));
        } catch (err) {
            console.error('Failed to toggle approval:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await api.delete(`/reviews/${id}`);
            setReviews(reviews.filter(r => r.id !== id));
        } catch (err) {
            console.error('Failed to delete review:', err);
        }
    };

    const filteredReviews = reviews.filter(r => {
        const matchesFilter = filter === 'all' ||
            (filter === 'approved' && r.is_approved) ||
            (filter === 'pending' && !r.is_approved);
        const matchesSearch = r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.agent?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.comment.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Property Reviews</h1>
                    <p className="px-4 sm:px-6 py-2 sm:py-3 border border-black/30 relative bg-green-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg shrink-0">
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        Manage ratings and feedback.</p>
                </div>

                <div className="flex items-center px-4 py-2 border border-black/30 bg-indigo-600  relative w-fit">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <div className=''>
                        <p className="text-xl text-start font-black text-indigo-100 leading-none">{averageRating}</p>
                        <p className="text-[9px] text-start font-black text-black/70 uppercase tracking-widest leading-none mt-1">Avg Rating</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        className="pl-10 w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
                    {['all', 'approved', 'pending'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`min-w-fit px-6 py-2.5 relative border border-black/20 focus:ring-0 text-xs font-black uppercase tracking-widest transition flex-shrink-0 ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-black hover:bg-gray-50'
                                }`}
                        >
                            <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredReviews.length === 0 ? (
                <div className="bg-white p-20 text-center border border-gray-100 italic text-gray-400">
                    No reviews found matching your criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredReviews.map((review) => (
                        <div key={review.id} className="bg-white/50 relative p-6 sm:p-8 border border-dashed border-black/30 shadow-sm hover:shadow-md transition">
                            <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <div className="flex flex-col h-full lg:flex-row lg:items-start justify-between gap-6 z-10 relative">
                                <div className="flex-grow">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="h-12 w-12 bg-amber-600 flex items-center justify-center text-white font-black text-xl shrink-0 border border-black/10 overflow-hidden">
                                            {review.user?.avatar ? (
                                                <SafeImage src={review.user.avatar} className="h-full w-full object-cover" alt="" />
                                            ) : (
                                                review.user?.name?.charAt(0) || '?'
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-gray-900 leading-tight">{review.user?.name}</h3>
                                            <div className="flex items-center text-yellow-400 mt-1">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <HiStar key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                                <span className="text-gray-400 text-[10px] ml-2 font-bold">{new Date(review.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative text-indigo-600 font-medium pl-8">
                                        <HiAnnotation className="absolute left-0 top-0 h-6 w-6 text-indigo-700/70 -scale-x-100" />
                                        <p className="text-start italic leading-relaxed text-sm sm:text-base">"{review.comment}"</p>
                                    </div>

                                    <div className="mt-6 flex items-center p-3 bg-gray-50 border border-black/10 w-fit max-w-full">
                                        <div className="h-8 w-8 bg-white border border-black/10 flex items-center justify-center mr-3 flex-shrink-0">
                                            {review.property ? <HiOutlineOfficeBuilding className="text-blue-600 h-4 w-4" /> : <HiUser className="text-teal-600 h-4 w-4" />}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[9px] text-start font-black text-green-600 uppercase tracking-widest leading-none">
                                                {review.property ? 'Property' : 'Agent Profile'}
                                            </p>
                                            <p className="text-xs text-start font-bold text-gray-800 truncate max-w-[200px]">
                                                {review.property?.title || review.agent?.name || 'General Review'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col h-full items-end justify-between gap-2 lg:border-l lg:border-black/5 lg:pl-6">
                                    <button
                                        onClick={() => handleToggleApproval(review.id)}
                                        className={`flex-1 sm:flex-none lg:w-32 flex items-center justify-center space-x-2 px-4 py-2 border border-black/20 font-black text-[10px] uppercase tracking-widest transition ${review.is_approved
                                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                                            }`}
                                    >
                                        {review.is_approved ? <><HiEyeOff className="h-4 w-4" /><span>Hide</span></> : <><HiCheckCircle className="h-4 w-4" /><span>Approve</span></>}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="p-2.5 bg-rose-600 text-white hover:bg-red-700 border border-black/10 transition flex items-center justify-center shrink-0"
                                    >
                                        <HiTrash className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;
