import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import { HiOutlineBookmark } from 'react-icons/hi';

const SavedProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSaved();
    }, []);

    const fetchSaved = async () => {
        setLoading(true);
        try {
            const res = await propertyService.getSaved();
            setProperties(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch saved properties:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (id) => {
        try {
            await propertyService.toggleSaved(id);
            setProperties(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Failed to unsave:', err);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Saved Properties</h1>
                    <p className="px-6 py-3 border border-black/10 bg-green-600 relative text-xs text-start font-black uppercase tracking-widest text-white shadow-lg">
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        Your bookmarked property listings.
                    </p>
                </div>
                <Link to="/properties" className="px-6 py-3 flex items-center gap-2 border border-black/10 bg-gray-900 relative z-10 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg w-fit">
                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    Browse More
                </Link>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading saved listings...</p>
                </div>
            ) : properties.length === 0 ? (
                <div className="py-40 text-center border border-dashed border-black/20">
                    <HiOutlineBookmark className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">No Saved Properties</h2>
                    <p className="text-gray-400 font-medium mb-8">Start saving properties by clicking the bookmark icon on any listing.</p>
                    <Link to="/properties" className="px-6 py-3 inline-block border border-black/10 bg-amber-600 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                        Explore Listings
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
                    {properties.map(property => (
                        <div key={property.id} className="relative">
                            <PropertyCard property={property} initialSaved={true} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedProperties;
