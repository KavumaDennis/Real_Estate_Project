import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineHome,
    HiOutlineOfficeBuilding,
    HiOutlineUserGroup,
    HiOutlineHeart,
    HiOutlineChatAlt2,
    HiOutlineLogout,
    HiOutlineKey,
    HiOutlinePencilAlt,
    HiOutlineInbox,
    HiOutlineStar,
    HiOutlineChartBar,
    HiOutlineCreditCard
} from 'react-icons/hi';

const DashboardLayout = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Overview', path: '/dashboard', icon: HiOutlineHome },
        { name: 'My Listings', path: '/dashboard/properties', icon: HiOutlineOfficeBuilding, roles: ['agent', 'admin'] },
        { name: 'Leads', path: '/dashboard/leads', icon: HiOutlineInbox, roles: ['agent', 'admin'] },
        { name: 'Reviews', path: '/dashboard/reviews', icon: HiOutlineStar, roles: ['agent', 'admin'] },
        { name: 'Analytics', path: '/dashboard/analytics', icon: HiOutlineChartBar, roles: ['agent', 'admin'] },
        { name: 'Subscription', path: '/dashboard/subscription', icon: HiOutlineCreditCard, roles: ['agent', 'admin'] },
        { name: 'Blog Manager', path: '/dashboard/blog', icon: HiOutlinePencilAlt, roles: ['admin'] },
    ];

    const filteredMenu = menuItems.filter(item =>
        !item.roles || item.roles.includes(user?.role?.slug)
    );

    // Don't render sidebar until user is hydrated (prevents flicker on refresh)
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-emerald-100/80 backdrop-blur-2xl overflow-hidden">
            {/* Sidebar */}
            <aside className="w-75 flex flex-col gap-1">
                <div className="px-6 py-3 bg-teal-700 border-r border-black/30 ">
                    <Link to="/" className="text-xl font-black text-white">
                        Antigravity<span className=" text-sm italic">Dash</span>
                    </Link>
                </div>

                <nav className="flex-grow p-4 pl-0 space-y-2 overflow-y-auto bg-teal-700 border border-black/30 ">
                    {filteredMenu.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3  text-xs text-start font-black text-black uppercase tracking-widest ${location.pathname === item.path
                                ? 'bg-amber-600 text-white'
                                : 'text-white hover:bg-gray-100 hover:text-blue-600'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 pl-0 border-t space-y-2 bg-teal-700 ">
                    <Link to="/dashboard/profile" className={`flex items-center space-x-3 px-4 py-3  text-xs text-start font-black  uppercase tracking-widest${location.pathname === '/dashboard/profile'
                        ? 'bg-amber-600 text-white'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'
                        }`}>
                        <HiOutlineKey className="h-5 w-5" />
                        <span>Profile Settings</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3   text-white bg-red-700/95 text-xs text-start font-black  uppercase tracking-widest"
                    >
                        <HiOutlineLogout className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col overflow-hidden">
                <header className="h-13 border-b border-black/30 bg-teal-700 flex items-center justify-between px-8">
                    <h2 className="text-xl font-bold text-white">
                        {filteredMenu.find(item => item.path === location.pathname)?.name || 'Dashboard'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase">{user?.role?.name}</p>
                            <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                        </div>
                        <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                <main className="flex-grow overflow-y-auto p-8 pr-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
