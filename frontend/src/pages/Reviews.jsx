import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiStar, HiAnnotation, HiCheckCircle, HiEyeOff,
    HiTrash, HiSearch, HiFilter, HiUser
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Property Reviews</h1>
                    <p className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Manage client feedback and property ratings.</p>
                </div>

                <div className="flex items-center bg-white/60 px-4 py-2 border border-black/30">

                    <div>
                        <p className="text-lg text-start font-black text-amber-600 leading-none">{averageRating}</p>
                        <p className="text-[10px] text-start font-black text-black/70 uppercase tracking-widest leading-none">Avg Rating</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
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
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                    {['all', 'approved', 'pending'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`w-full border border-black/20 px-4 p-2 focus:ring-0 text-sm font-bold text-black ${filter === f ? 'bg-teal-700 text-white' : 'bg-white border border-black/30 text-black'
                                }`}
                        >
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
                        <div key={review.id} className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex-grow">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg border-4 border-white">
                                            {review.user.avatar ? (
                                                <SafeImage src={review.user.avatar} className="h-full w-full object-cover rounded-2xl" alt="" />
                                            ) : (
                                                review.user.name.charAt(0)
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900">{review.user.name}</h3>
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <HiStar key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                                ))}
                                                <span className="text-gray-400 text-xs ml-2 font-bold">{new Date(review.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative pl-10">
                                        <HiAnnotation className="absolute left-0 top-0 h-8 w-8 text-blue-100 -scale-x-100" />
                                        <p className="text-gray-600 italic leading-relaxed text-lg">"{review.comment}"</p>
                                    </div>

                                    <div className="mt-6 flex items-center p-3 bg-gray-50 rounded-2xl border border-gray-100 w-fit max-w-full">
                                        <div className="h-8 w-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                            {review.property ? <HiOutlineOfficeBuilding className="text-blue-600 h-5 w-5" /> : <HiUser className="text-teal-600 h-5 w-5" />}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                                {review.property ? 'Property' : 'Agent Profile'}
                                            </p>
                                            <p className="text-xs font-bold text-gray-800 truncate">
                                                {review.property?.title || review.agent?.name || 'General Review'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex md:flex-col items-center gap-3">
                                    <button
                                        onClick={() => handleToggleApproval(review.id)}
                                        className={`flex-grow md:w-40 flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl font-black text-sm transition ${review.is_approved
                                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100'
                                            : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-100'
                                            }`}
                                    >
                                        {review.is_approved ? <><HiEyeOff className="h-4 w-4" /><span>Hide</span></> : <><HiCheckCircle className="h-4 w-4" /><span>Approve</span></>}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="p-3 bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 rounded-2xl transition"
                                    >
                                        <HiTrash className="h-5 w-5" />
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
