import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) =>
        path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path);

    const navLink = (path) =>
        `transition ${isActive(path) ? 'text-amber-500 font-black' : 'text-white hover:text-amber-400'}`;

    const mobileNavLink = (path) =>
        `block text-xs font-black uppercase tracking-widest transition ${isActive(path) ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600'}`;

    return (
        <nav className="bg-teal-700 border-b border-black/30 shadow-md sticky top-5 z-50">
            <div className="w-full pl-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="block text-sm text-start font-black text-black uppercase tracking-widest">
                            Green wave
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className={navLink('/')}>Home</Link>
                        <Link to="/about" className={navLink('/about')}>About</Link>
                        <Link to="/properties" className={navLink('/properties')}>Properties</Link>
                        <Link to="/agents" className={navLink('/agents')}>Agents</Link>
                        <Link to="/blog" className={navLink('/blog')}>Blog</Link>
                        <Link to="/contact" className={navLink('/contact')}>Contact</Link>

                        <div className="ml-8 flex items-center space-x-4">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <Link to="/dashboard" className="text-amber-500 font-black">Dashboard</Link>
                                    <button
                                        onClick={logout}
                                        className="bg-red-500 px-6 py-3 border border-black/10 text-xs font-black uppercase tracking-widest text-white shadow-lg hover:bg-red-600 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="px-6 py-3 border border-amber-600 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Login</Link>
                                    <Link to="/register" className="px-6 py-3 border border-black/10 bg-amber-600 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Register</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile toggle */}
                    <div className="md:hidden flex items-center pr-4">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                            {isOpen ? <HiX className="h-7 w-7" /> : <HiMenu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t p-4 space-y-4">
                    <Link to="/" className={mobileNavLink('/')} onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/about" className={mobileNavLink('/about')} onClick={() => setIsOpen(false)}>About</Link>
                    <Link to="/properties" className={mobileNavLink('/properties')} onClick={() => setIsOpen(false)}>Properties</Link>
                    <Link to="/agents" className={mobileNavLink('/agents')} onClick={() => setIsOpen(false)}>Agents</Link>
                    <Link to="/blog" className={mobileNavLink('/blog')} onClick={() => setIsOpen(false)}>Blog</Link>
                    <Link to="/contact" className={mobileNavLink('/contact')} onClick={() => setIsOpen(false)}>Contact</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className={mobileNavLink('/dashboard')} onClick={() => setIsOpen(false)}>Dashboard</Link>
                            <button onClick={logout} className="w-full text-left text-red-500 font-black text-xs uppercase tracking-widest">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={mobileNavLink('/login')} onClick={() => setIsOpen(false)}>Login</Link>
                            <Link to="/register" className={mobileNavLink('/register')} onClick={() => setIsOpen(false)}>Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
