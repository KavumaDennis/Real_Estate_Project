import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiLocationMarker, HiOutlinePlus } from 'react-icons/hi';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';
import SafeImage from './SafeImage';
import propertyService from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import { formatUGX } from '../utils/currency';

const PropertyCard = ({ property, viewMode = 'grid', initialSaved = false }) => {
    const isList = viewMode === 'list';
    const { user } = useAuth();
    const [saved, setSaved] = useState(initialSaved);
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            window.location.href = '/login';
            return;
        }
        setSaving(true);
        try {
            const res = await propertyService.toggleSaved(property.id);
            setSaved(res.data.saved);
        } catch (err) {
            console.error('Failed to toggle saved:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={` overflow-hidden hover:shadow-2xl transition-all duration-500 group relative ${isList ? 'flex flex-col md:flex-row h-full md:h-72 space-x-3' : 'flex flex-col'}`}>
            {/* Badge Tags */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-3">
                <div className="">
                    <span className={`px-4 py-1.5 relative text-xs font-black uppercase tracking-widest text-indigo-100 shadow-lg ${property.status === 'sale' ? 'bg-blue-600' : 'bg-green-600 border border-black/30'}`}>
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        For {property.status === 'for_sale' ? 'Sale' : 'Rent'}
                    </span>
                    {property.featured && (
                        <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-orange-500 text-indigo-100 shadow-lg">
                            Featured
                        </span>
                    )}
                </div>
                {/* Save / Bookmark Button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    title={saved ? 'Remove from saved' : 'Save property'}
                    className={`z-10 w-fit p-2 backdrop-blur-md text-indigo-100 hover:bg-blue-600 transition shadow-xl border border-black/10 ${saved ? 'bg-blue-600' : 'bg-amber-600'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill={saved ? 'currentColor' : 'none'}
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
                    </svg>
                </button>
            </div>

            {/* Image Container */}
            <div className={`${isList ? 'w-full md:w-2/5 h-50 md:h-full' : 'w-full h-50'} overflow-hidden relative`}>
                <SafeImage
                    src={property.images?.[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Content Container */}
            <div className={`pt-3 flex flex-col flex-grow ${isList ? 'md:w-3/5' : 'w-full'}`}>
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-xs text-start font-black text-black uppercase tracking-widest transition leading-tight line-clamp-1">
                            {property.title}
                        </h3>
                    </div>
                    <div className="text-right flex items-center gap-1">
                       
                        <p className="text-xs text-start font-black text-indigo-600 uppercase tracking-widest">{formatUGX(property.price)}</p>
                    </div>
                </div>

                <div className={`${isList ? 'mt-10' : 'mt-0'} bg-green-600 relative border border-black/30 flex items-center justify-between p-2 py-3 mb-3`} >
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <div className="flex items-center text-indigo-100 text-sm font-medium">
                        <HiLocationMarker className="h-5 w-5 mr-1 text-black" />
                        <span className="line-clamp-1">{property.address || 'Unknown location'}</span>
                    </div>
                    <span className="text-sm font-bold text-indigo-100 uppercase tracking-widest block">{property.type}</span>
                </div>

                <div className="flex items-end justify-between gap-4 mt-auto">
                    <div className="flex items-end gap-3">
                        {(property.type === 'house' || property.type === 'apartment') && (
                            <>
                                <div className="flex items-center border border-blue-800">
                                    <div className="p-1 bg-gray-900  font-black text-indigo-100">
                                        <BiBed className="h-4 w-4 " />
                                    </div>
                                    <span className="text-sm font-black px-2 text-gray-900">{property.bedrooms} <span className="text-gray-800 font-bold">Beds</span></span>
                                </div>
                                <div className="flex items-center border border-blue-800">
                                    <div className="p-1 bg-gray-900  font-black text-indigo-100">
                                        <BiBath className="h-4 w-4 " />
                                    </div>
                                    <span className="text-sm font-black px-2 text-gray-900">{property.bathrooms} <span className="text-gray-800 font-bold">Baths</span></span>
                                </div>
                            </>
                        )}
                        {property.type === 'land' && (
                            <div className="flex items-center border border-blue-800">
                                <div className="p-1 bg-gray-900  font-black text-indigo-100">
                                    <BiArea className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-black px-2 text-gray-900">{property.land_size} <span className="text-gray-800 font-bold">{property.land_size_unit || 'sqm'}</span></span>
                            </div>
                        )}
                        {property.type === 'commercial' && (
                            <div className="flex items-center border border-blue-800">
                                <div className="p-1 bg-gray-900  font-black text-indigo-100">
                                    <HiOutlinePlus className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-bold px-2 text-gray-800 uppercase">{property.availability || 'Available'}</span>
                            </div>
                        )}
                    </div>

                    <div className="">
                        {!isList && (
                            <Link
                                to={`/properties/${property.slug}`}
                                className=""
                            >
                                <p className='px-6 py-3 bg-gray-900 border border-black/30 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg'>
                                    Details
                                </p>
                            </Link>
                        )}
                    </div>
                </div>

                {isList && (
                    <div className="mt-6 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gray-200 border border-black/30"></div>
                            <p className="text-sm font-bold text-gray-900">{property.agent?.name || 'Agent'}</p>
                        </div>
                        <Link
                            to={`/properties/${property.slug}`}
                            className="px-6 py-3 relative bg-gray-900 border border-black/10 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg"
                        >
                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            Details
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyCard;
