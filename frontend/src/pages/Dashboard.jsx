import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { HiOutlineOfficeBuilding, HiOutlineHeart, HiOutlineChatAlt2, HiUsers, HiEye } from 'react-icons/hi';

const CommonDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { name: 'Saved Properties', value: '0', icon: HiOutlineHeart, color: 'text-pink-600', bg: 'bg-pink-100' },
        { name: 'Active Inquiries', value: '0', icon: HiOutlineChatAlt2, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'My Reviews', value: '0', icon: HiOutlineOfficeBuilding, color: 'text-purple-600', bg: 'bg-purple-100' },
    ]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [savedRes, inquiriesRes, reviewsRes, analyticsRes] = await Promise.all([
                    api.get('/saved-properties'),
                    api.get('/inquiries'),
                    api.get('/reviews'),
                    api.get('/analytics'),
                ]);

                const savedCount = savedRes.data?.data?.length || 0;
                const inquiries = inquiriesRes.data?.data || [];
                const activeInquiriesCount = inquiries.filter((inquiry) => inquiry.status !== 'closed').length;
                const reviewsCount = reviewsRes.data?.data?.length || 0;
                const activity = analyticsRes.data?.recentActivity || [];

                setStats([
                    { name: 'Saved Properties', value: String(savedCount), icon: HiOutlineHeart, color: 'text-pink-600', bg: 'bg-pink-100' },
                    { name: 'Active Inquiries', value: String(activeInquiriesCount), icon: HiOutlineChatAlt2, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { name: 'My Reviews', value: String(reviewsCount), icon: HiOutlineOfficeBuilding, color: 'text-purple-600', bg: 'bg-purple-100' },
                ]);
                setRecentActivity(activity);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-8">
            <div className="">
                <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Hello, {user?.name}! 👋</h1>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <p className="px-6 py-3 w-fit relative border border-black/10 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        Welcome back to your dashboard. Here's what's happening today.</p>
                    {user?.role?.slug === 'admin' || user?.role?.slug === 'super-admin' && (
                        <a href="/admin" className="px-6 py-3 w-fit relative border border-black/10 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                            <img src="/bg-img.png" className="absolute w-full h-full object-cover opacity-20 inset-0" alt="" />
                            Admin Dashboard
                        </a>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-gray-900 relative p-6 shadow-sm border border-black/30 flex items-center space-x-4">
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <div className={`p-4 relative ${stat.bg} ${stat.color}`}>
                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <stat.icon className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="block text-xl text-start font-black text-white uppercase tracking-widest">{stat.value}</p>
                            <p className="block text-xs text-start font-black text-black uppercase tracking-widest">{stat.name}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-900 border border-black/30 shadow-sm p-5 relative">
                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                <h2 className="block text-lg text-start font-black text-white uppercase tracking-widest mb-6 relative z-10">Recent Activity</h2>
                {loading ? (
                    <div className="space-y-4 text-white/50 py-10 text-center italic relative z-10">
                        Loading recent activity...
                    </div>
                ) : recentActivity.length === 0 ? (
                    <div className="space-y-4 text-white/50 py-10 text-center italic relative z-10">
                        No recent activity to show.
                    </div>
                ) : (
                    <div className="space-y-4 z-10 relative">
                        {recentActivity.map((item, idx) => (
                            <div key={`${item.title}-${idx}`} className="flex items-center justify-between p-4 border-green-600 border-y-2 relative z-10 hover:border-blue-100 hover:bg-green-600 transition">
                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                <div className="flex items-center space-x-4 relative z-10">
                                    <div className="h-10 w-10 bg-white shadow-sm flex items-center justify-center text-blue-600">
                                        {item.type === 'inquiry' ? <HiUsers /> : <HiEye />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-start text-gray-900">{item.title}</p>
                                        <p className="text-xs text-start text-white">{item.desc}</p>
                                    </div>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 relative z-10">{item.time}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommonDashboard;
