import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import {
    HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineCreditCard,
    HiOutlineChatAlt2, HiOutlineTrendingUp, HiOutlineTrendingDown,
    HiOutlineArrowNarrowRight, HiOutlineClock, HiOutlineMail
} from 'react-icons/hi';
import SafeImage from '../components/SafeImage';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/dashboard');
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch admin stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) return (
        <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const statCards = [
        { name: 'Total Revenue', value: `$${(stats.total_revenue || 0).toLocaleString()}`, icon: HiOutlineCreditCard, color: 'bg-green-50 text-green-600', trend: '+12.5%' },
        { name: 'Active Users', value: stats.total_users || 0, icon: HiOutlineUsers, color: 'bg-blue-50 text-blue-600', trend: '+4.3%' },
        { name: 'Total Properties', value: stats.total_properties || 0, icon: HiOutlineOfficeBuilding, color: 'bg-purple-50 text-purple-600', trend: '+8.1%' },
        { name: 'Total Leads', value: stats.total_leads || 0, icon: HiOutlineChatAlt2, color: 'bg-amber-50 text-amber-600', trend: '-2.4%' },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Platform Overview</h1>
                    <p className="text-gray-500 font-medium">Monitoring real-time performance and system health.</p>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md cursor-pointer">
                    <HiOutlineClock className="text-gray-400 h-5 w-5" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Auto-updating every 5m</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <div key={card.name} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`${card.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                                <card.icon className="h-6 w-6" />
                            </div>
                            <span className={`flex items-center text-xs font-black px-3 py-1 rounded-full ${card.trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {card.trend.startsWith('+') ? <HiOutlineTrendingUp className="mr-1 h-3 w-3" /> : <HiOutlineTrendingDown className="mr-1 h-3 w-3" />}
                                {card.trend}
                            </span>
                        </div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{card.name}</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tight group-hover:text-blue-600 transition-colors">{card.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Revenue Chart Placeholder */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-xl font-black text-gray-900">Revenue Growth</h3>
                        <select className="bg-gray-50 border-none rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 focus:ring-0 cursor-pointer">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-72 flex items-end justify-between gap-4 px-2">
                        {stats.sales_chart?.labels?.map((label, i) => (
                            <div key={label} className="flex-grow flex flex-col items-center group">
                                <div className="w-full max-w-[50px] relative">
                                    <div
                                        className="bg-blue-600 rounded-t-2xl group-hover:bg-blue-400 transition-all duration-500 cursor-pointer shadow-lg shadow-blue-100"
                                        style={{ height: `${((stats.sales_chart.datasets[0].data[i] || 0) / Math.max(...(stats.sales_chart.datasets[0].data || [1]), 1)) * 240}px`, minHeight: '8px' }}
                                    >
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition shadow-xl whitespace-nowrap z-20">
                                            ${(stats.sales_chart.datasets[0].data[i] || 0).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-gray-400 mt-5 uppercase tracking-widest">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Mini-List */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-gray-900">New Agents</h3>
                            <Link to="/admin/users" className="text-blue-600 p-2 hover:bg-blue-50 rounded-xl transition">
                                <HiOutlineArrowNarrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                        <div className="space-y-5">
                            {stats.recent_users.map((user) => (
                                <div key={user.id} className="flex items-center space-x-4 group cursor-pointer">
                                    <div className="h-12 w-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-110 transition">
                                        {user.avatar ? <SafeImage src={user.avatar} className="h-full w-full object-cover" alt="" /> : <span className="text-gray-400 font-bold">{user.name.charAt(0)}</span>}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-black text-gray-900 text-sm truncate">{user.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{user.role?.name || 'User'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-teal-700 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
                        <h3 className="text-lg font-black mb-6 uppercase tracking-widest">Recent Activity</h3>
                        <div className="space-y-4">
                            {stats.recent_activity?.map((activity, i) => (
                                <div key={i} className="flex items-center space-x-4 p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition group/item">
                                    <div className="h-10 w-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-blue-600 group-hover/item:scale-110 transition">
                                        {activity.type === 'inquiry' ? <HiOutlineUsers /> : <HiOutlineOfficeBuilding />}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-black truncate">{activity.title}</p>
                                        <p className="text-[10px] text-white/60 font-medium truncate">{activity.desc}</p>
                                    </div>
                                </div>
                            ))}
                            {(!stats.recent_activity || stats.recent_activity.length === 0) && (
                                <p className="text-sm text-white/40 italic">No recent activity detected.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Grid for Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    <h3 className="text-xl font-black text-gray-900 mb-8 px-2">Latest Properties</h3>
                    <div className="divide-y divide-gray-50">
                        {stats.recent_properties.map(prop => (
                            <div key={prop.id} className="py-4 px-2 hover:bg-gray-50 transition rounded-2xl flex items-center justify-between group">
                                <div className="flex items-center space-x-4 overflow-hidden">
                                    <div className="h-12 w-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                        <SafeImage src={prop.images?.[0]} className="h-full w-full object-cover" alt="" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-black text-gray-900 text-sm truncate">{prop.title}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{prop.location?.name}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-blue-600 group-hover:translate-x-1 transition-transform animate-in fade-in duration-500">
                                    ${Number(prop.price).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                    <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                        <HiOutlineMail className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Needs Attention?</h3>
                    <p className="text-gray-400 text-sm font-medium mb-8 max-w-xs">You have 12 unread platform reports and 3 pending agent verifications.</p>
                    <Link to="/admin/reports" className="px-10 py-5 bg-gray-900 text-white rounded-3xl font-black transition hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 active:scale-95 text-center">
                        Open Reports Hub
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
