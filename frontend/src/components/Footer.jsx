import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

const Footer = () => {
    return (
        <footer className="bg-gray-900 pt-24 pb-12 font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-10"></div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 lg:col-span-1">
                        <Link to="/" className="text-3xl font-black text-white tracking-tighter uppercase italic mb-8 block">
                            Antigravity<span className="text-blue-500">Estate</span>
                        </Link>
                        <p className="text-gray-400 font-medium leading-relaxed mb-8 max-w-sm">
                            Redefining the real estate experience with sophisticated technology and premium service. Find your sanctuary with us.
                        </p>
                        <div className="flex space-x-4">
                            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                                <a key={i} href="#" className="h-10 w-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 col-span-1 lg:col-span-2">
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8">Discovery</h4>
                            <ul className="space-y-4">
                                {['Properties', 'Featured Listings', 'New Projects', 'Luxury Homes'].map(item => (
                                    <li key={item}>
                                        <Link to="/properties" className="text-gray-400 hover:text-blue-500 transition font-medium flex items-center group">
                                            <span className="h-1.5 w-0 bg-blue-500 group-hover:w-3 mr-0 group-hover:mr-2 transition-all"></span>
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8">Company</h4>
                            <ul className="space-y-4">
                                {['About Us', 'Our Agents', 'Journal', 'Contact'].map(item => (
                                    <li key={item}>
                                        <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-blue-500 transition font-medium flex items-center group">
                                            <span className="h-1.5 w-0 bg-blue-500 group-hover:w-3 mr-0 group-hover:mr-2 transition-all"></span>
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8">Connect</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start space-x-4">
                                <div className="h-10 w-10 bg-gray-800 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0">
                                    <HiOutlineLocationMarker size={20} />
                                </div>
                                <span className="text-gray-400 font-medium leading-relaxed">
                                    123 Luxury Avenue, Suite 500<br />New York, NY 10001
                                </span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <div className="h-10 w-10 bg-gray-800 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0">
                                    <HiOutlinePhone size={20} />
                                </div>
                                <span className="text-gray-400 font-medium">+1 (800) 555-0199</span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <div className="h-10 w-10 bg-gray-800 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0">
                                    <HiOutlineMail size={20} />
                                </div>
                                <span className="text-gray-400 font-medium">concierge@antigravity.re</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-10 flex flex-col md:flex-row justify-between items-center text-sm font-bold text-gray-500 uppercase tracking-widest gap-6">
                    <p>&copy; {new Date().getFullYear()} Antigravity Estate. All rights reserved.</p>
                    <div className="flex space-x-8">
                        <a href="#" className="hover:text-white transition">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
