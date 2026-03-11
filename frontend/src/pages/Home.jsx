import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '../services/propertyService';
import blogService from '../services/blogService';
import agentService from '../services/agentService';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import SafeImage from '../components/SafeImage';
import { formatUGX } from '../utils/currency';
import {
    HiSearch, HiArrowRight, HiOutlineHome, HiOutlineOfficeBuilding,
    HiOutlineMap, HiOutlineLightningBolt, HiLightningBolt,
    HiOutlineCalendar, HiOutlineUserCircle, HiCheckCircle,
    HiOutlineLocationMarker, HiLocationMarker, HiOutlineCash, HiOutlineStar
} from 'react-icons/hi';
import { BiPlayCircle, BiBuildingHouse } from 'react-icons/bi';
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";

const Home = () => {
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [recentProperties, setRecentProperties] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);
    const [featuredAgents, setFeaturedAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchForm, setSearchForm] = useState({
        location: '', type: '', price: '', beds: ''
    });

    const [categoryCounts, setCategoryCounts] = useState({});
    const [topLocations, setTopLocations] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [marketSlide, setMarketSlide] = useState(0);
    const [featuredSlide, setFeaturedSlide] = useState(0);

    const carouselImages = [
        { url: '/Residential.jpg', title: 'Luxury Residencies', subtitle: 'Find your dream home in prime locations.' },
        { url: '/Luxury-estates.webp', title: 'Premium Estates', subtitle: 'Exclusive gated communities and private villas.' },
        { url: '/Commercial.jpg', title: 'Modern Workspaces', subtitle: 'Prime commercial properties for your business.' },
        { url: '/Land.jpg', title: 'Development Land', subtitle: 'Invest in the next big development opportunity.' }
    ];

    useEffect(() => {
        fetchData();
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % carouselImages.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        setFeaturedSlide(0);
    }, [featuredProperties.length]);

    const fetchData = async () => {
        try {
            const [propRes, featuredRes, blogRes, agentRes, topLocationsRes] = await Promise.all([
                propertyService.getAll({ limit: 12 }),
                propertyService.getFeatured(),
                blogService.getPosts(),
                agentService.getAll(),
                api.get('/locations/top', { params: { limit: 6 } })
            ]);
            setRecentProperties(propRes.data.data.slice(0, 12));
            setFeaturedProperties(featuredRes.data.data.slice(0, 3));
            setLatestPosts(blogRes.data.data.slice(0, 3));
            setFeaturedAgents(agentRes.data.data.slice(0, 4));
            setTopLocations(topLocationsRes.data || []);

            const counts = {};
            const allProps = propRes.data.data;
            ['house', 'apartment', 'commercial', 'land'].forEach(type => {
                counts[type] = allProps.filter(p => p.type === type).length;
            });
            setCategoryCounts(counts);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { title: 'House', icon: HiOutlineHome, count: categoryCounts.house || '1,240', color: 'bg-blue-500', link: '/properties?type=house', image: '/Residential.jpg' },
        { title: 'Apartment', icon: BiBuildingHouse, count: categoryCounts.apartment || '890', color: 'bg-amber-500', link: '/properties?type=apartment', image: '/Luxury-estates.webp' },
        { title: 'Commercial', icon: HiOutlineOfficeBuilding, count: categoryCounts.commercial || '450', color: 'bg-purple-500', link: '/properties?type=commercial', image: '/Commercial.jpg' },
        { title: 'Land', icon: HiOutlineMap, count: categoryCounts.land || '890', color: 'bg-green-500', link: '/properties?type=land', image: '/Land.jpg' },
    ];

    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [newsletterOpen, setNewsletterOpen] = useState(false);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterName, setNewsletterName] = useState('');
    const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
    const [newsletterMessage, setNewsletterMessage] = useState(null);

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        if (!newsletterEmail.trim()) return;
        setNewsletterSubmitting(true);
        setNewsletterMessage(null);
        try {
            await api.post('/newsletter/subscribe', {
                email: newsletterEmail.trim(),
                name: newsletterName.trim() || undefined
            });
            setNewsletterMessage({ type: 'success', text: 'Thank you for subscribing to our newsletter!' });
            setNewsletterEmail('');
            setNewsletterName('');
            setTimeout(() => {
                setNewsletterOpen(false);
                setNewsletterMessage(null);
            }, 2000);
        } catch (err) {
            setNewsletterMessage({
                type: 'error',
                text: err.response?.data?.message || 'Subscription failed. Please try again.'
            });
        } finally {
            setNewsletterSubmitting(false);
        }
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setIsSearching(true);
        try {
            const res = await propertyService.getAll({
                location: searchForm.location,
                type: searchForm.type,
                price: searchForm.price,
                limit: 4
            });
            setSearchResults(res.data.data);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            // No need to set isSearching false if we want to keep it "open"
        }
    };

    return (
        <div className="font-sans mt-1">
            {/* Hero Section */}
            <section className="h-fit md:h-[86vh] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                <div className="relative h-100 md:h-full group/hero">

                    {carouselImages.map((slide, idx) => (
                        <div key={idx} className={`absolute inset-0 transition-all duration-800 transform ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-100 pointer-events-none'}`}>
                            <div className="absolute inset-0 z-0">
                                <SafeImage
                                    src={slide.url}
                                    className="w-full h-full object-cover"
                                    alt={slide.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/50 to-black/50"></div>
                            </div>

                            <div className="relative z-10 p-5 w-full h-full flex flex-col justify-center item-start">
                                <div className="w-full text-start">
                                    <div className=" mb-3 text-indigo-100 text-sm font-black uppercase tracking-widest">

                                        <span>Direct From Top Developers</span>
                                    </div>
                                    <h1 className="text-5xl lg:text-7xl font-black text-green-600 w-fit mb-8 leading-[0.9] tracking-tighter">
                                        {slide.title.split(' ')[0]} <br /> {slide.title.split(' ')[1]}
                                    </h1>
                                    <p className="block max-w-2xl mx-auto my-6 text-center text-xs font-black text-indigo-100 text-start uppercase tracking-widest bg-gray-900 p-4 backdrop-blur-sm">
                                        {slide.subtitle}
                                    </p>
                                </div>
                            </div>

                            <div className="absolute bottom-5 right-3 flex space-x-2">
                                <div className="py-2.5 px-5 relative z-10 bg-gray-900 border border-black/30">
                                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                                </div>
                                <div className="py-2.5 px-5 relative z-10 bg-gray-900 border border-black/30">
                                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Carousel Controls */}
                    <div className="absolute top-5 right-3 z-20 flex space-x-4">
                        {carouselImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`h-2.5 transition-all relative z-10 rounded-xl duration-500 border border-black/30 ${i === currentSlide ? 'w-9 bg-green-600' : 'w-4 bg-white/60 hover:bg-white/60'}`}
                            >
                             
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col justify-between md:ml-3 relative">
                    {/* Search Results Modal / Overlay */}
                    {isSearching && (
                        <div className="absolute inset-0 z-30 bg-green-600 border border-black/30 backdrop-blur-xl p-8 overflow-y-auto animate-in fade-in slide-in-from-left duration-500">
                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <div className="flex justify-between items-center z-10 relative mb-0 pb-6 border-b border-black/5">
                                <div>
                                    <h3 className="block text-xs text-start font-black text-indigo-100 uppercase tracking-widest mb-1">Search Results</h3>
                                    <p className="text-xs text-start font-bold text-black uppercase tracking-widest">{searchResults.length} properties found matching your criteria</p>
                                </div>
                                <button
                                    onClick={() => setIsSearching(false)}
                                    className="p-3 bg-black text-indigo-100 hover:bg-amber-600 transition shadow-xl"
                                >
                                    <HiArrowRight className="h-6 w-6 rotate-180" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 z-10 relative">
                                {searchResults.map(prop => (
                                    <Link to={`/properties/${prop.slug}`} key={prop.id} className="group/item relative z-10 bg-white border border-black/10 overflow-hidden hover:shadow-2xl transition-all duration-500">
                                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <div className="aspect-video relative overflow-hidden">
                                            <SafeImage src={prop.images?.[0]} className="w-full h-full object-cover group-hover/item:scale-110 transition duration-700" alt={prop.title} />
                                            <div className="absolute top-3 left-3 px-3 py-1 bg-amber-600 text-indigo-100 text-[10px] font-black uppercase tracking-widest">
                                                {formatUGX(prop.price)}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-black text-black text-start uppercase tracking-widest text-xs truncate mb-2">{prop.title}</h4>
                                            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                                                <HiLocationMarker /> {prop.location?.name}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                                {searchResults.length === 0 && (
                                    <div className="col-span-full py-20 text-center">
                                        <HiSearch className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                                        <p className="font-black text-gray-400 uppercase tracking-widest">No matching properties found</p>
                                    </div>
                                )}
                            </div>

                            <Link to="/properties" className="mt-12 block w-full py-4 relative border border-black/30 bg-gray-900 text-center text-xs font-black uppercase tracking-widest hover:bg-black hover:text-indigo-100 transition">
                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                View All Properties
                            </Link>
                        </div>
                    )}
                    <div className="py-3">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="">
                                <h2 className="border border-black/30 bg-gray-900 relative text-xs w-fit font-extrabold text-indigo-100/80 focus:outline-none cursor-pointer p-0.5 uppercase mb-2">
                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                Our Vision</h2>
                                <p className="text-sm text-start font-bold text-black/80">
                                    To be Ugandas's leading homegrown provider of sustainable property, facilities and assets management solutions, setting the bench mark for excellence, integrity and innovation in the built environment
                                </p>
                            </div>
                            <div className="">
                                <h2 className="border border-black/30 bg-gray-900 relative text-xs w-fit font-extrabold text-indigo-100/80 focus:outline-none cursor-pointer p-0.5 uppercase mb-2">
                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                Our Mission</h2>
                                <p className="text-sm text-start font-bold text-black/80">
                                    To deliver professional, sustainable and client-centered property facilities and asset management services in Uganda, driven by expertise, technology, and a commitment topreserving value across real estate assets
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <h2 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Our Core Services</h2>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3 p-4 bg-white/40 border-l-4 border-amber-600">
                                <HiLightningBolt className="text-amber-600" />
                                <span className="text-xs font-black uppercase tracking-widest text-teal-900">Swift Property Valuation</span>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-white/40 border-l-4 border-blue-600">
                                <HiLightningBolt className="text-blue-600" />
                                <span className="text-xs font-black uppercase tracking-widest text-teal-900">Virtual Property Tours</span>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-white/40 border-l-4 border-green-600">
                                <HiLightningBolt className="text-green-600" />
                                <span className="text-xs font-black uppercase tracking-widest text-teal-900">Expert Legal Support</span>
                            </div>
                        </div>
                    </div>
                    {/* Advanced Search Bar */}
                    <div className="bg-green-600 w-full backdrop-blur-2xl relative p-3 border border-black/30 shadow-2xl mx-auto">
                        <img src="/background.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <div className="w-full grid grid-cols-2  gap-3">
                            <div className="flex flex-col justify-center">
                                <label className="text-[10px] text-start font-black text-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <HiOutlineLocationMarker className="h-3 w-3" /> Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="City, Neighborhood..."
                                    className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold placeholder-black/70"
                                    value={searchForm.location}
                                    onChange={e => setSearchForm({ ...searchForm, location: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <label className="text-[10px] text-start font-black text-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <HiOutlineOfficeBuilding className="h-3 w-3" /> Type
                                </label>
                                <select
                                    className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70"
                                    value={searchForm.type}
                                    onChange={e => setSearchForm({ ...searchForm, type: e.target.value })}
                                >
                                    <option value="">Any Type</option>
                                    <option value="house">House</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="land">Land</option>
                                </select>
                            </div>
                            <div className="flex flex-col justify-center">
                                <label className="text-[10px] text-start font-black text-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <HiOutlineCash className="h-3 w-3" /> Budget
                                </label>
                                <select
                                    className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70"
                                    value={searchForm.price}
                                    onChange={e => setSearchForm({ ...searchForm, price: e.target.value })}
                                >
                                    <option value="">Any Budget</option>
                                    <option value="0-500000">UGX 0 - UGX 500k</option>
                                    <option value="500000-1000000">UGX 500k - UGX 1M</option>
                                    <option value="1000000+">UGX 1M+</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleSearch}
                                    className="flex items-center relative z-10  w-full justify-start gap-2 pl-0 px-8 bg-gray-900 border border-black/30 text-xs font-black uppercase tracking-widest text-indigo-100 hover:bg-black transition-all shadow-xl"
                                >
                                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                    <div className=" py-2.5 px-3 border-r border-black/30">
                                        <HiSearch className="h-5 w-5" />
                                    </div>
                                    <span>Search Property</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            <section className='py-5 relative my-10 flex items-center'>
                <SafeImage src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover  absolute inset-0 opacity-100 " alt="Team" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/70 to-black/70"></div>

                <div className="relative z-10 flex justify-between items-center my-auto p-5">
                    <div className="flex flex-col justify-center items-start w-[60%]">
                        <p className='text-green-600 uppercase font-black mb-3'>
                            Our top locations
                        </p>
                        <p className='text-indigo-100/80 w-[80%] text-lg font-bold text-start'>
                            Green wave provides an overview of the continent's diverse property markets, plus guides to prime rents and yields in the office, retail, industrial and residential sectors.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-5 items-center">
                        {topLocations.map((location) => (
                            <Link
                                key={location.id}
                                to={`/properties?location_id=${location.id}`}
                                className='flex items-center bg-white border border-black/30 text-xs text-start font-black uppercase relative tracking-widest text-indigo-100 hover:bg-gray-900 transition shadow-lg'
                            >
                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                <p className='p-2 bg-gray-900 border-r border-black/40'><IoLocationSharp className='h-5 w-5' /></p>
                                <p className='text-black px-3 h-full'>{location.name} ({location.properties_count})</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Properties Section */}
            {featuredProperties.length > 0 && (
                <section className="py-10">
                    <div className="w-full">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-5 gap-8 text-center md:text-left">
                            <div>
                                <span className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Handpicked Selections</span>
                                <h2 className="px-6 py-3 border border-black/10 bg-green-600 relative text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                    Featured Properties.</h2>
                            </div>
                            <Link to="/properties?is_featured=1" className="px-6 py-3 relative z-10 border border-black/10 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                View All Collection
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600"></div></div>
                        ) : (
                            <div className="space-y-4">
                                <div className="overflow-hidden">
                                    <div
                                        className="flex transition-transform duration-500 ease-out"
                                        style={{ transform: `translateX(-${featuredSlide * 100}%)` }}
                                    >
                                        {Array.from({ length: Math.ceil(featuredProperties.length / 3) || 1 }).map((_, slideIdx) => (
                                            <div key={`featured-${slideIdx}`} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 min-w-0">
                                                {featuredProperties.slice(slideIdx * 3, slideIdx * 3 + 3).map((prop) => (
                                                    <PropertyCard key={prop.id} property={prop} />
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {featuredProperties.length > 3 && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setFeaturedSlide((prev) => Math.max(0, prev - 1))}
                                                disabled={featuredSlide === 0}
                                                className="py-3 px-5 bg-gray-900 border border-black/30 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                aria-label="Previous featured properties"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                                            </button>
                                            <button
                                                onClick={() => setFeaturedSlide((prev) => Math.min(Math.ceil(featuredProperties.length / 3) - 1, prev + 1))}
                                                disabled={featuredSlide >= Math.ceil(featuredProperties.length / 3) - 1}
                                                className="py-3 px-5 bg-gray-900 border border-black/30 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                aria-label="Next featured properties"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            {Array.from({ length: Math.ceil(featuredProperties.length / 3) }).map((_, idx) => (
                                                <button
                                                    key={`featured-indicator-${idx}`}
                                                    type="button"
                                                    onClick={() => setFeaturedSlide(idx)}
                                                    className={`h-2.5 rounded-full transition-all ${idx === featuredSlide ? 'w-9 bg-green-600' : 'w-4 bg-gray-300 hover:bg-gray-500'}`}
                                                    aria-label={`Go to featured slide ${idx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Categories Grid */}
            <section className="bg-gray-900 relative border border-black/30 text-indigo-100 mt-10">
                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                <div className="w-full py-10">
                    <div className="text-start mb-5">
                        <span className="block text-xs text-start font-black text-indigo-100 uppercase tracking-widest mb-1">Market Segments</span>
                        <h2 className="px-6 py-3 w-fit border border-black/30 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">Browse Categories</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map((cat, i) => (
                            <Link to={cat.link} key={i} className="group relative h-80 overflow-hidden bg-white/15 border border-black/30 hover:border-amber-500 transition-all duration-700">
                                <SafeImage src={cat.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat.title} />
                                {/* <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-teal-900/20 to-transparent"></div> */}
                                <div className="absolute top-3 left-3 bg-green-600 border border-black/30 w-12 h-12 flex items-center justify-center mb-4 transition-transform group-hover:-translate-y-2">
                                    <cat.icon size={24} className="text-indigo-100" />
                                </div>
                                <div className="absolute bottom-0 w-full p-3 bg-green-300/10 backdrop-blur-md border border-white/10 flex flex-col justify-end items-start">
                                    <h3 className="text-3xl font-black uppercase  text-green-300 tracking-tighter mb-2">{cat.title}</h3>
                                    <div className="flex items-center border border-blue-800">
                                        <div className="p-1 bg-gray-900  font-black text-indigo-100">
                                            <MdOutlineFeaturedPlayList className='h-4 w-4' />
                                        </div>
                                        <p className="text-xs font-black px-2 text-indigo-100/80 uppercase">{cat.count} Listings</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recently Added Section - Carousel */}
            <section className="py-10">
                <div className="w-full">
                    <div className="flex justify-between items-end mb-5 h-full">
                        <div>
                            <span className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Just Hit the Market</span>
                            <h2 className="px-6 py-3 border border-black/30 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">New Arrivals</h2>
                        </div>
                        <div className="flex space-x-2 items-center h-full">
                            <div className="flex space-x-2 items-center h-full">
                                <button
                                    onClick={() => setMarketSlide(prev => Math.max(0, prev - 1))}
                                    disabled={marketSlide === 0}
                                    className="py-3 px-5 h-full bg-gray-900 border border-black/30 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    aria-label="Previous properties"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                                </button>
                                <button
                                    onClick={() => setMarketSlide(prev => Math.min(Math.ceil(recentProperties.length / 3) - 1, prev + 1))}
                                    disabled={marketSlide >= Math.ceil(recentProperties.length / 3) - 1}
                                    className="py-3 px-5 h-full bg-gray-900 border border-black/30 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    aria-label="Next properties"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </button>
                            </div>
                            <Link to="/properties" className="px-6 py-3 flex items-center gap-1 border border-black/30 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                Explore more <HiArrowRight />
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${marketSlide * 100}%)` }}
                        >
                            {Array.from({ length: Math.ceil(recentProperties.length / 3) || 1 }).map((_, slideIdx) => (
                                <div key={slideIdx} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-w-0">
                                    {recentProperties.slice(slideIdx * 3, slideIdx * 3 + 3).map((prop) => (
                                        <PropertyCard key={prop.id} property={prop} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Agents Section */}
            <section className="py-10">
                <div className="w-full">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-5 text-center md:text-left">
                        <div className="mb-8 md:mb-0">
                            <h2 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Expert Concierge.</h2>
                            <p className="px-6 py-3 relative border border-black/30 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                Dedicated specialists for a seamless experience.
                            </p>
                        </div>
                        <Link to="/agents" className="px-6 py-3 relative border border-black/30 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            All Specialists
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredAgents.map((agent) => (
                            <Link to={`/agents/${agent.id}`} key={agent.id} className="group">
                                <div className="h-80 relative overflow-hidden bg-gray-200 border border-black/10 relative mb-4">
                                    <SafeImage src={agent.avatar_url} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={agent.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute w-full bottom-0 left-0 p-3 bg-gray-900">
                                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <p className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">{agent.specialization || 'Property Consultant'}</p>
                                        <h3 className="px-6 py-3 border border-black/10 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">{agent.name}</h3>
                                    </div>
                                </div>

                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Preview Section */}
            <section className="py-10 bg-gray-900 text-indigo-100 overflow-hidden relative">
                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                <div className="w-full relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-5 gap-8">
                        <div>
                            <span className="block text-xs text-start font-black text-indigo-100 uppercase tracking-widest mb-1">Knowledge Hub</span>
                            <h2 className="px-6 py-3 relative border border-black/30 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                Insights Journal.
                            </h2>
                        </div>
                        <Link to="/blog" className="px-6 py-3 relative border border-black/30 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            Read Journal
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {latestPosts.map((post) => (
                            <Link to={`/blog/${post.slug}`} key={post.id} className="group">
                                <div className="aspect-video overflow-hidden bg-white/5 mb-6">
                                    <SafeImage src={post.featured_image} className="w-full h-full object-cover  group-hover:scale-110 transition-all duration-700" alt={post.title} />
                                </div>
                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3">{post.category?.name}</p>
                                <h3 className="text-xl font-black uppercase tracking-widest group-hover:text-amber-500 transition-colors leading-tight">{post.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Expanded */}
            <section className="py-10">
                <div className="w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="relative h-full">
                            <SafeImage src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" className="w-full h-full grayscale border border-black/10" alt="Luxury Interior" />
                            <div className="absolute bottom-3 right-3 bg-gray-900 border border-black/30 py-5 px-10 text-indigo-100 hidden lg:block shadow-2xl">
                                <p className="text-2xl text-start font-black tracking-tighter mb-1">98%</p>
                                <p className="text-[10px] text-start font-black uppercase tracking-widest opacity-80">Customer Satisfaction</p>
                            </div>
                        </div>
                        <div className="space-y-12 flex flex-col justify-end h-full">
                            <h2 className="text-4xl lg:text-5xl text-start font-black text-black uppercase tracking-tighter leading-tight">What our clients <span className="text-blue-800 underline decoration-8 underline-offset-8">actually</span> say.</h2>
                            <div className="p-5 bg-green-600 border border-black/30 shadow-2xl relative">
                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                <div className="flex text-blue-800 mb-8"><HiOutlineStar size={24} /><HiOutlineStar size={24} /><HiOutlineStar size={24} /><HiOutlineStar size={24} /><HiOutlineStar size={24} /></div>
                                <p className="text-xl text-start font-medium italic text-indigo-100/80 leading-relaxed mb-10">"The most professional team I've ever worked with. They didn't just find me a house, they found me a future."</p>
                                <div className="flex items-end gap-4">
                                    <div className="h-12 w-12 bg-gray-900 border border-black/30 flex items-center justify-center text-indigo-100 font-black text-xl">E</div>
                                    <div className='flex flex-col justify-end h-full'>
                                        <p className="font-black text-start text-black uppercase tracking-widest text-sm">Emily Kasasa</p>
                                        <p className="text-[10px] text-start text-indigo-100/80 font-black uppercase tracking-widest">Luxury Home Owner</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-10">
                <div className="w-full">
                    <div className="bg-green-600 relative py-15 px-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-indigo-100 relative overflow-hidden">
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <div className="relative z-10 max-w-2xl text-center lg:text-left">
                            <h2 className="block text-xl text-start font-black text-indigo-100 uppercase tracking-widest mb-1">Ready to list?</h2>
                            <p className="text-xl text-black font-medium">Join thousands of homeowners who sold their property for the best market price.</p>
                        </div>
                        <div className="relative z-10 flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                            <button
                                onClick={() => setNewsletterOpen(true)}
                                className="px-6 py-3 bg-white/80 border border-black/50 text-xs text-start font-black uppercase tracking-widest text-black hover:bg-blue-600 transition shadow-lg"
                            >
                                Subscribe to our newsletter
                            </button>
                            <Link to="/about" className="px-6 py-3 border border-black/10 bg-gray-900 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                Our Process
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Modal */}
            {newsletterOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !newsletterSubmitting && setNewsletterOpen(false)}>
                    <div className="bg-white border border-black/30 w-full max-w-md p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-black text-black uppercase tracking-widest">Newsletter Signup</h3>
                            <button onClick={() => !newsletterSubmitting && setNewsletterOpen(false)} className="text-gray-500 hover:text-black text-2xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    className="w-full border border-black/30 p-3 text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    value={newsletterEmail}
                                    onChange={e => setNewsletterEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-1">Name (optional)</label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full border border-black/30 p-3 text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    value={newsletterName}
                                    onChange={e => setNewsletterName(e.target.value)}
                                />
                            </div>
                            {newsletterMessage && (
                                <p className={`text-sm font-bold ${newsletterMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {newsletterMessage.text}
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={newsletterSubmitting}
                                className="w-full py-3 bg-green-600 text-white font-black uppercase tracking-widest hover:bg-green-700 disabled:opacity-50 transition"
                            >
                                {newsletterSubmitting ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
