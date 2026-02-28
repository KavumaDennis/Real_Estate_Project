import { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="bg-emerald-100/80 backdrop-blur-2xl min-h-screen">
            <div className="w-full py-10 ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className='flex flex-col justify-end'>

                        <div className="">
                            <h1 className="text-xl text-black text-start font-black uppercase tracking-widest mb-6">Get in Touch</h1>
                            <p className="text-xl text-start bg-teal-700 p-1 text-white mb-12">
                                Have questions about a listing or want to partner with us? Our team is here to help.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-end">
                                <div className="p-4 border border-black/10 bg-amber-600 text-white hover:bg-blue-600 transition shadow-lg mr-6">
                                    <HiLocationMarker className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="block text-xs text-start font-black text-black uppercase tracking-widest">Office Address</h3>
                                    <p className="text-teal-700 font-black">Kait House, Kyagwe road, Kampala</p>
                                </div>
                            </div>
                            <div className="flex items-end">
                                <div className="p-4 border border-black/10 bg-amber-600 text-white hover:bg-blue-600 transition shadow-lg mr-6">
                                    <HiMail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="block text-xs text-start font-black text-black uppercase tracking-widest ">Email Support</h3>
                                    <p className="text-teal-700 font-black">greenwavepf@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-end">
                                <div className="p-4 border border-black/10 bg-amber-600 text-white hover:bg-blue-600 transition shadow-lg mr-6">
                                    <HiPhone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="block text-xs text-start font-black text-black uppercase tracking-widest">Phone Number</h3>
                                    <p className="text-teal-700 font-black">256768754339</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-600 p-10 border border-black/30 shadow-sm">
                        {submitted ? (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
                                <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
                                <p className="text-gray-500">Thank you for reaching out. We'll get back to you shortly.</p>
                                <button onClick={() => setSubmitted(false)} className="mt-8 text-blue-600 font-bold hover:underline">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">First Name</label>
                                        <input type="text" required className="w-full bg-gray-50 border border-black/80 p-2 pl-10 pr-4 focus:ring-0 text-sm font-bold placeholder-black/70" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Last Name</label>
                                        <input type="text" required className="w-full bg-gray-50 border border-black/80 p-2 pl-10 pr-4 focus:ring-0 text-sm font-bold placeholder-black/70" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Email Address</label>
                                    <input type="email" required className="w-full bg-gray-50 border border-black/80 p-2 pl-10 pr-4 focus:ring-0 text-sm font-bold placeholder-black/70" />
                                </div>
                                <div>
                                    <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Your Message</label>
                                    <textarea rows="6" required className="w-full bg-gray-50 border border-black/80 p-2 pl-10 pr-4 focus:ring-0 text-sm font-bold placeholder-black/70"></textarea>
                                </div>
                                <button type="submit" className="px-6 py-3 w-fit flex justify-start border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
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
