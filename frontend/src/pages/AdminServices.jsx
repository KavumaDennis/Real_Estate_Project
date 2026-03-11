import { useState, useEffect } from 'react';
import api from '../services/api';
import agentService from '../services/agentService';
import {
    HiOutlineSearch, HiOutlinePlus, HiOutlinePencil,
    HiOutlineTrash, HiOutlineBriefcase, HiOutlineCheckCircle,
    HiOutlinePhotograph, HiOutlineEye
} from 'react-icons/hi';
import SafeImage from '../components/SafeImage';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState({
        name: '',
        description: '',
        image: null,
        agent_ids: []
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [requirementsModalOpen, setRequirementsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [requirements, setRequirements] = useState([]);
    const [loadingRequirements, setLoadingRequirements] = useState(false);

    useEffect(() => {
        fetchServices();
        fetchAgents();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await api.get('/admin/services');
            setServices(res.data);
        } catch (err) {
            console.error('Failed to fetch services:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAgents = async () => {
        try {
            const res = await agentService.getAll();
            setAgents(res.data.data || res.data);
        } catch (err) {
            console.error('Failed to fetch agents:', err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setErrors({});
        setSaving(true);

        const formData = new FormData();
        formData.append('name', currentService.name.trim());
        formData.append('description', currentService.description.trim());

        if (currentService.agent_ids?.length === 0) {
            setErrors({ agent_ids: 'Please select at least one key contact (agent).' });
            setSaving(false);
            return;
        }

        currentService.agent_ids.forEach(id => formData.append('agent_ids[]', id));

        if (currentService.image) {
            formData.append('image', currentService.image);
        } else if (!isEditing) {
            setErrors({ image: 'Service image is required.' });
            setSaving(false);
            return;
        }

        try {
            if (isEditing) {
                formData.append('_method', 'PUT');
                await api.post(`/admin/services/${currentService.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/admin/services', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchServices();
            closeModal();
        } catch (err) {
            const res = err.response?.data;
            if (res?.errors) {
                setErrors(res.errors);
            } else {
                setErrors({ general: res?.message || 'Failed to save service.' });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            await api.delete(`/admin/services/${id}`);
            fetchServices();
        } catch (err) {
            console.error('Error deleting service:', err);
        }
    };

    const openModal = (service = null) => {
        if (service) {
            setCurrentService({
                id: service.id,
                name: service.name,
                description: service.description,
                image: null,
                agent_ids: (service.agents || []).map(a => a.id)
            });
            setImagePreview(service.image_url || service.image_path ? (service.image_url || null) : null);
            setIsEditing(true);
        } else {
            setCurrentService({ name: '', description: '', image: null, agent_ids: [] });
            setImagePreview(null);
            setIsEditing(false);
        }
        setErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentService({ name: '', description: '', image: null, agent_ids: [] });
        setImagePreview(null);
        setErrors({});
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCurrentService(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const toggleAgent = (agentId) => {
        setCurrentService(prev => {
            const ids = prev.agent_ids || [];
            const has = ids.includes(agentId);
            return {
                ...prev,
                agent_ids: has ? ids.filter(id => id !== agentId) : [...ids, agentId]
            };
        });
    };

    const filteredServices = services.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const agentList = Array.isArray(agents) ? agents : [];

    const openRequirementsModal = async (service) => {
        setSelectedService(service);
        setRequirementsModalOpen(true);
        setLoadingRequirements(true);
        try {
            const res = await api.get('/admin/service-requirements', {
                params: { service_id: service.id }
            });
            setRequirements(res.data?.data || []);
        } catch (err) {
            console.error('Failed to load service requirements:', err);
            setRequirements([]);
        } finally {
            setLoadingRequirements(false);
        }
    };

    const handleRequirementStatus = async (requirementId, status) => {
        try {
            await api.patch(`/admin/service-requirements/${requirementId}`, { status });
            setRequirements((prev) => prev.map((r) => (r.id === requirementId ? { ...r, status } : r)));
            fetchServices();
        } catch (err) {
            console.error('Failed to update requirement status:', err);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Manage Services</h1>
                    <p className="px-4 sm:px-6 py-2 sm:py-3 border border-black/10 bg-green-600 relative text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg shrink-0">
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        Company services offered.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="w-full sm:w-auto flex items-center justify-center relative z-10 space-x-2 px-6 py-3 border border-black/10 bg-gray-900 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                >
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>New Service</span>
                </button>
            </div>

            <div className="relative">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search services by name..."
                    className="flex-grow w-full pl-10 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold placeholder-black/70"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="border border-dashed border-black/30 shadow-sm overflow-x-auto scrollbar-hide">
                {loading ? (
                    <div className="p-20 sm:p-40 flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                        <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Syncing...</p>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="p-20 sm:p-40 text-center italic text-gray-400 font-black text-[10px] uppercase tracking-widest">No services yet.</div>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[600px] relative z-10">
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <thead>
                            <tr className="bg-green-600 border-b border-black/30">
                                <th className="px-6 py-5 text-[9px] font-black text-white uppercase tracking-[0.2em]">Image</th>
                                <th className="px-6 py-5 text-[9px] font-black text-white uppercase tracking-[0.2em]">Name</th>
                                <th className="px-6 py-5 text-[9px] font-black text-white uppercase tracking-[0.2em]">Description</th>
                                <th className="px-6 py-5 text-[9px] font-black text-white uppercase tracking-[0.2em]">Key Contacts</th>
                                <th className="px-6 py-5 text-[9px] font-black text-white uppercase tracking-[0.2em]">Requests</th>
                                <th className="px-6 py-5 text-[9px] font-black text-white uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/10 z-10 relative">
                            {filteredServices.map((s) => (
                                <tr key={s.id} className="bg-green-100/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="h-14 w-20 overflow-hidden border border-black/10 bg-gray-800">
                                            {s.image_url || s.image_path ? (
                                                <SafeImage src={s.image_url || s.image_path} className="w-full h-full object-cover" alt={s.name} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <HiOutlinePhotograph className="h-6 w-6 text-black" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="font-black text-indigo-600 tracking-tight">{s.name}</p>
                                    </td>
                                    <td className="px-6 py-5 max-w-xs">
                                        <p className="text-black text-sm line-clamp-2">{s.description}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-wrap gap-1">
                                            {(s.agents || []).map(a => (
                                                <span key={a.id} className="px-2 py-0.5 bg-indigo-600/50 text-white text-[10px] font-bold border border-black/30">
                                                    {a.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest">
                                                {s.requirements_count || 0}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => openRequirementsModal(s)}
                                                className="p-2 bg-gray-900 text-white border border-black/20 hover:bg-blue-600 transition"
                                                title="View requests"
                                            >
                                                <HiOutlineEye className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => openModal(s)}
                                                className="p-2.5 bg-amber-600 relative z-10 text-white hover:bg-white hover:text-amber-600 transition shadow-sm border border-black/10"
                                            >
                                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                <HiOutlinePencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s.id)}
                                                className="p-2.5 bg-rose-600 relative z-10 text-white hover:bg-white hover:text-rose-600 transition shadow-sm border border-black/10"
                                            >
                                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                <HiOutlineTrash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-green-900 relative border border-black/30 w-full max-w-xl p-6 sm:p-10 shadow-2xl overflow-y-auto h-150 duration-300">
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <div className="mb-8">
                            <h2 className=" font-black text-white uppercase tracking-tight">{isEditing ? 'Edit Service' : 'New Service'}</h2>
                            <p className="text-white/50 text-xs font-black uppercase tracking-widest mt-2">All fields are required.</p>
                        </div>

                        {errors.general && (
                            <div className="mb-4 p-3 bg-red-600/30 border border-red-500/50 text-red-200 text-sm">{errors.general}</div>
                        )}

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-1 flex flex-col justify-start">
                                <label className="text-[10px] font-black text-black text-start uppercase tracking-widest">Service Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border border-black/80 p-2 text-sm font-bold text-black/70 focus:ring-0"
                                    placeholder="e.g. Property Valuation"
                                    value={currentService.name}
                                    onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
                                />
                                {errors.name && <p className="text-red-400 text-xs">{errors.name[0]}</p>}
                            </div>

                            <div className="space-y-1 flex flex-col justify-start">
                                <label className="text-[10px] font-black text-black text-start uppercase tracking-widest">Description *</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full bg-white border border-black/80 p-3 text-sm font-bold text-black/70 focus:ring-0"
                                    placeholder="Describe this service..."
                                    value={currentService.description}
                                    onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                                />
                                {errors.description && <p className="text-red-400 text-xs">{errors.description[0]}</p>}
                            </div>

                            <div className="space-y-1 flex flex-col justify-start">
                                <label className="text-[10px] font-black text-black text-start uppercase tracking-widest">Service Image * {isEditing && '(leave empty to keep current)'}</label>
                                <div className="flex items-center gap-4">
                                    <div className="h-24 w-32 border border-black/30 bg-gray-800 overflow-hidden shrink-0">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <HiOutlinePhotograph className="h-8 w-8 text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg"
                                        onChange={handleImageChange}
                                        className="text-white/80 text-sm"
                                    />
                                </div>
                                {errors.image && <p className="text-red-400 text-xs">{errors.image[0]}</p>}
                            </div>

                            <div className="space-y-1 flex flex-col justify-start">
                                <label className="text-[10px] font-black text-black text-start uppercase tracking-widest">Key Contacts (Agents) *</label>
                                <p className="text-white/60 text-xs">Select agents from the list below.</p>
                                <div className="max-h-40 overflow-y-auto border border-black/30 p-3 space-y-2 bg-black/10">
                                    {agentList.length === 0 ? (
                                        <p className="text-white/50 text-sm">No agents available. Verify agents in Users first.</p>
                                    ) : (
                                        agentList.map(agent => (
                                            <label key={agent.id} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2">
                                                <input
                                                    type="checkbox"
                                                    checked={(currentService.agent_ids || []).includes(agent.id)}
                                                    onChange={() => toggleAgent(agent.id)}
                                                />
                                                <span className="text-white text-sm font-bold">{agent.name}</span>
                                                {agent.specialization && (
                                                    <span className="text-white/60 text-xs">({agent.specialization})</span>
                                                )}
                                            </label>
                                        ))
                                    )}
                                </div>
                                {errors.agent_ids && <p className="text-red-400 text-xs">{errors.agent_ids[0]}</p>}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-4 bg-white text-black relative z-10 font-black uppercase tracking-widest text-xs hover:bg-white/20 transition"
                                >
                                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-4 bg-gray-900 relative z-10 text-white font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition shadow-xl disabled:opacity-50"
                                >
                                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                    {saving ? 'Saving...' : (isEditing ? 'Save' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {requirementsModalOpen && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white border border-black/30 w-full max-w-4xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-lg font-black uppercase tracking-widest text-gray-900">Service Requests</h2>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-500">{selectedService?.name}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setRequirementsModalOpen(false)}
                                className="px-4 py-2 bg-gray-900 text-white text-xs font-black uppercase tracking-widest"
                            >
                                Close
                            </button>
                        </div>

                        {loadingRequirements ? (
                            <div className="p-10 text-center text-sm font-bold text-gray-500">Loading requests...</div>
                        ) : requirements.length === 0 ? (
                            <div className="p-10 text-center text-sm font-bold text-gray-500">No requests for this service yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[700px] border border-black/10">
                                    <thead className="bg-green-600 text-white">
                                        <tr>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Requester</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Contact</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Notes</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Date</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/10">
                                        {requirements.map((req) => (
                                            <tr key={req.id}>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-black text-gray-900">{req.user?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] font-bold text-gray-500">{req.user?.email || 'N/A'}</p>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-700">
                                                    {req.phone || req.user?.phone || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-700 max-w-xs">
                                                    <p className="line-clamp-2">{req.notes || 'No notes'}</p>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-700">
                                                    {new Date(req.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        className="border border-black/20 p-2 text-xs font-black uppercase tracking-widest"
                                                        value={req.status}
                                                        onChange={(e) => handleRequirementStatus(req.id, e.target.value)}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="in_progress">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminServices;
