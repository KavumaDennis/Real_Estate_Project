import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-teal-700 border-b border-black/30 shadow-md sticky top-5 z-50">
            <div className="w-full pl-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="block text-sm text-start font-black text-black uppercase tracking-widest">
                            Real Estate
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="font-black relative text-orange-500">Home</Link>
                        <Link to="/properties" className="text-white hover:text-amber-600">Properties</Link>
                        <Link to="/agents" className="text-white hover:text-amber-600">Agents</Link>
                        <Link to="/blog" className="text-white hover:text-amber-600">Blog</Link>
                        <Link to="/contact" className="text-white hover:text-amber-600">Contact</Link>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/dashboard" className="font-black relative text-orange-500">Dashboard</Link>
                                <button onClick={logout} className="bg-red-500 px-6 py-3 border border-black/10 text-xs text-start font-black uppercase tracking-widest text-white shadow-lg  hover:bg-red-600 transition">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4 ml-8">
                                <Link to="/login" className="px-6 py-3 border border-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Login</Link>
                                <Link to="/register" className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
                            {isOpen ? <HiX className="h-7 w-7" /> : <HiMenu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t p-4 space-y-4">
                    <Link to="/" className="block text-gray-600 hover:text-blue-600">Home</Link>
                    <Link to="/properties" className="block text-gray-600 hover:text-blue-600">Properties</Link>
                    <Link to="/agents" className="block text-gray-600 hover:text-blue-600">Agents</Link>
                    <Link to="/blog" className="block text-gray-600 hover:text-blue-600">Blog</Link>
                    <Link to="/contact" className="block text-gray-600 hover:text-blue-600">Contact</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="block text-gray-600 hover:text-blue-600">Dashboard</Link>
                            <button onClick={logout} className="w-full text-left text-red-500 font-medium">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block text-gray-600 hover:text-blue-600">Login</Link>
                            <Link to="/register" className="block text-blue-600 font-bold">Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
