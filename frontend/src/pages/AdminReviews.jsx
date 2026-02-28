import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiOutlineSearch, HiOutlineTrash, HiOutlineCheckCircle,
    HiOutlineXCircle, HiOutlineStar, HiOutlineHome
} from 'react-icons/hi';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await api.get('/reviews'); // Admin endpoint should handle all reviews
            setReviews(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleApproval = async (id) => {
        try {
            await api.post(`/reviews/${id}/toggle-approval`);
            fetchReviews();
        } catch (err) {
            console.error('Error toggling approval:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this review permanently?')) return;
        try {
            await api.delete(`/reviews/${id}`);
            fetchReviews();
        } catch (err) {
            console.error('Error deleting review:', err);
        }
    };

    const filteredReviews = reviews.filter(r =>
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.agent?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Platform Reviews</h1>
                    <p className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Moderate guest feedback and maintain platform quality standards.</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative flex-grow">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search by content, user, or property..."
                    className="flex-grow w-full pl-10 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold placeholder-black/70"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Reviews List */}
            <div className="border border-dashed border-black/20 bg-white/50 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-40 flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Syncing reviews...</p>
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="p-40 text-center italic text-gray-400 font-medium">No reviews to display.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Review & User</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Target Property</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rating</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredReviews.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 italic">"{r.comment}"</p>
                                            <div className="flex items-center space-x-2">
                                                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-black text-blue-600">
                                                    {r.user?.name.charAt(0)}
                                                </div>
                                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{r.user?.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-sm font-bold text-gray-600">
                                            {r.property ? (
                                                <>
                                                    <HiOutlineHome className="mr-2 text-gray-300" />
                                                    <span className="truncate max-w-[150px]">{r.property.title}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <HiUser className="mr-2 text-teal-500" />
                                                    <span className="truncate max-w-[150px]">{r.agent?.name || 'Agent Profile'}</span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-1 text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <HiOutlineStar key={i} className={`h-4 w-4 ${i < r.rating ? 'fill-current' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center ${r.is_approved ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {r.is_approved ? <HiOutlineCheckCircle className="mr-2 h-4 w-4" /> : <HiOutlineXCircle className="mr-2 h-4 w-4" />}
                                            {r.is_approved ? 'Approved' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleToggleApproval(r.id)}
                                                className={`p-3 border rounded-2xl transition shadow-sm bg-white ${r.is_approved ? 'text-red-400 border-red-100 hover:bg-red-50' : 'text-green-500 border-green-100 hover:bg-green-50'}`}
                                                title={r.is_approved ? 'Reject/Hide' : 'Approve'}
                                            >
                                                {r.is_approved ? <HiOutlineXCircle className="h-5 w-5" /> : <HiOutlineCheckCircle className="h-5 w-5" />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(r.id)}
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
        </div>
    );
};

export default AdminReviews;
