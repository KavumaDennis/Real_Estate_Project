import { useState, useEffect } from 'react';
import propertyService from '../services/propertyService';
import { HiSearch, HiFilter, HiViewGrid, HiViewList, HiOutlineMap } from 'react-icons/hi';
import PropertyCard from '../components/PropertyCard';
import { useSearchParams } from 'react-router-dom';

const Properties = () => {
    const [searchParams] = useSearchParams();
    const typeParam = searchParams.get('type') || '';
    const statusParam = searchParams.get('status') || '';

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showMap, setShowMap] = useState(false);

    const [filters, setFilters] = useState({
        type: typeParam,
        status: statusParam,
        min_price: '',
        max_price: '',
        bedrooms: '',
        bathrooms: '',
        keyword: '',
    });

    useEffect(() => {
        fetchProperties();
    }, [filters]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await propertyService.getAll(filters);
            setProperties(response.data.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-emerald-100/80 backdrop-blur-2xl min-h-screen py-5">
            <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between mt-3">
                    <div className='flex items-center gap-3'>
                        <h1 className="text-lg text-black font-black uppercase tracking-widest">Explore Properties</h1>
                        <p className="text-amber-600 font-medium ml-8">Find your next home from our curated selection.</p>
                    </div>

                    <div className="mt-6 md:mt-0 flex items-center bg-amber-600 border border-black/10">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 px-2.5 transition ${viewMode === 'grid' ? 'bg-black/85 text-white shadow-lg ' : 'text-black hover:bg-black/85 hover:text-white'}`}
                        >
                            <HiViewGrid className="h-6 w-6" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 px-2.5 transition ${viewMode === 'list' ? 'bg-black/85 text-white shadow-lg' : 'text-black hover:bg-black/85 hover:text-white'}`}
                        >
                            <HiViewList className="h-6 w-6" />
                        </button>
                        <div className="w-px h-8 bg-gray-100 mx-2"></div>
                        <button
                            onClick={() => setShowMap(!showMap)}
                            className={`flex items-center space-x-2 px-4 py-3 transition ${showMap ? ' bg-emerald-700 text-white' : 'text-white hover:bg-black/85'}`}
                        >
                            <HiOutlineMap className="h-6 w-6" />
                            <span className="font-bold">Map</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-teal-700 border border-black/10 p-4 shadow-sm sticky top-24">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-1 text-black">
                                    <HiFilter className="h-4 w-4" />
                                    <h2 className="text-xs font-black uppercase tracking-widest">Filters</h2>
                                </div>
                                <button
                                    onClick={() => setFilters({ type: '', status: '', min_price: '', max_price: '', bedrooms: '', bathrooms: '', keyword: '' })}
                                    className="text-xs font-black text-white uppercase tracking-widest hover:text-blue-600"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Keyword</label>
                                    <div className="relative">
                                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                                        <input
                                            type="text"
                                            name="keyword"
                                            placeholder="Search by name..."
                                            className="w-full bg-gray-50 border border-black/80 p-2 pl-10 pr-4 focus:ring-0 text-sm font-bold placeholder-black/70"
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={filters.status}
                                        className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70"
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Any Status</option>
                                        <option value="sale">For Sale</option>
                                        <option value="rent">For Rent</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Type</label>
                                    <select
                                        name="type"
                                        value={filters.type}
                                        className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70"
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Any Type</option>
                                        <option value="house">House</option>
                                        <option value="apartment">Apartment</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="land">Land</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Price Range</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="number"
                                            name="min_price"
                                            placeholder="Min"
                                            className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold placeholder-black/70"
                                            onChange={handleFilterChange}
                                        />
                                        <input
                                            type="number"
                                            name="max_price"
                                            placeholder="Max"
                                            className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold placeholder-black/70"
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Beds</label>
                                        <select name="bedrooms" className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70" onChange={handleFilterChange}>
                                            <option value="">Any</option>
                                            <option value="1">1+</option>
                                            <option value="2">2+</option>
                                            <option value="3">3+</option>
                                            <option value="4">4+</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Baths</label>
                                        <select name="bathrooms" className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70" onChange={handleFilterChange}>
                                            <option value="">Any</option>
                                            <option value="1">1+</option>
                                            <option value="2">2+</option>
                                            <option value="3">3+</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        {showMap ? (
                            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 h-[800px] flex items-center justify-center p-12 text-center">
                                <div>
                                    <HiOutlineMap className="h-20 w-20 text-blue-100 mx-auto mb-6" />
                                    <h2 className="text-3xl font-black text-gray-900 mb-4">Interactive Map View</h2>
                                    <p className="text-gray-500 max-w-sm mx-auto">Zoom in and navigate to explore properties by neighborhood. This feature requires a Google Maps API Key.</p>
                                    <button className="mt-8 px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition" onClick={() => setShowMap(false)}>
                                        Back to List
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="my-3 flex justify-between items-center">
                                    <p className="text-gray-500 font-bold"><span className="text-gray-900">{properties.length}</span> properties found</p>
                                    <div className="flex items-center space-x-2">
                                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest">Sort by:</label>
                                        <select className="border border-black/20 bg-emerald-600 font-black text-gray-900 focus:outline-none cursor-pointer p-0.5">
                                            <option>Newest first</option>
                                            <option>Price: Low to High</option>
                                            <option>Price: High to Low</option>
                                        </select>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {[1, 2, 4, 5, 6].map(i => (
                                            <div key={i} className="h-[450px] bg-gray-100 animate-pulse rounded-[40px]"></div>
                                        ))}
                                    </div>
                                ) : properties.length > 0 ? (
                                    <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                                        {properties.map((property) => (
                                            <PropertyCard key={property.id} property={property} viewMode={viewMode} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white/70 p-24 border border-dashed border-black/30 text-center shadow-sm">
                                        <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                            <HiSearch className="h-10 w-10 text-gray-200" />
                                        </div>
                                        <h3 className="text-4xl font-black text-gray-900 mb-4">No Matches Found</h3>
                                        <p className="text-gray-400 text-lg max-w-sm mx-auto">We couldn't find any properties matching your criteria. Try expanding your search or resetting filters.</p>
                                        <button
                                            onClick={() => setFilters({ type: '', status: '', min_price: '', max_price: '', bedrooms: '', bathrooms: '', keyword: '' })}
                                            className="mt-10 px-6 py-3 border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                )}

                                {/* Pagination Placeholder */}
                                {properties.length > 0 && (
                                    <div className="mt-20 flex justify-center">
                                        <button className="px-12 py-5 bg-teal-700 border border-gray-100 shadow-sm text-white font-black hover:bg-gray-50 transition">
                                            Load More Properties
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Properties;
