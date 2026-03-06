import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import propertyService from '../services/propertyService';
import api from '../services/api';
import { HiLocationMarker, HiCalendar, HiPhone, HiMail, HiOutlineShare, HiOutlineHeart, HiOutlineArrowNarrowRight, HiStar } from 'react-icons/hi';
import { BiBed, BiBath, BiArea, BiCheck, BiBuildingHouse, BiDna, BiMapAlt, BiMessageRoundedDots } from 'react-icons/bi';
import MortgageCalculator from '../components/MortgageCalculator';
import PropertyCard from '../components/PropertyCard';
import SafeImage from '../components/SafeImage';

const PropertyDetails = () => {
    const { slug } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [submittedInquiry, setSubmittedInquiry] = useState(false);
    const [similarProperties, setSimilarProperties] = useState([]);

    const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
    const [inquiryForm, setInquiryForm] = useState({
        name: '', email: '', phone: '', message: ''
    });
    const [submittingInquiry, setSubmittingInquiry] = useState(false);

    // Review State
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);

    useEffect(() => {
        fetchProperty();
    }, [slug]);

    useEffect(() => {
        if (property) {
            setInquiryForm(prev => ({
                ...prev,
                message: `I am interested in ${property.title}. Please provide more details.`
            }));
        }
    }, [property]);

    const fetchProperty = async () => {
        setLoading(true);
        try {
            const response = await propertyService.getBySlug(slug);
            const propData = response.data.data;
            setProperty(propData);

            const similarResponse = await propertyService.getAll({
                type: propData.type,
                limit: 3
            });
            setSimilarProperties(similarResponse.data.data.filter(p => p.id !== propData.id).slice(0, 3));
        } catch (error) {
            console.error('Error fetching property:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        setSubmittingInquiry(true);
        try {
            await api.post('/inquiries', {
                property_id: property.id,
                ...inquiryForm
            });
            setSubmittedInquiry(true);
            setIsInquiryModalOpen(false);
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            alert('Failed to submit inquiry. Please try again.');
        } finally {
            setSubmittingInquiry(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            await api.post('/reviews', {
                property_id: property.id,
                ...reviewForm
            });
            setReviewSuccess(true);
            setReviewForm({ rating: 5, comment: '' });
            fetchProperty(); // Refresh to show new review
        } catch (error) {
            console.error('Error submitting review:', error);
            alert(error.response?.data?.message || 'Failed to submit review. You might need to be logged in.');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="relative">
                <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <BiBuildingHouse className="h-8 w-8 text-blue-600" />
                </div>
            </div>
        </div>
    );

    if (!property) return (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Listing Not Found</h2>
            <Link to="/properties" className="px-10 py-4 bg-blue-600 text-indigo-100 font-black rounded-2xl hover:bg-blue-700 transition">
                Back to Listings
            </Link>
        </div>
    );

    const images = property.images && property.images.length > 0
        ? property.images
        : [null]; // Will trigger SafeImage placeholder

    return (
        <div className="min-h-screen">
            {/* Inquiry Modal */}
            {isInquiryModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-lg border border-black/30 shadow-2xl relative overflow-hidden">
                        <div className="bg-indigo-600 p-6 flex justify-between items-center text-indigo-100">
                            <h3 className="text-lg font-black uppercase tracking-widest">Make an Inquiry</h3>
                            <button onClick={() => setIsInquiryModalOpen(false)} className="text-indigo-100 hover:text-amber-400 transition">
                                <HiOutlineArrowNarrowRight className="h-6 w-6 rotate-180 text-indigo-100" />
                            </button>
                        </div>
                        <form onSubmit={handleInquirySubmit} className="p-8 space-y-6 bg-green-600">
                            <div>
                                <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Full Name</label>
                                <input
                                    type="text" required
                                    className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                    value={inquiryForm.name}
                                    onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Email</label>
                                    <input
                                        type="email" required
                                        className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                        value={inquiryForm.email}
                                        onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                        value={inquiryForm.phone}
                                        onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-black uppercase tracking-widest mb-1">Message</label>
                                <textarea
                                    required rows="4"
                                    className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                    value={inquiryForm.message}
                                    onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button
                                type="submit" disabled={submittingInquiry}
                                className="w-fit gap-1 px-6 py-3 self-start border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg"
                            >
                                {submittingInquiry ? 'Sending...' : 'Send Inquiry'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Premium Header */}
            <div className="pt-8">
                <div className="">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-5">
                                <Link to="/properties" className="flex items-center relative w-fit gap-1 px-6 py-3 border border-black/20 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                    <HiOutlineArrowNarrowRight className="h-5 w-5 rotate-180" />
                                    <span>Back to properties</span>
                                </Link>
                            </div>
                            <div className="flex gap-3 mb-4">
                                <span className={`px-4 py-1.5 text-xs font-black border border-black/30 uppercase tracking-widest ${property.status === 'for_sale' ? 'bg-blue-600 text-indigo-100' : 'bg-indigo-600 text-indigo-100'}`}>
                                    {property.status === 'for_sale' ? 'For Sale' : 'For Rent'}
                                </span>
                                <span className="px-4 py-1.5 bg-gray-100 border border-black/30 text-black text-xs font-black uppercase tracking-widest">
                                    {property.type}
                                </span>
                            </div>
                            <h1 className="block text-xl text-start font-black text-black uppercase tracking-widest mb-1 mb-4">{property.title}</h1>
                            <div className="flex items-center text-indigo-600 mb-5">
                                <HiLocationMarker className="h-5 w-5 mr-2 text-amber-600" />
                                <span className="text-lg font-medium">{property.address}</span>
                            </div>

                            {/* Main Image Gallery */}
                            <div className="space-y-6">
                                <div className="h-110 relative bg-gray-200 relative overflow-hidden group">
                                    <SafeImage
                                        src={images[activeImage]}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    <div className="flex gap-4 absolute bottom-3 right-3">
                                        {images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveImage(idx)}
                                                className={`flex-shrink-0 w-32 h-20 border-2 transition-all ${activeImage === idx ? 'border-indigo-600 scale-105 shadow-lg' : 'border-white/50'}`}
                                            >
                                                <SafeImage src={img} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>


                        </div>

                        {/* Sidebar */}
                        <div className="space-y-5 flex flex-col justify-between">
                            <div className="bg-indigo-600 relative p-5 border border-black/20 shadow-lg">
                                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                <h2 className='uppercase text-sm text-start mb-3'>Property valuation</h2>
                                <p className="text-xs font-black text-start text-indigo-100 uppercase tracking-widest mb-1">Asking Price</p>
                                <div className="text-4xl font-black text-start text-black/90 tracking-tight">
                                    ${property.price.toLocaleString()}
                                </div>
                                <button
                                    onClick={() => setIsInquiryModalOpen(true)}
                                    className="w-full mt-5 py-3 pl-3 bg-indigo-100 text-start border border-black/30 text-black font-black uppercase tracking-widest hover:bg-amber-600 transition shadow-lg"
                                >
                                    Make an Inquiry
                                </button>
                            </div>

                            <div className="bg-green-600 border border-black/20 p-5 text-indigo-100 shadow-xl relative overflow-hidden group">
                                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                <div className="relative z-10">
                                    <div className="flex items-end gap-4 mb-6">
                                        <div className="h-15 w-15 bg-white border border-black/30 flex items-center justify-center text-teal-700 font-black text-2xl">
                                            {property.agent?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-start font-black text-indigo-100/60 uppercase tracking-widest">Listing Agent</p>
                                            <h3 className="text-xl text-start font-black uppercase tracking-widest">{property.agent?.name}</h3>
                                        </div>
                                    </div>
                                    <p className="text-sm text-start font-medium mb-8 text-indigo-100/80 leading-relaxed">
                                        Expert in {property.type} properties with over 10 years of experience in the {property.location?.name} area.
                                    </p>
                                    <Link
                                        to={`/agents/${property.agent?.id}`}
                                        className="w-full block py-3 bg-indigo-600 text-start text-indigo-100 pl-3 border border-black/20 font-black uppercase tracking-widest hover:bg-blue-600 hover:text-indigo-100 transition"
                                    >
                                        Agent Profile
                                    </Link>
                                </div>
                            </div>
                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Bedrooms</p>
                                    <div className="flex items-center w-full gap-1 relative border border-black/10 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                          <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <div className="px-3 py-2 border-r border-black/40">
                                            <BiBed className="h-5 w-5 text-indigo-100" />
                                        </div>
                                        <span className="font-black">{property.bedrooms}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Bathrooms</p>
                                    <div className="flex items-center w-full gap-1 relative border border-black/10 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                          <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <div className="px-3 py-2 border-r border-black/40">
                                            <BiBath className="h-5 w-5 text-indigo-100" />
                                        </div>
                                        <span className="font-black">{property.bathrooms}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Area Size</p>
                                    <div className="flex items-center w-full gap-1 relative border border-black/10 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                          <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <div className="px-3 py-2 border-r border-black/40">
                                            <BiArea className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <span className="font-black">{property.size} sqft</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Property Type</p>
                                    <div className="flex items-center w-full gap-1 relative border border-black/30 bg-indigo-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg">
                                          <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <div className="px-3 py-2 border-r border-black/40">
                                            <BiBuildingHouse className="h-5 w-5 text-indigo-100" />
                                        </div>
                                        <span className="font-black px-2">{property.type}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2  py-10">
                        {/* Description */}
                        <div className="">
                            <h2 className="text-2xl text-start font-black text-black uppercase tracking-widest mb-3">Property Description</h2>
                            <p className="text-indigo-600 font-bold text-start mr-5 leading-relaxed whitespace-pre-line text-md">
                                {property.description}
                            </p>
                        </div>

                        {/* Review Form */}
                        <div className="bg-gray-900 p-8 text-indigo-100">
                            <h3 className="text-lg text-start font-black uppercase tracking-widest mb-6">Write a Review</h3>
                            {reviewSuccess ? (
                                <div className="bg-green-500/10 border border-green-500/30 p-6 text-center">
                                    <BiCheck className="h-10 w-10 text-green-400 mx-auto mb-2" />
                                    <p className="font-black uppercase tracking-widest text-sm">Review Submitted Successfully!</p>
                                    <button onClick={() => setReviewSuccess(false)} className="mt-4 text-xs font-bold text-amber-500 hover:text-amber-400 underline uppercase tracking-widest">
                                        Write another one
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleReviewSubmit} className="space-y-6 flex flex-col items-start">
                                    <div>
                                        <label className="block text-[10px] text-start font-black text-indigo-100/60 uppercase tracking-widest mb-2">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star} type="button"
                                                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                    className={`p-1 transition-colors ${reviewForm.rating >= star ? 'text-amber-500' : 'text-gray-600'}`}
                                                >
                                                    <HiStar className="h-8 w-8 fill-current" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='w-full'>
                                        <label className="block text-[10px] text-start font-black text-indigo-100/60 uppercase tracking-widest mb-2">Your Experience</label>
                                        <textarea
                                            required rows="4"
                                            className="w-full bg-white/5 border border-white/10 p-4 focus:ring-0 text-sm font-medium placeholder-white/20"
                                            value={reviewForm.comment}
                                            onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                            placeholder="Tell others about your thoughts on this property..."
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit" disabled={submittingReview}
                                        className="w-fit gap-1 text-start px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-indigo-100 hover:bg-blue-600 transition shadow-lg disabled:opacity-50"
                                    >
                                        {submittingReview ? 'Submitting...' : 'Post Review'}
                                    </button>
                                </form>
                            )}
                        </div>

                    </div>
                    {/* Reviews Section */}
                    <div className="py-10 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-2xl font-black text-black uppercase tracking-widest flex items-center gap-2">
                                Property Reviews
                            </h2>
                            <span className="text-gray-400 font-bold">{property.reviews?.length || 0} reviews</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {property.reviews?.length > 0 ? (
                                property.reviews.map((review) => (
                                    <div key={review.id} className="bg-white p-5 border border-dashed border-black/30">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-end gap-4">
                                                <div className="h-12 w-12 bg-amber-600 flex items-center justify-center text-indigo-100 font-black text-xl">
                                                    {review.user?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-start text-black uppercase tracking-widest text-sm">{review.user?.name}</p>
                                                    <p className="text-[10px] text-start text-gray-400 font-bold">{review.created_at}</p>
                                                </div>
                                            </div>
                                            <div className="flex text-yellow-500 bg-indigo-600 p-.5 border border-black/20">
                                                {[...Array(5)].map((_, i) => (
                                                    <HiStar key={i} className={`h-5 w-5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-start italic p-3 border-t border-black/30">"{review.comment}"</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 font-medium italic">No reviews yet for this property.</p>
                            )}
                        </div>

                    </div>

                    {/* Similar Properties */}
                    {similarProperties.length > 0 && (
                        <div className="py-24 border-t border-gray-100 mt-12">
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-3xl font-black text-black uppercase tracking-widest">Similar Properties</h2>
                                <Link to="/properties" className="px-8 py-3 bg-teal-700 text-indigo-100 text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition shadow-lg">View All</Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {similarProperties.map(prop => (
                                    <PropertyCard key={prop.id} property={prop} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
