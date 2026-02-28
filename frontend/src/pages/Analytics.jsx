import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiTrendingUp, HiTrendingDown, HiEye, HiCursorClick,
    HiUsers, HiCollection, HiRefresh, HiLocationMarker
} from 'react-icons/hi';
import SafeImage from '../components/SafeImage';

const ICON_MAP = {
    HiEye: HiEye,
    HiUsers: HiUsers,
    HiCursorClick: HiCursorClick,
    HiCollection: HiCollection
};

const Analytics = () => {
    const [stats, setStats] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [days, setDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    const [topPerformer, setTopPerformer] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/analytics');
            setStats(res.data.stats);
            setChartData(res.data.chart.data);
            setDays(res.data.chart.days);
            setTopPerformer(res.data.topPerformer);
            setRecentActivity(res.data.recentActivity);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Performance Analytics</h1>
                    <p className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Track your listings reach and engagement metrics.</p>
                </div>
                <button
                    onClick={fetchAnalytics}
                    className="flex items-center space-x-2 px-6 py-3 border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                >
                    <HiRefresh className="h-5 w-5" />
                    <span>Refresh Data</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = ICON_MAP[stat.icon] || HiEye;
                    return (
                        <div key={stat.name} className="bg-teal-700 border border-black/20 p-6 shadow-sm hover:shadow-lg transition group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} p-4 group-hover:scale-110 transition`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <span className={`text-xs font-black px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : stat.change === '0%' ? 'bg-gray-100 text-gray-400' : 'bg-red-100 text-red-600'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="block text-xl text-start font-black text-white uppercase tracking-widest mb-1">{stat.value}</h3>
                            <p className="block text-xs text-start font-black text-black uppercase tracking-widest">{stat.name}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/60 p-8 border border-dashed border-black/30 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-gray-900">Weekly Traffic</h3>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="h-3 w-3 rounded-full bg-blue-600" />
                                <span className="text-xs font-bold text-gray-500">This Week</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {chartData.map((val, i) => (
                            <div key={i} className="flex-grow flex flex-col items-center group">
                                <div className="w-full max-w-[40px] relative">
                                    <div
                                        className="bg-blue-600 rounded-t-xl group-hover:bg-blue-400 transition-all duration-500 cursor-pointer shadow-lg shadow-blue-100"
                                        style={{ height: `${Math.max(val, 2) * 5}px`, minHeight: '4px' }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                            {val} Views
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-gray-400 mt-4 uppercase tracking-tighter">{days[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-amber-600 border border-black/10 p-5 text-white shadow-xl shadow-blue-100 flex flex-col justify-between">
                    {topPerformer ? (
                        <>
                            <div>
                                <h3 className="block text-lg text-start font-black text-white uppercase tracking-widest mb-1">Top Performer</h3>
                                <p className="text-blue-100 text-start text-sm mb-1">Your most popular listing this week.</p>
                                <h3 className="block text-lg text-start font-black text-teal-800 uppercase tracking-widest mb-2">${topPerformer.price?.toLocaleString()}</h3>
                            </div>

                            <div className="pt-8">
                                <SafeImage
                                    src={topPerformer.image}
                                    className="w-full h-40 object-cover shadow-lg"
                                    alt=""
                                />
                                <div className="mt-4">
                                    <h4 className="block text-lg text-start font-black text-white uppercase tracking-widest">{topPerformer.title}</h4>
                                    <div className="flex items-center text-blue-200 text-xs font-bold mt-1">
                                        <HiLocationMarker className="mr-1" />
                                        {topPerformer.location}
                                    </div>
                                    <div className="mt-2 text-xs font-black text-white uppercase">{topPerformer.views} Total Views</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-10">
                            <HiTrendingUp className="h-12 w-12 text-white/50 mb-4" />
                            <p className="text-sm font-bold">No data yet</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-teal-700 border border-black/20 shadow-sm p-5">
                <h3 className="block text-lg text-start font-black text-white uppercase tracking-widest mb-6">Recent Activity</h3>
                <div className="space-y-4">
                    {recentActivity.length === 0 ? (
                        <p className="text-white/50 text-sm italic">No recent activity detected.</p>
                    ) : recentActivity.map((activity, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border-amber-600 border-y-2  hover:border-blue-100 hover:bg-amber-600 transition">
                            <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-blue-600">
                                    {activity.type === 'inquiry' ? <HiUsers /> : <HiEye />}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-start text-gray-900">{activity.title}</p>
                                    <p className="text-xs text-start text-white">{activity.desc}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-gray-300 uppercase">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
