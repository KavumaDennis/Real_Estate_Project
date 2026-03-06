import { Link } from 'react-router-dom';
import SafeImage from '../components/SafeImage';

const About = () => {
    return (
        <div className="">
            {/* Hero */}
            <section className="relative py-20 text-indigo-100 mt-1">
                <SafeImage src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover  absolute inset-0 opacity-100 " alt="Team" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/60 to-black/60"></div>

                <div className="max-w-7xl z-10 relative mx-auto px-4 text-center">
                    <h1 className="text-[40px] relative w-fit mx-auto font-black bg-green-300/10 backdrop-blur-md border border-white/10 text-indigo-100/80 px-10 mb-6 p-2">
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        Revolutionizing Real Estate
                    </h1>
                    <p className="block max-w-2xl my-6 text-center text-xs font-black text-indigo-200 uppercase tracking-widest mx-auto mb-8">

                        We are dedicated to making property search seamless, secure, and transparent for everyone.
                    </p>
                    <Link className="px-6 py-3 relative w-fit border border-black/30 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                     <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        Contact us
                    </Link>
                </div>
            </section>
            {/* Values */}
            <section className=" py-10">
                <div className="">

                    <h2 className="px-6 py-3 w-fit border border-black/30 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg mb-5">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Trust & Transparency', desc: 'Every listing is verified by our team of experts.' },
                            { title: 'Advanced Technology', desc: 'Powerful search tools and map integrations.' },
                            { title: 'Expert Guidance', desc: 'Certified agents to help you every step of the way.' }
                        ].map((value, i) => (
                            <div key={i} className="bg-green-600 relative flex flex-col items-start p-10 shadow-sm hover:shadow-md transition">
                                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                <div className="w-12 h-12 bg-amber-500 flex items-center justify-center text-indigo-100  font-bold text-xl mb-6">
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
                        <SafeImage src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover absolute inset-0 opacity-100 " alt="Team" />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/50 to-black/50"></div>

                        <div className="mb-5 relative z-10 p-3 h-full flex flex-col justify-between">
                            <h2 className="px-6 py-3 w-fit border border-black/30 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg mb-1">Our Mission</h2>
                            <p className="text-indigo-100/80 font-bold text-lg text-start text-md leading-relaxed z-10 mb-5">
                                To deliver professional, sustainable and client-centered property facilities and asset management services in Uganda, driven by expertise, technology, and a commitment topreserving value across real estate assets
                            </p>
                        </div>


                    </div>
                    <div className="relative h-96 overflow-hidden shadow-2xl">
                        <SafeImage src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover  absolute inset-0 opacity-100 " alt="Team" />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/50 to-black/50"></div>

                        <div className="mb-5 relative z-10 p-3 h-full flex flex-col justify-between">
                            <h2 className="px-6 py-3 w-fit border border-black/30 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg mb-1">Our Vision</h2>
                            <p className="text-indigo-100/80 font-bold text-lg text-start text-md leading-relaxed z-10 mb-5">
                                To be Ugandas's leading homegrown provider of sustainable property, facilities and assets management solutions, setting the bench mark for excellence, integrity and innovation in the built environment
                            </p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default About;
