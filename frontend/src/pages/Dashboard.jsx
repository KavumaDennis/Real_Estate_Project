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
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <p className="px-6 py-3 w-fit relative border border-black/10 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        Welcome back to your dashboard. Here's what's happening today.</p>
                    {user?.role?.slug === 'admin' || user?.role?.slug === 'super-admin' && (
                        <a href="/admin/users" className="px-6 py-3 w-fit relative border border-black/10 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                            <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            Admin Dashboard
                        </a>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-indigo-600 relative p-6 shadow-sm border border-black/20 flex items-center space-x-4">
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <div className={`p-4 relative ${stat.bg} ${stat.color}`}>
                            <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
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
