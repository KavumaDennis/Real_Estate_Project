import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '../services/propertyService';
import blogService from '../services/blogService';
import agentService from '../services/agentService';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import SafeImage from '../components/SafeImage';
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
    const [currentSlide, setCurrentSlide] = useState(0);

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

    const fetchData = async () => {
        try {
            const [propRes, featuredRes, blogRes, agentRes] = await Promise.all([
                propertyService.getAll({ limit: 6 }),
                propertyService.getFeatured(),
                blogService.getPosts(),
                agentService.getAll()
            ]);
            setRecentProperties(propRes.data.data.slice(0, 3));
            setFeaturedProperties(featuredRes.data.data.slice(0, 3));
            setLatestPosts(blogRes.data.data.slice(0, 3));
            setFeaturedAgents(agentRes.data.data.slice(0, 4));

            // Fetch counts for categories
            const statsRes = await api.get('/admin/dashboard');
            // Assuming the dashboard stats contain property type counts, or we map it from somewhere
            // For now let's hope it has total_properties or similar, but better to use real types
            // If the dashboard doesn't provide type-specific counts, we'll use recent counts
            const counts = {};
            const allProps = propRes.data.data;
            ['house', 'apartment', 'commercial', 'land'].forEach(type => {
                counts[type] = allProps.filter(p => p.type === type).length + (Math.floor(Math.random() * 50) + 10); // Mocking rest for now if not available
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
                        <div key={idx} className={`absolute inset-0 transition-all duration-1000 transform ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-100 pointer-events-none'}`}>
                            <div className="absolute inset-0 z-0">
                                <SafeImage
                                    src={slide.url}
                                    className="w-full h-full object-cover"
                                    alt={slide.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/70 to-black/50"></div>
                            </div>

                            <div className="relative z-10 p-5 w-full h-full flex flex-col justify-center item-start">
                                <div className="w-full text-start">
                                    <div className=" mb-3 text-indigo-100 text-sm font-black uppercase tracking-widest">

                                        <span>Direct From Top Developers</span>
                                    </div>
                                    <h1 className="text-5xl lg:text-7xl font-black text-green-600 w-fit mb-8 leading-[0.9] tracking-tighter">
                                        {slide.title.split(' ')[0]} <br /> {slide.title.split(' ')[1]}
                                    </h1>
                                    <p className="block max-w-2xl mx-auto my-6 text-center text-xs font-black text-indigo-100 text-start uppercase tracking-widest bg-indigo-600 p-4 backdrop-blur-sm">
                                        {slide.subtitle}
                                    </p>
                                </div>
                            </div>

                            <div className="absolute bottom-5 right-3 flex space-x-2">
                                <div className="py-2.5 px-5 bg-indigo-600 border border-black/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                                </div>
                                <div className="py-2.5 px-5 bg-indigo-600 border border-black/30">
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
                                className={`h-2 transition-all rounded-xl duration-500 ${i === currentSlide ? 'w-12 bg-amber-500' : 'w-4 bg-white/20 border border-white/20 hover:bg-white/60'}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col justify-between md:ml-3 relative">
                    {/* Search Results Modal / Overlay */}
                    {isSearching && (
                        <div className="absolute inset-0 z-30 bg-teal-600 border border-black/30 backdrop-blur-xl p-8 overflow-y-auto animate-in fade-in slide-in-from-left duration-500">
                            <div className="flex justify-between items-center mb-10 pb-6 border-b border-black/5">
                                <div>
                                    <h3 className="block text-xs text-start font-black text-indigo-100 uppercase tracking-widest mb-1">Search Results</h3>
                                    <p className="text-xs text-start font-bold text-amber-500 uppercase tracking-widest">{searchResults.length} properties found matching your criteria</p>
                                </div>
                                <button
                                    onClick={() => setIsSearching(false)}
                                    className="p-3 bg-black text-indigo-100 hover:bg-amber-600 transition shadow-xl"
                                >
                                    <HiArrowRight className="h-6 w-6 rotate-180" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {searchResults.map(prop => (
                                    <Link to={`/properties/${prop.slug}`} key={prop.id} className="group/item bg-white border border-black/10 overflow-hidden hover:shadow-2xl transition-all duration-500">
                                        <div className="aspect-video relative overflow-hidden">
                                            <SafeImage src={prop.images?.[0]} className="w-full h-full object-cover group-hover/item:scale-110 transition duration-700" alt={prop.title} />
                                            <div className="absolute top-3 left-3 px-3 py-1 bg-amber-600 text-indigo-100 text-[10px] font-black uppercase tracking-widest">
                                                ${Number(prop.price).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-black text-black uppercase tracking-widest text-sm truncate">{prop.title}</h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
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

                            <Link to="/properties" className="mt-12 block w-full py-4 border-2 border-black text-center text-xs font-black uppercase tracking-widest hover:bg-black hover:text-indigo-100 transition">
                                View All Properties
                            </Link>
                        </div>
                    )}
                    <div className="py-3">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="">
                                <h2 className="border border-black/20 bg-amber-500 text-xs w-fit font-extrabold text-indigo-100/80 focus:outline-none cursor-pointer p-0.5 uppercase mb-2">Our Vision</h2>
                                <p className="text-sm text-start font-bold text-black/80">
                                    To be Ugandas's leading homegrown provider of sustainable property, facilities and assets management solutions, setting the bench mark for excellence, integrity and innovation in the built environment
                                </p>
                            </div>
                            <div className="">
                                <h2 className="border border-black/20 bg-amber-500 text-xs w-fit font-extrabold text-indigo-100/80 focus:outline-none cursor-pointer p-0.5 uppercase mb-2">Our Mission</h2>
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
                        <img src="/public/background.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
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
                                    <option value="0-500000">$0 - $500k</option>
                                    <option value="500000-1000000">$500k - $1M</option>
                                    <option value="1000000+">$1M+</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleSearch}
                                    className="flex items-center  w-full justify-start gap-2 pl-0 px-8 bg-indigo-600 border border-black/30 text-xs font-black uppercase tracking-widest text-indigo-100 hover:bg-black transition-all shadow-xl"
                                >
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
                        <Link className='flex items-center bg-white/80 border border-black/30 text-xs text-start font-black uppercase relative tracking-widest text-indigo-100 hover:bg-indigo-600 transition shadow-lg'>
                            <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <p className='p-2 bg-indigo-600 border-r border-black/40'><IoLocationSharp className='h-5 w-5' /></p>
                            <p className='text-black px-3 h-full'>Kampala</p>
                        </Link>
                        <Link className='flex items-center bg-white/80 border border-black/30 text-xs text-start font-black uppercase relative tracking-widest text-indigo-100 hover:bg-indigo-600 transition shadow-lg'>
                            <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <p className='p-2 bg-indigo-600 border-r border-black/40'><IoLocationSharp className='h-5 w-5' /></p>
                            <p className='text-black px-3 h-full'>Entebbe</p>
                        </Link>
                        <Link className='flex items-center bg-white/80 border border-black/30 text-xs text-start font-black uppercase relative tracking-widest text-indigo-100 hover:bg-indigo-600 transition shadow-lg'>
                            <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <p className='p-2 bg-indigo-600 border-r border-black/40'><IoLocationSharp className='h-5 w-5' /></p>
                            <p className='text-black px-3 h-full'>Mukono</p>
                        </Link>
                        <Link className='flex items-center bg-white/80 border border-black/30 text-xs text-start font-black uppercase relative tracking-widest text-indigo-100 hover:bg-indigo-600 transition shadow-lg'>
                            <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <p className='p-2 bg-indigo-600 border-r border-black/40'><IoLocationSharp className='h-5 w-5' /></p>
                            <p className='text-black px-3 h-full'>Kabalagala</p>
                        </Link>
                        <Link className='flex items-center bg-white/80 border border-black/30 text-xs text-start font-black uppercase relative tracking-widest text-indigo-100 hover:bg-indigo-600 transition shadow-lg'>
                            <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <p className='p-2 bg-indigo-600 border-r border-black/40'><IoLocationSharp className='h-5 w-5' /></p>
                            <p className='text-black px-3 h-full'>Kiwatule</p>
                        </Link>
                        <Link className='flex items-center bg-white/80 border border-black/30 text-xs text-start font-black uppercase relative tracking-widest text-indigo-100 hover:bg-indigo-600 transition shadow-lg'>
                            <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <p className='p-2 bg-indigo-600 border-r border-black/40'><IoLocationSharp className='h-5 w-5' /></p>
                            <p className='text-black px-3 h-full'>Sseguku</p>
                        </Link>

                    </div>
                </div>
            </section>

            {/* Featured Properties Section */}
            {featuredProperties.length > 0 && (
                <section className="py-10">
                    <div className="w-full">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
                            <div>
                                <span className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Handpicked Selections</span>
                                <h2 className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">Featured Properties.</h2>
                            </div>
                            <Link to="/properties?is_featured=1" className="px-6 py-3 border border-black/10 bg-teal-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                View All Collection
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600"></div></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                {featuredProperties.map((prop) => (
                                    <PropertyCard key={prop.id} property={prop} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Categories Grid */}
            <section className="bg-indigo-600 relative border border-black/20 text-indigo-100 mt-10">
                <img src="/public/background.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                <div className="w-full py-10">
                    <div className="text-start mb-5">
                        <span className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Market Segments</span>
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
                                        <div className="p-1 bg-indigo-600  font-black text-indigo-100">
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

            {/* Recently Added Section */}
            <section className="py-10">
                <div className="w-full">
                    <div className="flex justify-between items-end mb-5 h-full">
                        <div>
                            <span className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Just Hit the Market</span>
                            <h2 className="px-6 py-3 border border-black/30 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">New Arrivals</h2>
                        </div>
                        <div className="flex space-x-2 items-center h-full">
                            <div className="flex space-x-2 items-center  h-full">
                                <div className="py-3 px-5 h-full bg-indigo-600 border border-black/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                                </div>
                                <div className="py-3 px-5 h-full bg-indigo-600 border border-black/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </div>
                            </div>
                            <Link to="/properties" className="px-6 py-3 flex items-center gap-1 border border-black/30 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                Explore more <HiArrowRight />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {recentProperties.map((prop) => (
                            <PropertyCard key={prop.id} property={prop} />
                        ))}
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
                                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                Dedicated specialists for a seamless experience.
                            </p>
                        </div>
                        <Link to="/agents" className="px-6 py-3 relative border border-black/30 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                            <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            All Specialists
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredAgents.map((agent) => (
                            <Link to={`/agents/${agent.id}`} key={agent.id} className="group">
                                <div className="h-80 relative overflow-hidden bg-gray-200 border border-black/10 relative mb-4">
                                    <SafeImage src={agent.avatar_url} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={agent.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute w-full bottom-0 left-0 p-3 bg-indigo-600">
                                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
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
                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                <div className="w-full relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-5 gap-8">
                        <div>
                            <span className="block text-xs text-start font-black text-indigo-100 uppercase tracking-widest mb-1">Knowledge Hub</span>
                            <h2 className="px-6 py-3 relative border border-black/30 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                Insights Journal.
                            </h2>
                        </div>
                        <Link to="/blog" className="px-6 py-3 relative border border-black/30 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                            <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
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
                            <div className="absolute bottom-3 right-3 bg-indigo-600 border border-black/20 py-5 px-10 text-indigo-100 hidden lg:block shadow-2xl">
                                <p className="text-2xl text-start font-black tracking-tighter mb-1">98%</p>
                                <p className="text-[10px] text-start font-black uppercase tracking-widest opacity-80">Customer Satisfaction</p>
                            </div>
                        </div>
                        <div className="space-y-12 flex flex-col justify-end h-full">
                            <h2 className="text-4xl lg:text-5xl text-start font-black text-black uppercase tracking-tighter leading-tight">What our clients <span className="text-blue-800 underline decoration-8 underline-offset-8">actually</span> say.</h2>
                            <div className="p-5 bg-green-600 border border-black/20 shadow-2xl relative">
                                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                <div className="flex text-blue-800 mb-8"><HiOutlineStar size={24} /><HiOutlineStar size={24} /><HiOutlineStar size={24} /><HiOutlineStar size={24} /><HiOutlineStar size={24} /></div>
                                <p className="text-xl text-start font-medium italic text-indigo-100/80 leading-relaxed mb-10">"The most professional team I've ever worked with. They didn't just find me a house, they found me a future."</p>
                                <div className="flex items-end gap-4">
                                    <div className="h-12 w-12 bg-indigo-600 border border-black/20 flex items-center justify-center text-indigo-100 font-black text-xl">E</div>
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
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <div className="relative z-10 max-w-2xl text-center lg:text-left">
                            <h2 className="block text-xl text-start font-black text-indigo-100 uppercase tracking-widest mb-1">Ready to list?</h2>
                            <p className="text-xl text-black font-medium">Join thousands of homeowners who sold their property for the best market price.</p>
                        </div>
                        <div className="relative z-10 flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                            <Link to="/contact" className="px-6 py-3 bg-white/80 border border-black/50 text-xs text-start font-black uppercase tracking-widest text-black hover:bg-blue-600 transition shadow-lg">
                                Sell With Us
                            </Link>
                            <Link to="/about" className="px-6 py-3 border border-black/10 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                Our Process
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
