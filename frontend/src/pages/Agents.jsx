import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiStar, HiSearch, HiLocationMarker, HiFilter } from 'react-icons/hi';
import { BiBuildingHouse } from 'react-icons/bi';
import api from '../services/api';
import SafeImage from '../components/SafeImage';

const AgentAvatar = ({ agent, size = 'lg' }) => {
    const initials = agent.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['bg-blue-600', 'bg-violet-600', 'bg-teal-600', 'bg-orange-500', 'bg-pink-600', 'bg-gray-900'];
    const color = colors[agent.id % colors.length];
    const sizeClass = size === 'lg' ? 'h-15 w-15 text-xl' : 'h-12 w-12 text-xl';

    if (agent.avatar_url) {
        return (
            <SafeImage
                src={agent.avatar_url}
                alt={agent.name}
                className={`${sizeClass} object-cover`}
            />
        );
    }
    return (
        <div className={`${sizeClass} ${color} flex items-center justify-center text-indigo-100 font-black`}>
            {initials}
        </div>
    );
};

const Agents = () => {
    const [agents, setAgents] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        fetchAgents();
    }, [selectedLocation]);

    const fetchLocations = async () => {
        try {
            const res = await api.get('/locations');
            setLocations(res.data);
        } catch (err) {
            console.error('Failed to fetch locations', err);
        }
    };

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const params = {};
            if (selectedLocation) params.location_id = selectedLocation;
            const res = await api.get('/agents', { params });
            setAgents(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch agents', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = Array.isArray(agents) ? agents.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        (a.specialization || '').toLowerCase().includes(search.toLowerCase())
    ) : [];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero */}
            <div className="border-b border-gray-100">
                <div className="w-full mx-auto py-10 pb-5">
                    <div className="text-center mb-10">
                        <span className="inline-block px-5 py-2 bg-gray-900 border border-black/30 text-indigo-100 font-black text-xs uppercase tracking-widest mb-6">
                            Our Team
                        </span>
                        <h1 className="text-5xl md:text-6xl font-black text-black/90 mb-6">
                            Meet Our Expert Agents
                        </h1>
                        <p className="text-xl text-blue-800 max-w-2xl mx-auto font-medium">
                            Dedicated professionals with deep local knowledge ready to guide you through every step of your property journey.
                        </p>
                    </div>

                    <section className='py-10 relative flex items-center'>
                        <SafeImage src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover  absolute inset-0 opacity-100 " alt="Team" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/50 to-black/50"></div>

                        <div className="relative z-50 flex justify-between items-center my-auto p-5">
                            <div className="flex flex-col justify-center items-start w-[70%]">
                                <p className='text-blue-600 uppercase font-black mb-3'>
                                    Manage your properties
                                </p>
                                <p className='text-indigo-100/80 text-lg font-bold text-start'>
                                    Green wave provides an overview of the continent's diverse property markets, plus guides to prime rents and yields in the office, retail, industrial and residential sectors.
                                </p>
                            </div>
                            <div className="">
                                <Link to={"/blog"} className='px-6 py-3 bg-green-600 border border-black/30 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg'>
                                    industry insights
                                </Link>
                            </div>
                        </div>
                    </section>


                </div>
            </div>

            {/* Agents Grid */}
            <div className="w-full py-10">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white p-8 animate-pulse border">
                                <div className="flex flex-col items-center">
                                    <div className="h-24 w-24 bg-gray-200 rounded-3xl mb-6" />
                                    <div className="h-5 bg-gray-200 rounded-full w-40 mb-3" />
                                    <div className="h-4 bg-gray-100 rounded-full w-28 mb-8" />
                                    <div className="h-12 bg-gray-100 rounded-2xl w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <BiBuildingHouse className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-gray-900 mb-4">No Agents Found</h2>
                        <p className="text-gray-400 font-medium">Try adjusting your search or location filter.</p>
                    </div>
                ) : (
                    <>
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
                            <div className="relative flex-1">
                                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/70 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search agents by name or specialization..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full h-full pl-10 bg-gray-50 border border-black p-2 focus:ring-0 text-sm font-bold text-black/70"
                                />
                            </div>
                            <div className="relative flex items-center">
                                <HiLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-black h-5 w-5" />
                                <select
                                    value={selectedLocation}
                                    onChange={e => setSelectedLocation(e.target.value)}
                                    className="pl-10 flex items-center px-6 py-3 border border-black/10 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg cursor-pointer"
                                >
                                    <option value="">All Locations</option>
                                    {locations.map(l => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <p className="text-indigo-100 text-sm border border-blue-800 w-fit mx-auto font-bold my-5 flex">
                            <p className='text-indigo-100 text-sm h-full bg-gray-900 p-1'>Showing</p> <span className="flex items-center text-black px-2">{filtered.length} agent{filtered.length !== 1 ? 's' : ''}</span>
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filtered.map(agent => (
                                <div
                                    key={agent.id}
                                    className="bg-green-600 p-8 relative border border-black/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-start items-start w-full"
                                >
                                      <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                    <div className="flex flex-col items-start text-center flex-1 w-full">
                                        <div className="relative mb-6">
                                            <AgentAvatar agent={agent} size="lg" />
                                        </div>
                                        <p className="text-indigo-100 font-bold text-sm uppercase tracking-widest mb-1">
                                            {agent.specialization}
                                        </p>
                                        <h3 className="text-2xl font-black border-t pt-1 w-full text-start border-gray-50 text-black mb-1 transition">
                                            {agent.name}
                                        </h3>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 items-center justify-center gap-8 mb-5 w-full border-b border-gray-50 py-3">
                                            <div className="text-start">
                                                <p className="text-2xl font-black text-gray-900">{agent.listings_count}</p>
                                                <p className="text-xs text-indigo-100 font-black uppercase tracking-widest mb-1">Listings</p>
                                            </div>

                                            <div className="text-start">
                                                <p className="text-2xl font-black text-gray-900 flex items-center">
                                                    4.9 <HiStar className="text-yellow-400 ml-1 h-5 w-5" />
                                                </p>
                                                <p className="text-xs text-indigo-100 font-black uppercase tracking-widest mb-1">Rating</p>

                                            </div>
                                        </div>

                                        {/* Recent listing preview */}
                                        {agent.recent_listings?.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2 mb-8 w-full">
                                                {agent.recent_listings.map((listing, i) => (
                                                    <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                                                        <SafeImage
                                                            src={listing.image}
                                                            alt={listing.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <Link
                                            to={`/agents/${agent.id}`}
                                            className="flex items-center justify-center relative px-6 py-3 border border-black/30 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg"
                                        >
                                              <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                            View Profile
                                        </Link>
                                        {agent.phone ? (
                                            <a
                                                href={`tel:${agent.phone}`}
                                                className="flex items-center justify-center space-x-2 px-6 py-3 border border-black/30 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-black hover:bg-blue-600 transition shadow-lg"
                                            >
                                                <HiPhone className="h-4 w-4" />
                                                <span>Call</span>
                                            </a>
                                        ) : (
                                            <a
                                                href={`mailto:${agent.email}`}
                                                className="flex items-center justify-center space-x-2 px-6 py-3 border border-black/50 bg-white/80 text-xs text-start font-black uppercase tracking-widest text-black hover:bg-blue-600 transition shadow-lg"
                                            >
                                                <HiMail className="h-4 w-4" />
                                                <span>Email</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Agents;
