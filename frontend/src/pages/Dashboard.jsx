import { useAuth } from '../context/AuthContext';
import { HiOutlineOfficeBuilding, HiOutlineHeart, HiOutlineChatAlt2 } from 'react-icons/hi';

const CommonDashboard = () => {
    const { user } = useAuth();

    const stats = [
        { name: 'Saved Properties', value: '12', icon: HiOutlineHeart, color: 'text-pink-600', bg: 'bg-pink-100' },
        { name: 'Active Inquiries', value: '5', icon: HiOutlineChatAlt2, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'My Reviews', value: '8', icon: HiOutlineOfficeBuilding, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="space-y-8">
            <div className="">
                <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Hello, {user?.name}! 👋</h1>
                <p className="px-6 py-3 w-fit border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Welcome back to your dashboard. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-teal-700 p-6 shadow-sm border border-black/20 flex items-center space-x-4">
                        <div className={`p-4 ${stat.bg} ${stat.color}`}>
                            <stat.icon className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="block text-xl text-start font-black text-white uppercase tracking-widest">{stat.value}</p>
                            <p className="block text-xs text-start font-black text-black uppercase tracking-widest">{stat.name}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white/60 border border-dashed border-black/20 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-teal-700 mb-6">Recent Activity</h2>
                <div className="space-y-4 text-gray-500 py-10 text-center italic">
                    No recent activity to show.
                </div>
            </div>
        </div>
    );
};

export default CommonDashboard;
