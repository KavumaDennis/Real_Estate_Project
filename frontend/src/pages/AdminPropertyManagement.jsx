import { useEffect, useState } from 'react';
import propertyManagementService from '../services/propertyManagementService';
import { FaLocationDot } from "react-icons/fa6";

const statuses = ['pending', 'under_review', 'approved', 'rejected', 'cancelled'];

const badge = {
    pending: 'bg-amber-100 text-amber-700',
    under_review: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-200 text-gray-700',
};

const AdminPropertyManagement = () => {
    const [requests, setRequests] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [edits, setEdits] = useState({});

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await propertyManagementService.getAdminRequests({
                status: statusFilter || undefined,
                search: search || undefined,
            });
            const rows = res.data?.data || [];
            setRequests(rows);

            const seed = {};
            rows.forEach((r) => {
                seed[r.id] = { status: r.status, admin_notes: r.admin_notes || '' };
            });
            setEdits(seed);
        } catch (error) {
            console.error('Failed to fetch admin management requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const handleUpdate = async (id) => {
        setUpdatingId(id);
        try {
            await propertyManagementService.updateStatus(id, edits[id]);
            await fetchRequests();
        } catch (error) {
            alert(error?.response?.data?.message || 'Failed to update request.');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Property Management Requests</h1>
                <p className="px-6 py-3 w-fit relative border border-black/20 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-white shadow-lg">
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    Review and approve submitted property management applications.
                </p>
            </div>

            <div className="bg-gray-900 relative border border-black/30 p-4 flex flex-col md:flex-row gap-3">
                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title, address, owner..."
                    className="flex-1 bg-gray-50 border border-black/30 p-2 text-sm font-bold z-10 relative"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-50 border border-black/30 p-2 text-sm font-bold z-10 relative"
                >
                    <option value="">All statuses</option>
                    {statuses.map((s) => (
                        <option key={s} value={s}>
                            {s.replace('_', ' ')}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={fetchRequests}
                    className="px-6 py-2 bg-green-600 relative z-10 border border-black/30 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition"
                >
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    Apply
                </button>
            </div>

            <div className="bg-green-600 relative border border-black/20 p-4">
                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                {loading ? (
                    <p className="text-gray-500">Loading requests...</p>
                ) : requests.length === 0 ? (
                    <p className="text-gray-500 italic">No requests found.</p>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div key={req.id} className="border border-black/10 p-4 bg-gray-900 relative">
                                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 z-10 relative">
                                    <div className="space-y-1">
                                        <h3 className="font-black text-indigo-100 text-start">{req.title}</h3>
                                        <p className="text-sm text-green-600 font-black flex items-center gap-2">
                                            <FaLocationDot />
                                            {req.address}</p>
                                        <p className="text-xs font-bold text-indigo-100 pb-2">
                                            Owner: {req.owner_name} ({req.owner_email}{req.owner_phone ? `, ${req.owner_phone}` : ''})
                                        </p>
                                        <p className="text-xs font-bold text-green-600 pt-3 border-t border-white text-start uppercase tracking-widest">{req.management_scope?.replace('_', ' ')}</p>
                                        {req.notes && <p className="text-sm text-green-600 text-start">{req.notes}</p>}
                                    </div>

                                    <div className="w-full lg:w-90 space-y-2">
                                        <span className={`flex justify-start w-fit px-3 py-1 text-[10px] font-black uppercase tracking-widest ${badge[req.status] || 'bg-gray-100 text-gray-700'}`}>
                                            Current: {req.status?.replace('_', ' ')}
                                        </span>
                                        <select
                                            value={edits[req.id]?.status || req.status}
                                            onChange={(e) =>
                                                setEdits((prev) => ({
                                                    ...prev,
                                                    [req.id]: { ...(prev[req.id] || {}), status: e.target.value },
                                                }))
                                            }
                                            className="w-full bg-gray-50 border border-black/30 p-2 text-sm text-black/70 font-bold"
                                        >
                                            {['pending', 'under_review', 'approved', 'rejected'].map((s) => (
                                                <option key={s} value={s}>
                                                    {s.replace('_', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                        <textarea
                                            rows="3"
                                            value={edits[req.id]?.admin_notes || ''}
                                            onChange={(e) =>
                                                setEdits((prev) => ({
                                                    ...prev,
                                                    [req.id]: { ...(prev[req.id] || {}), admin_notes: e.target.value },
                                                }))
                                            }
                                            className="w-full bg-gray-50 border border-black/30 p-2 text-sm text-black/70 font-bold"
                                            placeholder="Admin notes..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleUpdate(req.id)}
                                            disabled={updatingId === req.id}
                                            className="px-6 py-2 bg-green-600 z-10 relative flex justify-start text-white text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition disabled:opacity-50"
                                        >
                                            <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                            {updatingId === req.id ? 'Updating...' : 'Update'}
                                        </button>
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

export default AdminPropertyManagement;

