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
            <Link to="/properties" className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition">
                Back to Listings
            </Link>
        </div>
    );

    const images = property.images && property.images.length > 0
        ? property.images
        : [null]; // Will trigger SafeImage placeholder

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Inquiry Modal */}
            {isInquiryModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg border border-black/20 shadow-2xl relative overflow-hidden">
                        <div className="bg-teal-700 p-6 flex justify-between items-center text-white">
                            <h3 className="text-lg font-black uppercase tracking-widest">Make an Inquiry</h3>
                            <button onClick={() => setIsInquiryModalOpen(false)} className="text-white hover:text-amber-400 transition">
                                <HiOutlineArrowNarrowRight className="h-6 w-6 rotate-180 text-white" />
                            </button>
                        </div>
                        <form onSubmit={handleInquirySubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-black text-black uppercase tracking-widest mb-1">Full Name</label>
                                <input
                                    type="text" required
                                    className="w-full bg-gray-50 border border-black/80 p-3 focus:ring-0 text-sm font-bold placeholder-black/30"
                                    value={inquiryForm.name}
                                    onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-black uppercase tracking-widest mb-1">Email</label>
                                    <input
                                        type="email" required
                                        className="w-full bg-gray-50 border border-black/80 p-3 focus:ring-0 text-sm font-bold placeholder-black/30"
                                        value={inquiryForm.email}
                                        onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-black uppercase tracking-widest mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-gray-50 border border-black/80 p-3 focus:ring-0 text-sm font-bold placeholder-black/30"
                                        value={inquiryForm.phone}
                                        onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-black uppercase tracking-widest mb-1">Message</label>
                                <textarea
                                    required rows="4"
                                    className="w-full bg-gray-50 border border-black/80 p-3 focus:ring-0 text-sm font-bold placeholder-black/30"
                                    value={inquiryForm.message}
                                    onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button
                                type="submit" disabled={submittingInquiry}
                                className="w-full py-4 bg-amber-600 text-white font-black uppercase tracking-widest hover:bg-teal-700 transition shadow-lg disabled:opacity-50"
                            >
                                {submittingInquiry ? 'Sending...' : 'Send Inquiry'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Premium Header */}
            <div className="bg-white pt-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/properties" className="flex items-center gap-1 text-xs font-black text-black uppercase tracking-widest hover:text-amber-600 transition">
                            <HiOutlineArrowNarrowRight className="h-5 w-5 rotate-180" />
                            <span>Back to properties</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <div className="flex gap-3 mb-4">
                                <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest ${property.status === 'for_sale' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                                    {property.status === 'for_sale' ? 'For Sale' : 'For Rent'}
                                </span>
                                <span className="px-4 py-1.5 bg-gray-100 text-black text-xs font-black uppercase tracking-widest">
                                    {property.type}
                                </span>
                            </div>
                            <h1 className="text-4xl font-black text-black uppercase tracking-widest mb-4">{property.title}</h1>
                            <div className="flex items-center text-gray-600 mb-8">
                                <HiLocationMarker className="h-5 w-5 mr-2 text-amber-600" />
                                <span className="text-lg font-medium">{property.address}</span>
                            </div>

                            {/* Main Image Gallery */}
                            <div className="space-y-6">
                                <div className="aspect-[16/9] bg-gray-200 relative overflow-hidden group">
                                    <SafeImage
                                        src={images[activeImage]}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`flex-shrink-0 w-32 h-20 border-2 transition-all ${activeImage === idx ? 'border-amber-600 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <SafeImage src={img} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="py-12 border-t border-gray-100 mt-12">
                                <h2 className="text-2xl font-black text-black uppercase tracking-widest mb-6">Property Description</h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                    {property.description}
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-y border-gray-100">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bedrooms</p>
                                    <div className="flex items-center gap-2">
                                        <BiBed className="h-5 w-5 text-amber-600" />
                                        <span className="font-black text-lg">{property.bedrooms}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bathrooms</p>
                                    <div className="flex items-center gap-2">
                                        <BiBath className="h-5 w-5 text-amber-600" />
                                        <span className="font-black text-lg">{property.bathrooms}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Area Size</p>
                                    <div className="flex items-center gap-2">
                                        <BiArea className="h-5 w-5 text-amber-600" />
                                        <span className="font-black text-lg">{property.size} sqft</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Type</p>
                                    <div className="flex items-center gap-2">
                                        <BiBuildingHouse className="h-5 w-5 text-amber-600" />
                                        <span className="font-black text-lg uppercase">{property.type}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="py-12 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black text-black uppercase tracking-widest flex items-center gap-2">
                                        <BiMessageRoundedDots className="h-6 w-6 text-amber-600" />
                                        Property Reviews
                                    </h2>
                                    <span className="text-gray-400 font-bold">{property.reviews?.length || 0} reviews</span>
                                </div>

                                <div className="grid grid-cols-1 gap-8 mb-12">
                                    {property.reviews?.length > 0 ? (
                                        property.reviews.map((review) => (
                                            <div key={review.id} className="bg-white p-8 border border-dashed border-black/30">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 bg-amber-600 flex items-center justify-center text-white font-black text-xl">
                                                            {review.user?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-black uppercase tracking-widest text-sm">{review.user?.name}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold">{review.created_at}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex text-amber-500">
                                                        {[...Array(5)].map((_, i) => (
                                                            <HiStar key={i} className={`h-5 w-5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 italic">"{review.comment}"</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 font-medium italic">No reviews yet for this property.</p>
                                    )}
                                </div>

                                {/* Review Form */}
                                <div className="bg-gray-900 p-8 text-white">
                                    <h3 className="text-lg font-black uppercase tracking-widest mb-6">Write a Review</h3>
                                    {reviewSuccess ? (
                                        <div className="bg-green-500/10 border border-green-500/30 p-6 text-center">
                                            <BiCheck className="h-10 w-10 text-green-400 mx-auto mb-2" />
                                            <p className="font-black uppercase tracking-widest text-sm">Review Submitted Successfully!</p>
                                            <button onClick={() => setReviewSuccess(false)} className="mt-4 text-xs font-bold text-amber-500 hover:text-amber-400 underline uppercase tracking-widest">
                                                Write another one
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">Rating</label>
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
                                            <div>
                                                <label className="block text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">Your Experience</label>
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
                                                className="px-10 py-4 bg-amber-600 text-white font-black uppercase tracking-widest hover:bg-white hover:text-teal-700 transition shadow-lg disabled:opacity-50"
                                            >
                                                {submittingReview ? 'Submitting...' : 'Post Review'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            <div className="bg-white p-8 border border-black/10 shadow-lg">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Asking Price</p>
                                <div className="text-4xl font-black text-amber-600 tracking-tight">
                                    ${property.price.toLocaleString()}
                                </div>
                                <button
                                    onClick={() => setIsInquiryModalOpen(true)}
                                    className="w-full mt-6 py-4 bg-teal-700 text-white font-black uppercase tracking-widest hover:bg-amber-600 transition shadow-lg"
                                >
                                    Make an Inquiry
                                </button>
                            </div>

                            <div className="bg-teal-700 p-8 text-white shadow-xl relative overflow-hidden group">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-16 w-16 bg-white flex items-center justify-center text-teal-700 font-black text-2xl">
                                            {property.agent?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Listing Agent</p>
                                            <h3 className="text-xl font-black uppercase tracking-widest">{property.agent?.name}</h3>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium mb-8 text-white/80 leading-relaxed">
                                        Expert in {property.type} properties with over 10 years of experience in the {property.location?.name} area.
                                    </p>
                                    <Link
                                        to={`/agents/${property.agent?.id}`}
                                        className="w-full block py-4 bg-white text-teal-700 text-center font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition"
                                    >
                                        Agent Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Properties */}
                    {similarProperties.length > 0 && (
                        <div className="py-24 border-t border-gray-100 mt-12">
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-3xl font-black text-black uppercase tracking-widest">Similar Properties</h2>
                                <Link to="/properties" className="px-8 py-3 bg-teal-700 text-white text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition shadow-lg">View All</Link>
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
