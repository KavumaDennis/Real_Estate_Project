import SafeImage from '../components/SafeImage';

const About = () => {
    return (
        <div className="bg-white">
            {/* Hero */}
            <section className="bg-amber-600 py-20 text-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-black text-black mb-6">Revolutionizing Real Estate</h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90">
                        We are dedicated to making property search seamless, secure, and transparent for everyone.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div>
                        <div className="mb-5">
                            <h2 className="px-6 py-3 w-fit border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg mb-1">Our Mission</h2>
                            <p className="text-black text-start text-md leading-relaxed">
                                To deliver professional, sustainable and client-centered property facilities and asset management services in Uganda, driven by expertise, technology, and a commitment topreserving value across real estate assets
                            </p>
                        </div>
                        <div className="">
                            <h2 className="px-6 py-3 w-fit border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg mb-1">Our Vision</h2>
                            <p className="text-black text-start text-md leading-relaxed">
                                To be Ugandas's leading homegrown provider of sustainable property, facilities and assets management solutions, setting the bench mark for excellence, integrity and innovation in the built environment
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-100 h-96 overflow-hidden shadow-2xl">
                        <SafeImage src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover" alt="Team" />
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-gray-50 py-10">
                <div className="">
                    <h2 className="px-6 py-3 w-fit border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg mb-5">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Trust & Transparency', desc: 'Every listing is verified by our team of experts.' },
                            { title: 'Advanced Technology', desc: 'Powerful search tools and map integrations.' },
                            { title: 'Expert Guidance', desc: 'Certified agents to help you every step of the way.' }
                        ].map((value, i) => (
                            <div key={i} className="bg-teal-700 flex flex-col items-start p-10 shadow-sm hover:shadow-md transition">
                                <div className="w-12 h-12 bg-amber-500 flex items-center justify-center text-white  font-bold text-xl mb-6">
                                    {i + 1}
                                </div>
                                <h3 className="text-xl text-black font-bold mb-4">{value.title}</h3>
                                <p className="text-white text-start">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
