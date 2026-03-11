import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    HiMail, HiPhone, HiCalendar, HiChat, HiCheckCircle, HiTrash, HiSearch,
    HiLockClosed
} from 'react-icons/hi';
import SafeImage from '../components/SafeImage';
import { MdMarkChatRead } from 'react-icons/md';

const Leads = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    const FILTERS = [
        { label: 'All', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
    ];

    useEffect(() => {
        fetchLeads(1);
    }, []);

    const fetchLeads = async (page = 1) => {
        setLoading(true);
        try {
            const res = await api.get('/inquiries', { params: { page } });
            setLeads(res.data.data || []);
            setMeta({
                current_page: res.data.meta?.current_page || 1,
                last_page: res.data.meta?.last_page || 1,
                total: res.data.meta?.total || 0,
            });
        } catch (err) {
            console.error('Failed to fetch leads:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/inquiries/${id}`, { status });
            setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
        } catch (err) {
            console.error('Failed to update lead status:', err);
        }
    };

    const handleDeleteLead = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            await api.delete(`/inquiries/${id}`);
            setLeads((prev) => prev.filter((lead) => lead.id !== id));
        } catch (err) {
            console.error('Failed to delete lead:', err);
        }
    };

    const filteredLeads = leads.filter((lead) => {
        const matchesFilter = filter === 'all' || lead.status === filter;
        const normalizedSearch = searchTerm.toLowerCase();
        const matchesSearch = (lead.name || '').toLowerCase().includes(normalizedSearch) ||
            lead.phone?.includes(searchTerm) ||
            (lead.email || '').toLowerCase().includes(normalizedSearch) ||
            lead.property?.title?.toLowerCase().includes(normalizedSearch) ||
            lead.agent?.name?.toLowerCase().includes(normalizedSearch);
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-orange-100 text-orange-600';
            case 'contacted': return 'bg-blue-100 text-blue-600';
            case 'closed': return 'bg-green-100 text-green-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Leads & Inquiries</h1>
                    <p className="px-4 sm:px-6 py-2 sm:py-3 border border-black/30 bg-green-600 relative text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg shrink-0">
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    Track potential buyers and inquiries.
                    </p>
                </div>

                <div className="w-full sm:w-auto">
                    <div className="relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="w-full pl-10 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`w-fit border border-black/30 relative p-2 px-4 focus:ring-0 text-sm font-bold text-black/70  ${filter === f.value ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-black/30 hover:bg-gray-50'
                            }`}
                    >
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        {f.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="bg-indigo-100/70 relative p-20 text-center border border-dashed border-black/30 italic text-gray-400">
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    No inquiries found. When users message you about properties, they will appear here.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredLeads.map((lead) => (
                        <div key={lead.id} className="bg-green-100/50 flex flex-col justify-between relative p-6 border border-dashed border-black/30 shadow-sm hover:shadow-md transition group overflow-hidden relative">
                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 bg-amber-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                        {(lead.name || '?').charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900">{lead.name}</h3>
                                        <p className="text-xs text-teal-600 font-bold uppercase tracking-widest flex items-center">
                                            <HiCalendar className="mr-1 h-3 w-3" />
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 shadow-md border border-black/30 text-[10px] font-black uppercase tracking-tighter ${getStatusColor(lead.status)}`}>
                                    {lead.status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-gray-800 font-medium text-sm">
                                    <HiMail className="h-4 w-4 mr-3 text-gray-480" />
                                    <span>{lead.email}</span>
                                </div>
                                <div className="flex items-center text-gray-800 font-medium text-sm">
                                    <HiPhone className="h-4 w-4 mr-3 text-gray-800" />
                                    <span>{lead.phone || 'No phone provided'}</span>
                                </div>
                                <div className="flex items-center text-gray-800 font-medium text-sm">
                                    <HiChat className="h-5 w-5 mr-3 text-gray-480" />
                                    <span className="line-clamp-2 italic text-start">"{lead.message}"</span>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-900 relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-auto gap-4">
                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <div className="h-10 w-10 shrink-0 border border-white/20 overflow-hidden">
                                        <SafeImage
                                            src={lead.property?.images?.[0]}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[9px] text-start font-black text-amber-500 uppercase tracking-widest">
                                            {lead.property ? 'Inquired About' : 'Direct Contact'}
                                        </p>
                                        <p className="text-xs text-start font-bold text-white truncate max-w-[200px]">
                                            {lead.property?.title || lead.agent?.name || 'General Inquiry'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-2">
                                    <button
                                        onClick={() => handleUpdateStatus(lead.id, 'contacted')}
                                        title="Mark as Contacted"
                                        className="flex-1 sm:flex-none p-2 relative z-10 text-white bg-blue-800 border border-white/10 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={lead.status === 'contacted'}
                                    >
                                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <MdMarkChatRead  className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(lead.id, 'closed')}
                                        title="Close Lead"
                                        className="flex-1 sm:flex-none p-2 relative z-10 text-white bg-green-600 border border-white/10 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={lead.status === 'closed'}
                                    >
                                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <HiLockClosed  className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteLead(lead.id)}
                                        title="Delete Lead"
                                        className="flex-1 sm:flex-none p-2 relative z-10 text-white bg-rose-600 border border-white/10 transition flex items-center justify-center"
                                    >
                                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <HiTrash className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && meta.last_page > 1 && (
                <div className="flex items-center justify-between pt-2">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                        {meta.total} total leads
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => fetchLeads(meta.current_page - 1)}
                            disabled={meta.current_page <= 1}
                            className="px-4 py-2 text-xs font-black uppercase tracking-widest border border-black/30 bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-700">
                            Page {meta.current_page} / {meta.last_page}
                        </p>
                        <button
                            type="button"
                            onClick={() => fetchLeads(meta.current_page + 1)}
                            disabled={meta.current_page >= meta.last_page}
                            className="px-4 py-2 text-xs font-black uppercase tracking-widest border border-black/30 bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leads;
