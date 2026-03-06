import React, { useState } from 'react';
import { Navigate, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineHome, HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineCollection,
    HiOutlineLocationMarker, HiOutlineHashtag, HiOutlineNewspaper, HiOutlineDocumentText,
    HiOutlineAnnotation, HiOutlineCreditCard, HiOutlineChartBar, HiOutlineSearchCircle,
    HiOutlineMail, HiOutlineCog, HiOutlineLogout, HiOutlineViewGrid, HiOutlineMenuAlt2, HiOutlineX
} from 'react-icons/hi';

const AdminLayout = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
    );
    if (!user) return <Navigate to="/login" replace />;
    if (user.role?.slug !== 'admin' && user.role?.slug !== 'super-admin') return <Navigate to="/" replace />;

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: HiOutlineViewGrid },
        { name: 'Users', path: '/admin/users', icon: HiOutlineUsers },
        { name: 'Properties', path: '/admin/properties', icon: HiOutlineOfficeBuilding },
        { name: 'Categories', path: '/admin/categories', icon: HiOutlineCollection },
        { name: 'Locations', path: '/admin/locations', icon: HiOutlineLocationMarker },
        { name: 'Amenities', path: '/admin/amenities', icon: HiOutlineHashtag },
        { name: 'Blog', path: '/admin/blog', icon: HiOutlineNewspaper },
        { name: 'Pages (CMS)', path: '/admin/pages', icon: HiOutlineDocumentText },
        { name: 'Reviews', path: '/admin/reviews', icon: HiOutlineAnnotation },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex h-screen bg-emerald-100/80 backdrop-blur-2xl overflow-hidden relative">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-80  flex flex-col gap-1 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
                ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                <div className="px-6 py-3 bg-indigo-600 relative flex items-center justify-between border border-black/20 ">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <Link to="/" className="text-xl relative z-10 font-black text-white" onClick={closeSidebar}>
                        Antigravity<span className=" text-sm italic">Admin</span>
                    </Link>
                    <button onClick={closeSidebar} className="lg:hidden text-white p-1">
                        <HiOutlineX className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-grow bg-green-600 relative pl-0 border border-black/20 p-4 space-y-2 overflow-y-auto scrollbar-hide">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    {menuItems.map((item) => (
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

                <div className="p-4 pl-0 bg-green-600 relative border border-black/20 space-y-2">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <button
                        onClick={logout}
                        className="w-full relative flex items-center space-x-3 px-4 py-3 text-white bg-red-600 hover:bg-red-700 text-xs font-black uppercase tracking-widest transition-colors"
                    >
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <HiOutlineLogout className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col overflow-hidden w-full">
                <header className="h-13.5 border ml-1 border-black/20 bg-green-600 relative flex items-center justify-between px-4 lg:px-8 shrink-0">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 text-white bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <HiOutlineMenuAlt2 className="h-6 w-6" />
                        </button>
                        <h2 className="text-lg lg:text-xl font-bold text-white truncate max-w-[150px] sm:max-w-none">
                            {menuItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="text-right hidden xs:block">
                            <p className="text-[10px] font-black uppercase text-amber-500 tracking-wider leading-none mb-1">Platform Admin</p>
                            <p className="text-xs sm:text-sm font-bold text-white leading-none truncate max-w-[100px] sm:max-w-none">{user.name}</p>
                        </div>
                        <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white font-black border border-white/20">
                            {user.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                <main className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 lg:pr-0">
                    <div className="max-w-7xl mx-auto pb-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
