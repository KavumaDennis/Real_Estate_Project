import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import api from '../services/api';

const About = () => {
    const heroSlides = ['/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.avif'];
    const missionImage = '/img5.jpg';
    const visionImage = '/img6.jpg';
    const [activeHeroSlide, setActiveHeroSlide] = useState(0);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/services');
                setServices(res.data || []);
            } catch (err) {
                console.error('Failed to fetch services:', err);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="">
            {/* Hero */}
            <section className="relative py-20 pb-15 text-indigo-100 mt-1">
                <div className="absolute inset-0 overflow-hidden">
                    {heroSlides.map((src, idx) => (
                        <img
                            key={src}
                            src={src}
                            alt={`about-slide-${idx + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === activeHeroSlide ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ))}
                </div>

                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-black/60 to-black/60"></div>

                <div className="max-w-7xl z-10 relative mx-auto px-4 text-center">
                    <h1 className="text-[40px] relative w-fit mx-auto font-black bg-green-300/20 backdrop-blur-md border border-white/10 text-indigo-100/80 px-10 mb-6 p-2">
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        Revolutionizing Real Estate
                    </h1>
                    <p className="block max-w-2xl my-6 text-center text-xs font-black text-indigo-200 uppercase tracking-widest mx-auto mb-8">

                        We are dedicated to making property search seamless, secure, and transparent for everyone.
                    </p>
                    <Link to={"/contact"} className="px-6 py-3 relative w-fit border border-black/30 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        Contact us
                    </Link>
                    <div className="relative z-10 flex justify-start mt-10 gap-2">
                        {heroSlides.map((_, idx) => (
                            <button
                                key={`about-indicator-${idx}`}
                                type="button"
                                onClick={() => setActiveHeroSlide(idx)}
                                className={`h-2.5 rounded-full transition-all border border-black/30 ${idx === activeHeroSlide ? 'w-9 bg-green-600' : 'w-4 bg-white/60 hover:bg-white'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>
            {/* Values */}
            <section className=" py-10">
                <div className="">

                    <h2 className="px-6 py-3 w-fit border border-black/30 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg mb-5">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Trust & Transparency', desc: 'Every listing is verified by our team of experts.' },
                            { title: 'Advanced Technology', desc: 'Powerful search tools and map integrations.' },
                            { title: 'Expert Guidance', desc: 'Certified agents to help you every step of the way.' }
                        ].map((value, i) => (
                            <div key={i} className="bg-green-600 relative flex flex-col items-start p-10 shadow-sm hover:shadow-md transition">
                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                <div className="w-12 h-12 bg-gray-900 relative border border-black/30 flex items-center justify-center text-indigo-100  font-bold text-xl mb-6">
                                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                    {i + 1}
                                </div>
                                <h3 className="text-xl text-black font-bold mb-4">{value.title}</h3>
                                <p className="text-indigo-100 text-start">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div className='relative h-96 overflow-hidden shadow-2xl'>
                        <SafeImage src={missionImage} className="w-full h-full object-cover absolute inset-0 opacity-100" alt="Mission" />

                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-black/50 to-black/50"></div>

                        <div className="mb-5 relative z-10 p-3 h-full flex flex-col justify-between">
                            <h2 className="px-6 py-3 w-fit border border-black/30 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg mb-1">Our Mission</h2>
                            <p className="text-indigo-100/80 font-bold text-lg text-start text-md leading-relaxed z-10 mb-5">
                                To deliver professional, sustainable and client-centered property facilities and asset management services in Uganda, driven by expertise, technology, and a commitment topreserving value across real estate assets
                            </p>
                        </div>


                    </div>
                    <div className="relative h-96 overflow-hidden shadow-2xl">
                        <SafeImage src={visionImage} className="w-full h-full object-cover absolute inset-0 opacity-100" alt="Vision" />

                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-black/50 to-black/50"></div>

                        <div className="mb-5 relative z-10 p-3 h-full flex flex-col justify-between">
                            <h2 className="px-6 py-3 w-fit border border-black/30 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg mb-1">Our Vision</h2>
                            <p className="text-indigo-100/80 font-bold text-lg text-start text-md leading-relaxed z-10 mb-5">
                                To be Ugandas's leading homegrown provider of sustainable property, facilities and assets management solutions, setting the bench mark for excellence, integrity and innovation in the built environment
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-10">
                <h2 className="px-6 py-3 w-fit border border-black/30 bg-green-900 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg mb-5">
                    Our Services
                </h2>
                {services.length === 0 ? (
                    <div className="p-10 text-center bg-green-100 border border-dashed border-black/30">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-600">No services available right now.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <Link
                                to={`/services/${service.id}`}
                                key={service.id}
                                className="group border border-black/30 bg-white overflow-hidden hover:shadow-xl transition"
                            >
                                <div className="h-52 overflow-hidden">
                                    <SafeImage
                                        src={service.image_url || service.image_path}
                                        alt={service.name}
                                        className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
                                    />
                                </div>
                                <div className="p-4 bg-green-600 relative z-10">
                                    <img src="/bg-img.png" className="absolute inset-0 h-full w-full object-cover opacity-20" alt="" />
                                    <h3 className="text-sm text-start font-black uppercase tracking-widest text-indigo-100">{service.name}</h3>

                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>


        </div>
    );
};

export default About;
