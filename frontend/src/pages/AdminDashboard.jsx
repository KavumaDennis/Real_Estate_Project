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
        { name: 'Total Revenue', value: `$${(stats.total_revenue || 0).toLocaleString()}`, icon: HiOutlineCreditCard },
        { name: 'Active Users', value: stats.total_users || 0, icon: HiOutlineUsers },
        { name: 'Total Properties', value: stats.total_properties || 0, icon: HiOutlineOfficeBuilding },
        { name: 'Total Leads', value: stats.total_leads || 0, icon: HiOutlineChatAlt2 },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Platform Overview</h1>
                    <p className="px-4 sm:px-6 py-2 sm:py-3 border border-black/30 relative bg-green-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        Monitoring real-time performance and system health.</p>
                </div>
                <div className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 relative z-10 border border-black/10 bg-indigo-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg cursor-pointer">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <HiOutlineClock className="h-5 w-5" />
                    <span className="">Auto-updating every 5m</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {statCards.map((card) => (
                    <div key={card.name} className="bg-indigo-600 relative p-4 border border-black/30 shadow-sm hover:shadow-xl transition-all duration-300 group">
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-3 bg-green-600 text-white transition-transform duration-300`}>
                                <card.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <h3 className="text-2xl text-start sm:text-3xl font-black text-white mt-2 tracking-tight group-hover:text-blue-600 transition-colors">{card.value}</h3>
                        <p className="text-black text-start text-[10px] font-black uppercase tracking-[0.2em]">{card.name}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
                {/* Revenue Chart Placeholder */}
                <div className="lg:col-span-2 bg-white/50 z-10 relative h-fit p-10 border border-dashed border-black/30 shadow-sm">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
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

                <div className="bg-green-600 relative z-10 p-8 border border-black/20 shadow-sm">
                 <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <div className="flex items-center justify-between mb-8 z-10 relative">
                        <h3 className="text-lg font-black text-white">New Agents</h3>
                        <Link to="/admin/users" className="text-white p-2 bg-indigo-600 border border-black/30 transition">
                            <HiOutlineArrowNarrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                    <div className="space-y-5">
                        {stats.recent_users.map((user) => (
                            <div key={user.id} className="flex items-center space-x-4 group cursor-pointer">
                                <div className="h-12 w-12 bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-110 transition">
                                    {user.avatar ? <SafeImage src={user.avatar} className="h-full w-full object-cover" alt="" /> : <span className="text-gray-400 font-bold">{user.name.charAt(0)}</span>}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-black text-black text-sm truncate">{user.name}</p>
                                    <p className="text-[10px] text-start text-white font-bold uppercase tracking-widest mt-0.5">{user.role?.name || 'User'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Grid for Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                <div className="bg-white/50 relative p-8 border border-dashed border-black/30 shadow-sm overflow-hidden">
                 <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <h3 className="text-xl text-start font-black text-black mb-5 px-2">Latest Properties</h3>
                    <div className="divide-y divide-black/30">
                        {stats.recent_properties.map(prop => (
                            <div key={prop.id} className="py-4 px-2 hover:bg-gray-50/50 transition flex items-center justify-between group">
                                <div className="flex items-center space-x-4 overflow-hidden">
                                    <div className="h-12 w-12 bg-gray-100 overflow-hidden flex-shrink-0">
                                        <SafeImage src={prop.images?.[0]} className="h-full w-full object-cover" alt="" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-black text-start text-gray-900 text-sm truncate">{prop.title}</p>
                                        <p className="text-[10px] text-start text-green-600 font-bold uppercase tracking-widest mt-0.5">{prop.location?.name}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-indigo-600 group-hover:translate-x-1 transition-transform animate-in fade-in duration-500">
                                    ${Number(prop.price).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Recent Activity Mini-List */}
                <div className="space-y-6">
                    <div className="bg-indigo-600 relative p-8 text-white shadow-xl overflow-hidden group">
                         <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <h3 className="text-lg font-black text-start mb-6 uppercase tracking-widest">Recent Activity</h3>
                        <div className="space-y-4">
                            {stats.recent_activity?.map((activity, i) => (
                                <div key={i} className="flex items-center space-x-4 p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition group/item">
                                    <div className="h-10 w-10 bg-white shadow-sm flex items-center justify-center text-blue-600 group-hover/item:scale-110 transition">
                                        {activity.type === 'inquiry' ? <HiOutlineUsers /> : <HiOutlineOfficeBuilding />}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm text-start text-black font-black truncate">{activity.title}</p>
                                        <p className="text-[10px] text-start text-indigo-100 font-medium truncate">{activity.desc}</p>
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
        </div>
    );
};

export default AdminDashboard;
