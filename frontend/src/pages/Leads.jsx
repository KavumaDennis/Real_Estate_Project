import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    HiMail, HiPhone, HiCalendar, HiChat, HiCheckCircle,
    HiXCircle, HiTrash, HiDotsVertical, HiFilter, HiSearch
} from 'react-icons/hi';
import SafeImage from '../components/SafeImage';

const Leads = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await api.get('/inquiries');
            setLeads(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch leads:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/inquiries/${id}`, { status });
            setLeads(leads.map(lead => lead.id === id ? { ...lead, status } : lead));
        } catch (err) {
            console.error('Failed to update lead status:', err);
        }
    };

    const handleDeleteLead = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            await api.delete(`/inquiries/${id}`);
            setLeads(leads.filter(lead => lead.id !== id));
        } catch (err) {
            console.error('Failed to delete lead:', err);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesFilter = filter === 'all' || lead.status === filter;
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone?.includes(searchTerm) ||
            lead.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.agent?.name?.toLowerCase().includes(searchTerm.toLowerCase());
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Leads & Inquiries</h1>
                    <p className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Manage property inquiries and track potential buyers.</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="w-full pl-10 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {['All', 'pending', 'contacted', 'closed'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`w-fit border border-black/20 p-2 px-4 focus:ring-0 text-sm font-bold text-black/70  ${filter === f ? 'bg-teal-700' : 'bg-white text-gray-500 border border-black/30 hover:bg-gray-50'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="bg-white p-20 text-center border border-dashed border-black/30 italic text-gray-400">
                    No inquiries found. When users message you about properties, they will appear here.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredLeads.map((lead) => (
                        <div key={lead.id} className="bg-white/50 p-6 border border-dashed border-black/30 shadow-sm hover:shadow-md transition group overflow-hidden relative">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 bg-amber-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                        {lead.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900">{lead.name}</h3>
                                        <p className="text-xs text-teal-600 font-bold uppercase tracking-widest flex items-center">
                                            <HiCalendar className="mr-1 h-3 w-3" />
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 shadow-md border border-black/20 text-[10px] font-black uppercase tracking-tighter ${getStatusColor(lead.status)}`}>
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
                                    <HiChat className="h-4 w-4 mr-3 text-gray-480" />
                                    <span className="line-clamp-2 italic">"{lead.message}"</span>
                                </div>
                            </div>

                            <div className="p-4 bg-teal-700 flex items-center justify-between mt-auto">
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <SafeImage
                                        src={lead.property?.images?.[0]}
                                        alt=""
                                        className="h-10 w-10 object-cover flex-shrink-0"
                                    />
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] text-start font-black text-amber-500 uppercase tracking-widest">
                                            {lead.property ? 'Inquired About' : 'Direct Contact To'}
                                        </p>
                                        <p className="text-xs text-start font-bold text-white truncate">
                                            {lead.property?.title || lead.agent?.name || 'General Inquiry'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleUpdateStatus(lead.id, 'contacted')}
                                        title="Mark as Contacted"
                                        className="p-2 text-white bg-blue-800 border border-black/20 transition"
                                    >
                                        <HiCheckCircle className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(lead.id, 'closed')}
                                        title="Close Lead"
                                        className="p-2 text-white bg-green-600 border border-black/20 transition"
                                    >
                                        <HiCheckCircle className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteLead(lead.id)}
                                        title="Delete Lead"
                                        className="p-2 text-white bg-rose-600 border border-black/20 transition"
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

export default Leads;
