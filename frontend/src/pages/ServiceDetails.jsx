import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { HiCheckCircle, HiOutlineUserGroup, HiPhone, HiMail, HiArrowLeft } from 'react-icons/hi';
import SafeImage from '../components/SafeImage';
import serviceService from '../services/serviceService';
import { useAuth } from '../context/AuthContext';

const ServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({ phone: '', notes: '' });

    useEffect(() => {
        const fetchService = async () => {
            setLoading(true);
            try {
                const res = await serviceService.getById(id);
                setService(res.data);
            } catch (err) {
                console.error('Failed to load service:', err);
                setService(null);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const handleRequireService = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        setSubmitting(true);
        setMessage('');
        try {
            const res = await serviceService.requireService(id, form);
            setMessage(res.data?.message || 'Service request submitted successfully.');
            setForm({ phone: '', notes: '' });
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to submit service request.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="p-10 text-center">
                <p className="text-sm font-black uppercase tracking-widest text-gray-500">Service not found.</p>
                <Link to="/about" className="inline-block mt-4 px-5 py-2 bg-gray-900 text-white text-xs font-black uppercase tracking-widest">
                    Back to About
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-10 py-6">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 relative z-10 border border-black/20 bg-green-600 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2"
            >
                <img src="/bg-img.png" className="absolute inset-0 h-full w-full object-cover opacity-20" alt="" />
                <HiArrowLeft className="h-4 w-4" />
                Back
            </button>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-[400px] border border-black/20 overflow-hidden">
                    <SafeImage src={service.image_url || service.image_path} alt={service.name} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-4 flex flex-col justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-600">Service</p>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">{service.name}</h1>
                    <p className="text-sm text-gray-700 leading-relaxed">{service.description}</p>

                    <section className="bg-green-600 border border-black/20 relative p-6">
                        <img src="/bg-img.png" className="absolute inset-0 h-full w-full object-cover opacity-20" alt="" />
                        <div className="relative z-10">
                            <h2 className="text-xs font-black uppercase tracking-widest text-start text-white mb-2">Aligned Agents</h2>
                            <p className='text-black text-start mb-3'>
                                Talk to an expert about your needs
                            </p>
                            {(service.agents || []).length === 0 ? (
                                <p className="text-sm font-bold text-white/80">No agents assigned yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {service.agents.map((agent) => (
                                        <Link key={agent.id} to={`/agents/${agent.id}`} className="p-4 border border-black/20 bg-gray-900 hover:bg-gray-800 transition">
                                            <p className="text-sm font-black text-start text-green-600">{agent.name}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white text-start">{agent.specialization || 'Agent'}</p>
                                            <div className="mt-2 space-y-1">
                                                <p className="text-xs text-white/70 flex items-center gap-1"><HiMail className="h-4 w-4" />{agent.email}</p>
                                                <p className="text-xs text-white/70 flex items-center gap-1"><HiPhone className="h-4 w-4" />{agent.phone || 'No phone'}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </section>



            <section className="bg-gray-900 relative text-white border border-black/20 p-6">
                <img src="/bg-img.png" className="absolute inset-0 h-full w-full object-cover opacity-20" alt="" />
                <h2 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center justify-start gap-2">
                    <HiOutlineUserGroup className="h-4 w-4" />
                    Require This Service
                </h2>
                <form onSubmit={handleRequireService} className="space-y-4 z-10 relative">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-black text-start mb-1">Phone (optional)</label>
                        <input
                            type="text"
                            value={form.phone}
                            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                            className="w-full border border-white/20 bg-white/5 p-3 text-sm text-white focus:outline-none"
                            placeholder="Your phone number"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-black text-start mb-1">Notes (optional)</label>
                        <textarea
                            rows={4}
                            value={form.notes}
                            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                            className="w-full border border-white/20 bg-white/5 p-3 text-sm text-white focus:outline-none"
                            placeholder="Tell us what you need..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-3 relative flex justify-start z-10 border border-black/30 bg-green-600 text-xs text-start font-black uppercase tracking-widest hover:bg-cyan-500 disabled:opacity-60"
                    >
                         <img src="/bg-img.png" className="absolute inset-0 h-full w-full object-cover opacity-20" alt="" />
                        {submitting ? 'Submitting...' : 'Require Service'}
                    </button>
                </form>
                {message && (
                    <p className="mt-4 text-sm font-bold text-cyan-200 flex items-center gap-2">
                        <HiCheckCircle className="h-5 w-5" />
                        {message}
                    </p>
                )}
            </section>
        </div>
    );
};

export default ServiceDetails;
