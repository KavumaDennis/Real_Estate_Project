import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiMail, HiPhone, HiStar, HiOutlineArrowNarrowRight, HiLocationMarker, HiCheckCircle } from 'react-icons/hi';
import { BiBed, BiBath, BiArea, BiBuildingHouse } from 'react-icons/bi';
import api from '../services/api';
import SafeImage from '../components/SafeImage';
import { formatUGX } from '../utils/currency';

const AgentAvatar = ({ agent }) => {
    const initials = agent.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();


    if (agent.avatar_url) {
        return <SafeImage src={agent.avatar_url} alt={agent.name} className="h-28 w-28 mt-3 border border-black/30 object-cover shadow-2xl" />;
    }
    return (
        <div className={`h-20 w-20 bg-gray-900 relative flex items-center justify-center text-white font-black text-3xl shadow-2xl mt-5`}>
            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
            {initials}
        </div>
    );
};

const AgentProfile = () => {
    const { id } = useParams();
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contactSent, setContactSent] = useState(false);
    const [contactLoading, setContactLoading] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '', email: '', phone: '', message: ''
    });

    // Review State
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);

    useEffect(() => {
        const fetchAgent = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/agents/${id}`);
                setAgent(res.data);
            } catch (err) {
                console.error('Failed to fetch agent', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAgent();
    }, [id]);

    const handleContact = async (e) => {
        e.preventDefault();
        setContactLoading(true);
        try {
            await api.post('/inquiries', {
                agent_id: id,
                ...contactForm
            });
            setContactSent(true);
            setContactForm({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            console.error('Failed to send message', err);
            alert('Failed to send message. Please try again.');
        } finally {
            setContactLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            await api.post('/reviews', {
                agent_id: id,
                ...reviewForm
            });
            setReviewSuccess(true);
            setReviewForm({ rating: 5, comment: '' });
            // Refresh agent data to show new review
            const res = await api.get(`/agents/${id}`);
            setAgent(res.data);
        } catch (err) {
            console.error('Error submitting review:', err);
            alert(err.response?.data?.message || 'Failed to submit review. You might need to be logged in.');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="relative">
                <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <BiBuildingHouse className="h-8 w-8 text-blue-600" />
                </div>
            </div>
        </div>
    );

    if (!agent) return (
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Agent Not Found</h2>
            <Link to="/agents" className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition">
                Back to Agents
            </Link>
        </div>
    );

    return (
        <div className=" min-h-screen">
            {/* Hero Banner */}
            <div className="">
                <div className="w-full py-10">
                    <Link to="/agents" className="flex items-start w-fit space-x-2 px-6 py-3 border border-black/10 bg-green-600 relative z-10 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <HiOutlineArrowNarrowRight className="h-5 w-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm uppercase tracking-widest">All Agents</span>
                    </Link>

                    <div className="flex flex-col items-start gap-5">
                        <div className="relative">
                            <AgentAvatar agent={agent} />
                        </div>

                        <div className="flex-1 w-full flex items-end justify-between">
                            <div className="">
                                <p className="text-indigo-600 font-bold text-start text-lg max-w-2xl leading-relaxed mb-5">
                                    {agent.bio}
                                </p>
                                <p className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">
                                    {agent.specialization}
                                </p>
                                <h1 className="px-6 py-3 w-fit border border-black/10 relative bg-green-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                    {agent.name}</h1>
                            </div>


                            <div className="flex flex-wrap gap-6 mt-8">
                                <div className="flex items-end space-x-3">
                                    <div className="h-11 w-11 relative bg-green-600 flex items-center justify-center">
                                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <BiBuildingHouse className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="block text-lg text-start font-black text-teal-700 uppercase tracking-widest">{agent.listings_count}</p>
                                        <p className="block text-xs text-start font-black text-black uppercase tracking-widest">Listings</p>
                                    </div>
                                </div>
                                <div className="flex items-end space-x-3">
                                    <div className="h-11 w-11 relative bg-green-600 flex items-center justify-center">
                                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <HiStar className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="block text-lg text-start font-black text-teal-700 uppercase tracking-widest">4.9 / 5</p>
                                        <p className="block text-xs text-start font-black text-black uppercase tracking-widest">Rating</p>
                                    </div>
                                </div>
                                {agent.phone && (
                                    <a href={`tel:${agent.phone}`} className="flex items-center space-x-3 relative px-6 py-3 bg-gray-900 text-white font-black hover:bg-blue-600 transition">
                                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <HiPhone className="h-5 w-5" />
                                        <span>{agent.phone}</span>
                                    </a>
                                )}
                                <a href={`mailto:${agent.email}`} className="flex items-center space-x-3 relative px-6 py-3 bg-gray-900 text-white font-black hover:bg-blue-600 hover:text-white transition">
                                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                    <HiMail className="h-5 w-5" />
                                    <span>{agent.email}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-1 space-y-16">

                        {/* Active Listings */}
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center space-x-4">
                                    <h2 className="block text-xl text-start font-black text-black uppercase tracking-widest ">Active Listings</h2>
                                </div>
                                <span className="text-indigo-600 font-bold">{agent.listings_count} total</span>
                            </div>

                            {agent.properties?.length === 0 ? (
                                <div className="bg-green-100/50 relative p-16 text-center border border-dashed border-black/50">
                                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                    <BiBuildingHouse className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                    <p className="text-black font-bold">No active listings at the moment.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {agent.properties?.map(prop => (
                                        <Link
                                            key={prop.id}
                                            to={`/properties/${prop.slug}`}
                                            className="bg-white overflow-hidden border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                        >
                                            <div className="relative h-40 overflow-hidden">
                                                <SafeImage
                                                    src={prop.images?.[0]}
                                                    alt={prop.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                                />
                                                <div className="absolute top-2 left-2 flex gap-2">
                                                    <span className={`px-3 py-1 relative text-xs font-black uppercase text-white ${prop.status === 'for_sale' ? 'bg-gray-900' : 'bg-green-600'}`}>
                                                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                        {prop.status === 'for_sale' ? 'For Sale' : 'For Rent'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <p className="text-xs font-black text-end text-gray-900 uppercase tracking-widest mb-2">{prop.type}</p>
                                                <h3 className="text-sm font-black uppercase tracking-widest text-start text-green-600 mb-2 line-clamp-1 group-hover:text-blue-600 transition">{prop.title}</h3>
                                              
                                                <div className="flex items-center justify-between p-3 bg-gray-900 relative">
                                                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                    <p className="font-black text-green-600">{formatUGX(prop.price)}</p>
                                                     {prop.location && (
                                                    <div className="flex items-center text-gray-400 text-sm">
                                                        <HiLocationMarker className="h-4 w-4 mr-1 text-blue-600" />
                                                        {prop.location}
                                                    </div>
                                                )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Reviews Section */}
                        <div>
                            <div className="flex items-center space-x-4 mb-5">
                                <h2 className="block text-xl text-start font-black text-black uppercase tracking-widest">Client Reviews</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {agent.reviews?.length === 0 ? (
                                    <div className="bg-green-200/50 relative p-12 text-center border border-dashed border-black/50">
                                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <p className="text-black font-bold">No reviews yet for this agent.</p>
                                    </div>
                                ) : (
                                    agent.reviews?.map((review, i) => (
                                        <div key={i} className="bg-green-100/50 relative p-8 border border-dashed border-black/50 shadow-sm">
                                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg">
                                                        {review.user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">{review.user?.name || review.name || 'Anonymous'}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{review.date || new Date(review.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    {Array.from({ length: 5 }).map((_, j) => (
                                                        <HiStar key={j} className={`h-5 w-5 ${j < review.rating ? 'text-yellow-400' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-500 text-start leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Review Form */}
                            <div className="mt-12">
                                <h3 className="text-xl font-black text-start text-black uppercase tracking-widest mb-6">Leave a Review</h3>
                                {reviewSuccess ? (
                                    <div className="bg-green-100 relative z-10 border border-green-200 p-8 text-center rounded-3xl">
                                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <HiCheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
                                        <p className="font-black text-lg text-green-800">Review Submitted!</p>
                                        <p className="text-green-600">Your feedback has been posted successfully.</p>
                                        <button onClick={() => setReviewSuccess(false)} className="mt-6 text-blue-600 font-bold hover:underline">
                                            Write another review
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-green-600 relative p-8 border border-dashed border-black/50 shadow-sm">
                                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                        <form onSubmit={handleReviewSubmit} className="space-y-6 z-10 relative">
                                            <div>
                                                <label className="block text-xs font-black text-start text-black uppercase tracking-widest mb-3">Rating</label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <button
                                                            key={star} type="button"
                                                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                            className={`p-1 transition-colors ${reviewForm.rating >= star ? 'text-yellow-300' : 'text-gray-200'}`}
                                                        >
                                                            <HiStar className="h-8 w-8 fill-current" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-start text-black uppercase tracking-widest mb-3">Your Experience</label>
                                                <textarea
                                                    required rows="4"
                                                    className="w-full bg-gray-50 border border-black/80 p-4 focus:ring-0 text-sm font-bold placeholder-black/30"
                                                    value={reviewForm.comment}
                                                    onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                    placeholder="Tell others about your experience with this agent..."
                                                ></textarea>
                                            </div>
                                            <button
                                                type="submit" disabled={submittingReview}
                                                className="px-10 py-3 bg-gray-900 border border-black/30 text-xs flex items-start relative z-10 text-white font-black uppercase tracking-widest hover:bg-blue-600 transition shadow-lg disabled:opacity-50"
                                            >
                                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                {submittingReview ? 'Posting...' : 'Post Review'}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar – Contact Form */}
                    <div>
                        <div className="bg-gray-900 p-10 sticky top-24 text-white relative overflow-hidden">
                            <div className="absolute -right-16 -top-16 h-48 w-48 bg-blue-600/20 rounded-full blur-3xl" />
                            <div className="absolute -left-16 -bottom-16 h-48 w-48 bg-violet-600/10 rounded-full blur-3xl" />

                            <div className="relative z-10">
                                <h3 className="block text-lg text-start font-black text-green-600 uppercase tracking-widest mb-2">Contact {agent.name.split(' ')[0]}</h3>
                                <p className="text-gray-400 text-start text-sm mb-8 font-medium">Send a message and get a response within 24 hours.</p>

                                {contactSent ? (
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-3xl p-8 text-center">
                                        <HiCheckCircle className="h-14 w-14 text-green-400 mx-auto mb-4" />
                                        <p className="font-black text-lg mb-2">Message Sent!</p>
                                        <p className="text-gray-400 text-sm">{agent.name} will get back to you soon.</p>
                                        <button onClick={() => { setContactSent(false); setContactForm({ name: '', email: '', phone: '', message: '' }); }} className="mt-6 text-blue-400 text-sm font-bold hover:text-blue-300 transition">
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleContact} className="space-y-4 grid grid-cols-2">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Your Full Name"
                                                required
                                                value={contactForm.name}
                                                onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                                                className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                placeholder="Email Address"
                                                required
                                                value={contactForm.email}
                                                onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                                                className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                            />
                                        </div>
                                        <div className='col-span-2'>
                                            <input
                                                type="tel"
                                                placeholder="Phone Number (optional)"
                                                value={contactForm.phone}
                                                onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                                                className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                            />
                                        </div>
                                        <div className='col-span-2'>
                                            <textarea
                                                rows="4"
                                                placeholder="I'm interested in your properties..."
                                                required
                                                value={contactForm.message}
                                                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                                                className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={contactLoading}
                                            className="px-6 py-3 w-fit border border-black/30 relative z-10 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg disabled:opacity-50"
                                        >
                                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                            {contactLoading ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </form>
                                )}

                                <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                                    {agent.phone && (
                                        <a href={`tel:${agent.phone}`} className="flex items-center space-x-3 text-gray-300 hover:text-white transition font-medium">
                                            <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center">
                                                <HiPhone className="h-5 w-5" />
                                            </div>
                                            <span>{agent.phone}</span>
                                        </a>
                                    )}
                                    <a href={`mailto:${agent.email}`} className="flex items-center space-x-3 text-gray-300 hover:text-white transition font-medium">
                                        <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center">
                                            <HiMail className="h-5 w-5" />
                                        </div>
                                        <span className="truncate">{agent.email}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentProfile;
