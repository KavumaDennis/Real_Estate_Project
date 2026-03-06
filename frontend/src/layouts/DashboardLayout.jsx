import React, { useState } from 'react';
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
    HiOutlineCreditCard,
    HiOutlineMenuAlt2,
    HiOutlineX,
    HiOutlineBookmark
} from 'react-icons/hi';

const DashboardLayout = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const menuItems = [
        { name: 'Overview', path: '/dashboard', icon: HiOutlineHome },
        { name: 'My Listings', path: '/dashboard/properties', icon: HiOutlineOfficeBuilding, roles: ['agent', 'admin', 'super-admin'] },
        { name: 'Leads', path: '/dashboard/leads', icon: HiOutlineInbox, roles: ['agent', 'admin', 'super-admin'] },
        { name: 'Reviews', path: '/dashboard/reviews', icon: HiOutlineStar, roles: ['agent', 'admin', 'super-admin'] },
        { name: 'Analytics', path: '/dashboard/analytics', icon: HiOutlineChartBar, roles: ['agent', 'admin', 'super-admin'] },
        { name: 'Subscription', path: '/dashboard/subscription', icon: HiOutlineCreditCard, roles: ['agent', 'admin', 'super-admin'] },
        { name: 'Blog Manager', path: '/dashboard/blog', icon: HiOutlinePencilAlt, roles: ['admin', 'super-admin'] },
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
        <div className="flex h-screen overflow-hidden relative">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-80 flex flex-col gap-1 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
                ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                <div className="px-6 py-3 border border-black/20 bg-indigo-600 flex items-center justify-between relative">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <Link to="/" className="text-xl font-black text-white relative z-10" onClick={closeSidebar}>
                        Antigravity<span className=" text-sm italic">Dash</span>
                    </Link>
                    <button onClick={closeSidebar} className="lg:hidden text-white p-1">
                        <HiOutlineX className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-grow p-4 pl-0 border border-black/20 bg-green-600 relative space-y-2 overflow-y-auto scrollbar-hide">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    {filteredMenu.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={closeSidebar}
                            className={`flex items-center space-x-3 px-4 py-3 relative z-10 text-xs font-black uppercase tracking-widest transition-all ${location.pathname === item.path
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 pl-0 border border-black/20 bg-green-600 relative space-y-2">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <Link
                        to="/dashboard/profile"
                        onClick={closeSidebar}
                        className={`flex items-center space-x-3 px-4 py-3 relative z-10 text-xs font-black uppercase tracking-widest transition-all ${location.pathname === '/dashboard/profile'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <HiOutlineKey className="h-5 w-5" />
                        <span>Profile Settings</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 relative text-white bg-red-600 hover:bg-red-700 text-xs font-black uppercase tracking-widest transition-colors"
                    >
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <HiOutlineLogout className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col overflow-hidden w-full">
                <header className="h-13.5 relative ml-1 border-b border-black/20 bg-green-600 flex items-center justify-between px-4 lg:px-8 shrink-0">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 text-white bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <HiOutlineMenuAlt2 className="h-6 w-6" />
                        </button>
                        <h2 className="text-lg lg:text-xl font-bold text-white truncate max-w-[150px] sm:max-w-none">
                            {filteredMenu.find(item => item.path === location.pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="text-right hidden xs:block">
                            <p className="text-[10px] font-black uppercase text-amber-500 tracking-wider leading-none mb-1">{user?.role?.name}</p>
                            <p className="text-xs sm:text-sm font-bold text-white leading-none truncate max-w-[100px] sm:max-w-none">{user?.name}</p>
                        </div>
                        <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white font-black border border-white/20">
                            {user?.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                <main className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
