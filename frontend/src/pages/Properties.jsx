import { useState, useEffect, useRef } from 'react';
import propertyService from '../services/propertyService';
import { HiSearch, HiFilter, HiViewGrid, HiViewList, HiOutlineMap } from 'react-icons/hi';
import PropertyCard from '../components/PropertyCard';
import { useSearchParams } from 'react-router-dom';

const OSMLeafletMap = ({ properties = [], onBackToList }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [tileStatus, setTileStatus] = useState('loading');

    const getPropertyCoordinates = (property) => {
        const propertyLat = Number(property?.coordinates?.lat);
        const propertyLng = Number(property?.coordinates?.lng);
        if (Number.isFinite(propertyLat) && Number.isFinite(propertyLng)) {
            return { lat: propertyLat, lng: propertyLng, source: 'property' };
        }

        const locationLat = Number(property?.location?.latitude);
        const locationLng = Number(property?.location?.longitude);
        if (Number.isFinite(locationLat) && Number.isFinite(locationLng)) {
            return { lat: locationLat, lng: locationLng, source: 'city' };
        }

        return null;
    };

    useEffect(() => {
        const ensureLeaflet = async () => {
            if (!document.getElementById('leaflet-css')) {
                const css = document.createElement('link');
                css.id = 'leaflet-css';
                css.rel = 'stylesheet';
                css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
                css.crossOrigin = '';
                document.head.appendChild(css);
            }

            if (!window.L) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
                    script.crossOrigin = '';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
            }

            if (!mapRef.current) return;

            const L = window.L;
            const availableWithCoords = properties.filter((property) => {
                const coords = getPropertyCoordinates(property);
                return (property.availability === 'available' || !property.availability) && !!coords;
            });

            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }

            const defaultCenter = [0.3136, 32.5811]; // Kampala
            const map = L.map(mapRef.current, { zoomControl: true }).setView(defaultCenter, 10);
            mapInstanceRef.current = map;

            const baseLayers = [
                {
                    name: 'Esri Streets',
                    layer: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                        attribution: 'Tiles &copy; Esri',
                        maxZoom: 19,
                    }),
                },
                {
                    name: 'CARTO Voyager',
                    layer: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
                        maxZoom: 20,
                    }),
                },
                {
                    name: 'OpenStreetMap',
                    layer: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors',
                        maxZoom: 19,
                    }),
                },
            ];

            let activeLayerIndex = 0;
            let tileErrors = 0;

            const setLayer = (index) => {
                baseLayers.forEach((entry) => {
                    if (map.hasLayer(entry.layer)) map.removeLayer(entry.layer);
                });
                activeLayerIndex = index;
                tileErrors = 0;
                setTileStatus('loading');
                baseLayers[index].layer.addTo(map);
            };

            const tryNextLayer = () => {
                const next = activeLayerIndex + 1;
                if (next < baseLayers.length) {
                    setLayer(next);
                } else {
                    setTileStatus('failed');
                }
            };

            baseLayers.forEach((entry) => {
                entry.layer.on('load', () => setTileStatus('ready'));
                entry.layer.on('tileerror', () => {
                    tileErrors += 1;
                    if (tileErrors > 8) {
                        tryNextLayer();
                    }
                });
            });

            setLayer(0);

            L.control.layers(
                Object.fromEntries(baseLayers.map((entry) => [entry.name, entry.layer])),
                {},
                { position: 'topright' }
            ).addTo(map);

            if (availableWithCoords.length > 0) {
                const bounds = [];
                availableWithCoords.forEach((property) => {
                    const coords = getPropertyCoordinates(property);
                    if (!coords) return;
                    const lat = coords.lat;
                    const lng = coords.lng;
                    bounds.push([lat, lng]);
                    const marker = L.marker([lat, lng]).addTo(map);
                    marker.bindPopup(
                        `<div style="min-width:180px">
                            <strong>${property.title}</strong><br/>
                            <small>${property.location?.name || property.address || ''}</small><br/>
                            <small style="display:block;color:#475569;margin-top:2px;">${coords.source === 'city' ? 'City-level location' : 'Exact property location'}</small>
                            <a href="/properties/${property.slug}" style="color:#2563eb;font-weight:700;text-decoration:underline;">View property</a>
                        </div>`
                    );
                });
                map.fitBounds(bounds, { padding: [30, 30] });
            }

            // Ensures tiles render correctly after panel/layout transitions.
            setTimeout(() => map.invalidateSize(), 0);
        };

        ensureLeaflet().catch((error) => {
            console.error('Failed to load map:', error);
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [properties]);

    const plottedCount = properties.filter((property) => {
        const propertyLat = Number(property?.coordinates?.lat);
        const propertyLng = Number(property?.coordinates?.lng);
        const locationLat = Number(property?.location?.latitude);
        const locationLng = Number(property?.location?.longitude);
        const hasCoordinates = (Number.isFinite(propertyLat) && Number.isFinite(propertyLng))
            || (Number.isFinite(locationLat) && Number.isFinite(locationLng));
        return (property.availability === 'available' || !property.availability) && hasCoordinates;
    }).length;

    return (
        <div className="bg-green-100/50 relative z-10 shadow-sm border border-gray-100 h-[800px] p-4">
            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0 pointer-events-none' alt="" />
            <div className="relative z-10 flex items-center justify-between mb-3">
                <p className="text-xs font-black uppercase tracking-widest text-black">
                    Showing {plottedCount} available properties on map
                </p>
                <button
                    className="px-6 py-2.5 bg-gray-900 border border-black/30 relative z-10 text-white font-black hover:bg-blue-700 transition"
                    onClick={onBackToList}
                >
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    Back to List
                </button>
            </div>
            {tileStatus === 'failed' && (
                <div className="relative z-10 mb-3 p-3 bg-red-100 border border-red-300 text-red-700 text-xs font-black uppercase tracking-widest">
                    Map tiles failed to load from all providers. Check internet/firewall and retry.
                </div>
            )}
            <div ref={mapRef} className="relative z-10 h-[730px] w-full border border-black/30" />
        </div>
    );
};

const Properties = () => {
    const [searchParams] = useSearchParams();
    const typeParam = searchParams.get('type') || '';
    const statusParam = searchParams.get('status') || '';
    const locationIdParam = searchParams.get('location_id') || '';

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showMap, setShowMap] = useState(false);

    const [filters, setFilters] = useState({
        type: typeParam,
        status: statusParam,
        location_id: locationIdParam,
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
        <div className="min-h-screen py-2">
            <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className='flex items-center gap-3'>
                        <h1 className="text-lg text-black font-black uppercase tracking-widest">Explore Properties</h1>
                        <p className="text-blue-800 font-medium ml-5">Find your next home from our curated selection.</p>
                    </div>

                    <div className="mt-6 md:mt-0 relative flex items-center bg-gray-900 border border-black/30">
                      <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 transition z-10 relative ${viewMode === 'grid' ? 'bg-green-600 text-white shadow-lg ' : 'text-black hover:bg-black/85 hover:text-white'}`}
                        >
                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <HiViewGrid className="h-6 w-6" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 transition z-10 relative ${viewMode === 'list' ? 'bg-green-600 text-white shadow-lg' : 'text-black hover:bg-black/85 hover:text-white'}`}
                        >
                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <HiViewList className="h-6 w-6" />
                        </button>
                        <div className="w-px h-8 bg-gray-100 mx-2"></div>
                        <button
                            onClick={() => setShowMap(!showMap)}
                            className={`flex items-center space-x-2 px-4 py-2.5 transition z-10 relative ${showMap ? ' bg-green-600 text-white' : 'text-white hover:bg-black/85'}`}
                        >
                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <HiOutlineMap className="h-6 w-6" />
                            <span className="font-bold">Map</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-green-600 relative border border-black/30 p-4 shadow-sm sticky top-24">
                          <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <div className="flex items-center justify-between mb-8 z-10 relative">
                                <div className="flex items-center space-x-1 text-black">
                                    <HiFilter className="h-4 w-4" />
                                    <h2 className="text-xs font-black uppercase tracking-widest">Filters</h2>
                                </div>
                                <button
                                    onClick={() => setFilters({ type: '', status: '', location_id: '', min_price: '', max_price: '', bedrooms: '', bathrooms: '', keyword: '' })}
                                    className="text-xs font-black text-white uppercase tracking-widest hover:text-gray-900"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="space-y-6 z-10 relative">
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
                                        <option value="for_sale">For Sale</option>
                                        <option value="for_rent">For Rent</option>
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
                    <div className="lg:col-span-3 z-10 relative">
                        {showMap ? (
                            <OSMLeafletMap className="" properties={properties} onBackToList={() => setShowMap(false)} />
                        ) : (
                            <>
                                <div className="my-3 flex justify-between items-center">
                                    <p className="text-gray-500 font-bold"><span className="text-gray-900">{properties.length}</span> properties found</p>
                                    <div className="flex items-center space-x-2">
                                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest">Sort by:</label>
                                        <select className="border border-black/30 bg-green-600/80 font-black text-gray-900 focus:outline-none cursor-pointer p-0.5">
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
                                            onClick={() => setFilters({ type: '', status: '', location_id: '', min_price: '', max_price: '', bedrooms: '', bathrooms: '', keyword: '' })}
                                            className="mt-10 px-6 py-3 border border-black/10 bg-teal-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                )}

                                {/* Pagination Placeholder */}
                                {properties.length > 0 && (
                                    <div className="mt-20 flex justify-center">
                                        <button className="px-12 py-3 bg-gray-900 z-10 relative border border-white/30 shadow-sm text-white font-black transition">
                                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
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
