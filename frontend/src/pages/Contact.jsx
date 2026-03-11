import { useEffect, useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { IoLogoInstagram } from 'react-icons/io5';
import api from '../services/api';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        message: '',
    });

    const heroSlides = ['/img2.jpg', '/img4.avif', '/img6.jpg', '/img7.jpg'];
    const [activeHeroSlide, setActiveHeroSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
        }, 3800);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await api.post('/contact', formData);
            setSubmitted(true);
            setFormData({ first_name: '', last_name: '', email: '', message: '' });
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="p-20 pb-10 relative z-10 mt-1">
                <div className="absolute inset-0 overflow-hidden">
                    {heroSlides.map((src, idx) => (
                        <img
                            key={src}
                            src={src}
                            alt={`contact-slide-${idx + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-900 ${idx === activeHeroSlide ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ))}
                </div>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/45 via-black/45 to-black/45"></div>
                <div className="relative z-10 flex items-center justify-center gap-10 mx-auto mb-5">
                    <p className="uppercase text-white/80 font-black">Follow us on our socials</p>
                    <div className="flex items-center gap-3">
                        {[FaFacebookF, IoLogoInstagram, FaYoutube, FaLinkedin].map((Icon, idx) => (
                            <div key={idx} className="p-2.5 px-3 w-fit text-white bg-gray-900 border border-white/20 relative">
                                <img src="/bg-img.png" className="absolute w-full h-full object-cover opacity-20 inset-0" alt="" />
                                <Link>
                                    <Icon className="h-5 w-5" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-[40px] relative mb-8 z-10 w-fit mx-auto font-black bg-green-300/20 backdrop-blur-md border border-white/20 text-indigo-100/80 px-10 p-2">
                        <img src="/bg-img.png" className="absolute w-full h-full object-cover opacity-20 inset-0" alt="" />
                        24 hour support, ready to help you out
                    </h2>
                </div>
                <div className="z-10 relative mb-10">
                    <Link to={'/agents'} className="px-6 py-3 z-10 relative w-fit border border-black/30 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                        <img src="/bg-img.png" className="absolute w-full h-full object-cover opacity-20 inset-0" alt="" />
                        Find and expert
                    </Link>
                </div>
                <div className="relative z-10 flex justify-start mt-6 gap-2">
                    {heroSlides.map((_, idx) => (
                        <button
                            key={`contact-indicator-${idx}`}
                            type="button"
                            onClick={() => setActiveHeroSlide(idx)}
                            className={`h-2.5 rounded-full relative border border-black/30 transition-all ${idx === activeHeroSlide ? 'w-9 bg-green-600' : 'w-4 bg-white/60 hover:bg-white'}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        >
                          
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="flex flex-col justify-end">
                        <div>
                            <h1 className="text-xl text-black text-start font-black uppercase tracking-widest mb-6">Get in Touch</h1>
                            <p className="text-xl text-start relative bg-gray-900 p-1 text-white mb-12">
                                <img src="/bg-img.png" className="absolute w-full h-full object-cover opacity-20 inset-0" alt="" />
                                Have questions about a listing or want to partner with us? Our team is here to help.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-end">
                                <div className="p-4 relative border border-black/10 bg-green-600 text-white hover:bg-blue-600 transition shadow-lg mr-6">
                                    <img src="/bg-img.png" className="absolute w-full h-full object-cover opacity-20 inset-0" alt="" />
                                    <HiLocationMarker className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="block text-xs text-start font-black text-black uppercase tracking-widest">Office Address</h3>
                                    <p className="text-blue-800 font-black">Kait House, Kyagwe road, Kampala</p>
                                </div>
                            </div>
                            <div className="flex items-end">
                                <div className="p-4 relative border border-black/10 bg-green-600 text-white hover:bg-blue-600 transition shadow-lg mr-6">
                                    <img src="/bg-img.png" className="absolute w-full h-full object-cover opacity-20 inset-0" alt="" />
                                    <HiMail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="block text-xs text-start font-black text-black uppercase tracking-widest">Email Support</h3>
                                    <p className="text-blue-800 font-black">greenwavepf@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-end">
                                <div className="p-4 relative border border-black/10 bg-green-600 text-white hover:bg-blue-600 transition shadow-lg mr-6">
                                    <img src="/bg-img.png" className="absolute w-full h-full object-cover opacity-20 inset-0" alt="" />
                                    <HiPhone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="block text-xs text-start font-black text-black uppercase tracking-widest">Phone Number</h3>
                                    <p className="text-blue-800 font-black">256768754339</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-600 relative p-10 border border-black/30 shadow-sm">
                        <img src="/bg-img.png" className="absolute w-full h-full object-cover opacity-20 inset-0" alt="" />
                        {submitted ? (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black">OK</div>
                                <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
                                <p className="text-gray-500">Thank you for reaching out. We'll get back to you shortly.</p>
                                <button onClick={() => setSubmitted(false)} className="mt-8 text-blue-600 font-bold hover:underline">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 z-10 relative">
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm font-bold">{error}</div>
                                )}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.first_name}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, first_name: e.target.value }))}
                                            className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.last_name}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, last_name: e.target.value }))}
                                            className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                        className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Your Message</label>
                                    <textarea
                                        rows="6"
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                                        className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-3 w-fit flex justify-start border border-black/30 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg disabled:opacity-60"
                                >
                                    {submitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
