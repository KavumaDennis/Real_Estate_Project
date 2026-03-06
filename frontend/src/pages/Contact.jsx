import { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import SafeImage from '../components/SafeImage';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaYoutube, FaLinkedin } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";


const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen">
            <div className="p-20 relative mt-1">
                <SafeImage src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover  absolute inset-0 opacity-100 " alt="Team" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/60 to-black/60"></div>
                <div className="relative z-10 flex items-center justify-center gap-10 mx-auto mb-5">
                    <p className='uppercase text-white/90 font-black'>
                        Follow us on our socials
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="p-2 px-3 w-fit text-white bg-indigo-600 border border-white/20 relative">
                         <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <Link className=''>
                                <FaFacebookF className='h-5 w-5' />
                            </Link>
                        </div>
                        <div className="p-2 px-3 w-fit text-white bg-indigo-600 border border-white/20  relative">
                         <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <Link className=''>
                                <IoLogoInstagram className='h-5 w-5' />
                            </Link>
                        </div>
                        <div className="p-2 px-3 w-fit text-white bg-indigo-600 border border-white/20  relative">
                         <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <Link className=''>
                                <FaYoutube className='h-5 w-5' />
                            </Link>
                        </div>
                        <div className="p-2 px-3 w-fit text-white bg-indigo-600 border border-white/20  relative">
                         <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <Link className=''>
                                <FaLinkedin className='h-5 w-5' />
                            </Link>
                        </div>

                    </div>
                </div>
                <div className="">
                    <h2 className='text-[40px] relative mb-8 z-10 w-fit mx-auto font-black bg-green-300/10 backdrop-blur-md border border-white/10 text-indigo-100/80 px-10 p-2'>
                     <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        24 hour support, ready to help you out
                    </h2>
                </div>
                <div className="z-10 relative">
                    <Link className="px-6 py-3 relative w-fit border border-black/30 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                     <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        Find and expert
                    </Link>
                </div>
            </div>

            <div className="w-full py-10 ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className='flex flex-col justify-end'>

                        <div className="">
                            <h1 className="text-xl text-black text-start font-black uppercase tracking-widest mb-6">Get in Touch</h1>
                            <p className="text-xl text-start relative bg-indigo-600 p-1 text-white mb-12">
                                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                Have questions about a listing or want to partner with us? Our team is here to help.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-end">
                                <div className="p-4 border border-black/10 bg-green-600 text-white hover:bg-blue-600 transition shadow-lg mr-6">
                                    <HiLocationMarker className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="block text-xs text-start font-black text-black uppercase tracking-widest">Office Address</h3>
                                    <p className="text-blue-800 font-black">Kait House, Kyagwe road, Kampala</p>
                                </div>
                            </div>
                            <div className="flex items-end">
                                <div className="p-4 border border-black/10 bg-green-600 text-white hover:bg-blue-600 transition shadow-lg mr-6">
                                    <HiMail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="block text-xs text-start font-black text-black uppercase tracking-widest ">Email Support</h3>
                                    <p className="text-blue-800 font-black">greenwavepf@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-end">
                                <div className="p-4 border border-black/10 bg-green-600 text-white hover:bg-blue-600 transition shadow-lg mr-6">
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
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        {submitted ? (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
                                <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
                                <p className="text-gray-500">Thank you for reaching out. We'll get back to you shortly.</p>
                                <button onClick={() => setSubmitted(false)} className="mt-8 text-blue-600 font-bold hover:underline">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 z-10 relative">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">First Name</label>
                                        <input type="text" required className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Last Name</label>
                                        <input type="text" required className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Email Address</label>
                                    <input type="email" required className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" />
                                </div>
                                <div>
                                    <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Your Message</label>
                                    <textarea rows="6" required className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"></textarea>
                                </div>
                                <button type="submit" className="px-6 py-3 w-fit flex justify-start border border-black/30 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                                    Send Message
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
