import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineHome, HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineCollection,
    HiOutlineLocationMarker, HiOutlineHashtag, HiOutlineNewspaper, HiOutlineDocumentText,
    HiOutlineAnnotation, HiOutlineCreditCard, HiOutlineChartBar, HiOutlineSearchCircle,
    HiOutlineMail, HiOutlineCog, HiOutlineLogout, HiOutlineViewGrid
} from 'react-icons/hi';

const AdminLayout = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (loading) return null;
    if (!user || user.role?.slug !== 'admin') {
        navigate('/login');
        return null;
    }

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
        { name: 'Transactions', path: '/admin/transactions', icon: HiOutlineCreditCard },
    ];

    return (
        <div className="flex h-screen bg-emerald-100/80 backdrop-blur-2xl overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 border-r flex flex-col gap-1">
                <div className="px-6 py-3 bg-teal-700 ">
                    <Link to="/" className="text-xl font-black text-white">
                        Antigravity<span className=" text-sm italic">Admin</span>
                    </Link>
                </div>

                <nav className="flex-grow p-4 pl-0 space-y-2 overflow-y-auto bg-teal-700 ">
                    {menuItems.slice(0, 11).map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 text-xs text-start font-black uppercase tracking-widest ${location.pathname === item.path
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
                    <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-4 py-3   text-white bg-red-700/95 text-xs text-start font-black  uppercase tracking-widest"
                    >
                        <HiOutlineLogout className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col overflow-hidden">
                <header className="min-h-13 border-b border-black/30 bg-teal-700 flex items-center justify-between px-8">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-bold text-white">
                            {location.pathname.split('/').pop()?.charAt(0).toUpperCase() + location.pathname.split('/').pop()?.slice(1) || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold uppercase text-amber-500">Platform Admin</p>
                            <p className="text-sm font-bold text-white">{user.name}</p>
                        </div>
                        <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                            {user.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                <main className="flex-grow overflow-y-auto p-8 pr-0">
                    <div className="max-w-7xl mx-auto pb-20">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
