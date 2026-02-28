import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiOutlineSearch, HiOutlineFilter, HiOutlineDownload,
    HiOutlineCreditCard, HiOutlineUser, HiOutlineCalendar,
    HiOutlineBadgeCheck, HiOutlineReceiptTax
} from 'react-icons/hi';

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        fetchTransactions();
    }, [statusFilter, searchTerm]);

    const fetchTransactions = async (page = 1) => {
        setLoading(true);
        try {
            const res = await api.get('/admin/transactions', {
                params: {
                    page,
                    status: statusFilter,
                    search: searchTerm
                }
            });
            setTransactions(res.data.data || []);
            setPagination(res.data);
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-50 text-green-600';
            case 'pending': return 'bg-amber-50 text-amber-600';
            case 'failed': return 'bg-red-50 text-red-600';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Financial Transactions</h1>
                    <p className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Monitor all platform payments, subscriptions, and payouts.</p>
                </div>
                <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black flex items-center space-x-2 hover:bg-blue-600 transition shadow-xl tracking-widest text-xs uppercase">
                    <HiOutlineDownload className="h-5 w-5" />
                    <span>Export CSV</span>
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-teal-700 p-6 shadow-sm border border-black/20 flex items-end space-x-4">
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 flex items-center justify-center">
                        <HiOutlineReceiptTax className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="block text-xs text-start font-black text-white uppercase tracking-widest">Total Revenue</p>
                        <p className="block text-xs text-start font-black text-black uppercase tracking-widest">$124,500.00</p>
                    </div>
                </div>
                <div className="bg-teal-700 p-6 shadow-sm border border-black/20 flex items-end space-x-4">
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <HiOutlineBadgeCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="block text-xs text-start font-black text-white uppercase tracking-widest">1,208</p>
                        <p className="block text-xs text-start font-black text-black uppercase tracking-widest">Successful</p>
                    </div>
                </div>
                <div className="bg-teal-700 p-6 shadow-sm border border-black/20 flex items-end space-x-4">
                    <div className="h-12 w-12 bg-amber-50 text-amber-600 flex items-center justify-center">
                        <HiOutlineCreditCard className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="block text-xs text-start font-black text-white uppercase tracking-widest">$8,420.00</p>
                        <p className="block text-xs text-start font-black text-black uppercase tracking-widest">Fees Collected</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-grow">
                    <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Filter categories by name or slug..."
                        className="flex-grow w-full pl-10 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold placeholder-black/70"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <HiOutlineFilter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" />
                        <select
                            className="pl-10 pr-10 px-6 py-2.5 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg cursor-pointer min-w-[160px]"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/50 border border-dashed border-black/20 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-40 flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Syncing ledger...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="p-40 text-center italic text-gray-400">No transactions recorded for this criteria.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction ID</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                                <HiOutlineReceiptTax className="h-4 w-4" />
                                            </div>
                                            <code className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-tighter">
                                                #{t.transaction_id || t.id.toString().padStart(6, '0')}
                                            </code>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black text-sm">
                                                {t.user?.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 tracking-tight">{t.user?.name}</p>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest underline decoration-blue-100">View Profile</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-gray-900 tracking-tight">
                                        ${parseFloat(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-xs text-gray-500 font-bold">
                                            <HiOutlineCalendar className="mr-2 h-4 w-4 text-gray-300" />
                                            <span>{new Date(t.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center ${getStatusColor(t.status)}`}>
                                            <div className={`h-1.5 w-1.5 rounded-full mr-2 ${t.status === 'completed' ? 'bg-green-600' : 'bg-amber-600'}`} />
                                            {t.status || 'Success'}
                                        </span>
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

export default AdminTransactions;
