import { useEffect, useMemo, useState } from 'react';
import propertyService from '../services/propertyService';
import propertyManagementService from '../services/propertyManagementService';

const statusClass = {
    pending: 'bg-amber-100 text-amber-700',
    under_review: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-200 text-gray-700',
};

const ManagementRequests = () => {
    const [properties, setProperties] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        property_id: '',
        title: '',
        address: '',
        property_type: 'house',
        management_scope: 'full_management',
        notes: '',
    });

    const showManualFields = !form.property_id;

    const fetchData = async () => {
        setLoading(true);
        try {
            const [myPropsRes, requestsRes] = await Promise.all([
                propertyService.getMyProperties(),
                propertyManagementService.getMyRequests(),
            ]);

            setProperties(myPropsRes.data?.data || myPropsRes.data || []);
            setRequests(requestsRes.data?.data || []);
        } catch (error) {
            console.error('Failed to load management requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const selectedProperty = useMemo(
        () => properties.find((p) => String(p.id) === String(form.property_id)),
        [properties, form.property_id]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                property_id: form.property_id || null,
                management_scope: form.management_scope,
                notes: form.notes || null,
            };

            if (!form.property_id) {
                payload.title = form.title;
                payload.address = form.address;
                payload.property_type = form.property_type;
            }

            await propertyManagementService.createRequest(payload);
            setForm({
                property_id: '',
                title: '',
                address: '',
                property_type: 'house',
                management_scope: 'full_management',
                notes: '',
            });
            await fetchData();
        } catch (error) {
            alert(error?.response?.data?.message || 'Failed to submit management request.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this management request?')) return;
        try {
            await propertyManagementService.cancelRequest(id);
            await fetchData();
        } catch (error) {
            alert(error?.response?.data?.message || 'Failed to cancel request.');
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Property Management</h1>
                <p className="px-6 py-3 border border-black/10 bg-green-600 text-xs w-fit text-start font-black uppercase tracking-widest text-green-600 shadow-lg">
                    Submit properties for professional management and track approvals.
                </p>
            </div>

            <div className="bg-green-100/50 relative border border-dashed border-black/30 p-6">
                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                <h2 className="text-sm font-black text-green-600 text-start uppercase tracking-widest mb-4">New Management Request</h2>
                <form onSubmit={handleSubmit} className="space-y-4 z-10 relative">
                    <div>
                        <label className="block text-xs font-black text-start text-black uppercase tracking-widest mb-1">Select Existing Property (Optional)</label>
                        <select
                            value={form.property_id}
                            onChange={(e) => setForm((prev) => ({ ...prev, property_id: e.target.value }))}
                            className="w-full bg-gray-50 border border-black/30 p-2 text-sm font-bold"
                        >
                            <option value="">Use custom property details</option>
                            {properties.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedProperty && (
                        <div className="p-3 bg-gray-50 border border-black/10 text-sm">
                            <p className="font-black">{selectedProperty.title}</p>
                            <p className="text-gray-600">{selectedProperty.address}</p>
                        </div>
                    )}

                    {showManualFields && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-start text-black uppercase tracking-widest mb-1">Property Title</label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-gray-50 border border-black/30 p-2 text-sm text-black/70 font-bold"
                                    placeholder="Property title"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-start text-black uppercase tracking-widest mb-1">Property Type</label>
                                <select
                                    value={form.property_type}
                                    onChange={(e) => setForm((prev) => ({ ...prev, property_type: e.target.value }))}
                                    className="w-full bg-gray-50 border border-black/30 p-2 text-sm text-black/70 font-bold"
                                >
                                    <option value="house">House</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="land">Land</option>
                                </select>
                            </div>

                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-black text-start text-black uppercase tracking-widest mb-1">Additional Notes</label>
                        <textarea
                            rows="4"
                            value={form.notes}
                            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                            className="w-full bg-gray-50 border border-black/30 p-2 text-sm text-black/70 font-bold"
                            placeholder="Anything we should know about this property?"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="">
                            <label className="block text-xs font-black text-start text-black uppercase tracking-widest mb-1">Property Address</label>
                            <input
                                type="text"
                                required
                                value={form.address}
                                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                                className="w-full bg-gray-50 border border-black/30 p-2 text-sm text-black/70 font-bold"
                                placeholder="Property address"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-start text-black uppercase tracking-widest mb-1">Management Scope</label>
                            <select
                                value={form.management_scope}
                                onChange={(e) => setForm((prev) => ({ ...prev, management_scope: e.target.value }))}
                                className="w-full bg-gray-50 border border-black/30 p-2 text-sm text-black/70 font-bold"
                            >
                                <option value="full_management">Full management</option>
                                <option value="tenant_management">Tenant management</option>
                                <option value="rent_collection">Rent collection only</option>
                                <option value="maintenance_only">Maintenance only</option>
                            </select>
                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="self-end px-6 py-3 bg-indigo-600 flex justify-start text-white text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>

            <div className="bg-white border border-black/30 p-6">
                <h2 className="text-sm font-black uppercase tracking-widest mb-4">My Requests</h2>
                {loading ? (
                    <p className="text-gray-500">Loading requests...</p>
                ) : requests.length === 0 ? (
                    <p className="text-gray-500 italic">No management requests yet.</p>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div key={req.id} className="border border-black/10 p-4 bg-gray-50">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                    <div>
                                        <h3 className="font-black text-black">{req.title}</h3>
                                        <p className="text-sm text-gray-600">{req.address}</p>
                                        <p className="text-[11px] font-black uppercase tracking-widest text-indigo-600 mt-2">{req.management_scope?.replace('_', ' ')}</p>
                                        {req.notes && <p className="text-sm text-gray-700 mt-2">{req.notes}</p>}
                                        {req.admin_notes && <p className="text-sm text-red-600 mt-2"><strong>Admin notes:</strong> {req.admin_notes}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${statusClass[req.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {req.status?.replace('_', ' ')}
                                        </span>
                                        {(req.status === 'pending' || req.status === 'under_review') && (
                                            <button
                                                type="button"
                                                onClick={() => handleCancel(req.id)}
                                                className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagementRequests;
