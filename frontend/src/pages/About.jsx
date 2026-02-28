import SafeImage from '../components/SafeImage';

const About = () => {
    return (
        <div className="bg-white">
            {/* Hero */}
            <section className="bg-blue-600 py-20 text-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-black mb-6">Revolutionizing Real Estate</h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90">
                        We are dedicated to making property search seamless, secure, and transparent for everyone.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            Founded in 2026, Antigravity Estate was born out of a desire to simplify the complex world of real estate. We believe that finding a home should be an exciting journey, not a stressful one.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Our platform connects thousands of buyers, sellers, and agents across the country, providing the most accurate and up-to-date listings in the market.
                        </p>
                    </div>
                    <div className="bg-gray-100 h-96 rounded-3xl overflow-hidden shadow-2xl">
                        <SafeImage src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover" alt="Team" />
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-16">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Trust & Transparency', desc: 'Every listing is verified by our team of experts.' },
                            { title: 'Advanced Technology', desc: 'Powerful search tools and map integrations.' },
                            { title: 'Expert Guidance', desc: 'Certified agents to help you every step of the way.' }
                        ].map((value, i) => (
                            <div key={i} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-md transition">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl mb-6 mx-auto">
                                    {i + 1}
                                </div>
                                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                                <p className="text-gray-500">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
