import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiPlus, HiPencil, HiTrash, HiChevronRight, HiX, HiPhotograph, HiCheck, HiExclamation, HiStar, HiOutlineStar } from 'react-icons/hi';
import { BiBuildingHouse } from 'react-icons/bi';
import { useAuth } from '../context/AuthContext';
import propertyService from '../services/propertyService';
import api from '../services/api';
import SafeImage from '../components/SafeImage';

const FALLBACK = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80';

const StatusBadge = ({ status, availability }) => {
    const isForSale = status === 'for_sale';
    return (
        <div className="flex flex-col gap-1">
            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest w-fit ${isForSale ? 'bg-blue-100 text-blue-700' : 'bg-green-100 border border-black/20 text-green-700'}`}>
                {isForSale ? 'For Sale' : 'For Rent'}
            </span>
            {availability && (
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest w-fit ${availability === 'available' ? 'bg-blue-50 border border-black/20 text-blue-500' :
                    availability === 'sold' ? 'bg-red-50 text-red-500' :
                        'bg-orange-50 text-orange-500'
                    }`}>
                    {availability.replace('_', ' ')}
                </span>
            )}
        </div>
    );
};

// ── Edit Modal ──────────────────────────────────────────────
const EditModal = ({ property, locations, onClose, onSaved }) => {
    const [form, setForm] = useState({
        title: property.title || '',
        description: property.description || '',
        type: property.type || 'house',
        status: property.status || 'for_sale',
        price: property.price || '',
        address: property.address || '',
        location_id: property.location?.id || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        size: property.size || '',
        virtual_tour_url: property.virtual_tour_url || '',
        availability: property.availability || 'available',
        is_published: property.is_published ?? true,
        is_featured: property.is_featured ?? false,
    });
    const [newImages, setNewImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(files);
        setImagePreviews(files.map(f => URL.createObjectURL(f)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            newImages.forEach(img => fd.append('images[]', img));
            await propertyService.update(property.id, fd);
            onSaved();
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed. Please check your inputs.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-green-600 border border-black/30 w-full max-w-2xl relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                <div className="flex items-center justify-between p-4 px-8 border-b">
                    <h2 className="text-2xl font-black text-white">Edit Property</h2>
                    <button onClick={onClose} className="h-10 w-10 bg-indigo-600 border border-black/10 flex items-center justify-center hover:bg-gray-200 transition">
                        <HiX className="h-5 w-5" />
                    </button>
                </div>

                {error && (
                    <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3 text-red-700">
                        <HiExclamation className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="col-span-1 sm:col-span-2">
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Title</label>
                            <input className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Type</label>
                            <select className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                <option value="house">House</option>
                                <option value="apartment">Apartment</option>
                                <option value="commercial">Commercial</option>
                                <option value="land">Land</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Status</label>
                            <select className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                <option value="for_sale">For Sale</option>
                                <option value="for_rent">For Rent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Price ($)</label>
                            <input type="number" className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Location</label>
                            <select className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.location_id} onChange={e => setForm({ ...form, location_id: e.target.value })}>
                                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Address</label>
                            <input className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Bedrooms</label>
                            <input type="number" className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Bathrooms</label>
                            <input type="number" className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} />
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Description</label>
                            <textarea rows="3" className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                        </div>
                        <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Virtual Tour URL</label>
                                <input className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.virtual_tour_url} onChange={e => setForm({ ...form, virtual_tour_url: e.target.value })} placeholder="URL link" />
                            </div>
                            <div>
                                <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Availability</label>
                                <select className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })}>
                                    <option value="available">Available</option>
                                    <option value="sold">Sold</option>
                                    <option value="reserved">Reserved</option>
                                    <option value="off_market">Off Market</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Images</label>
                            <label className="flex items-center space-x-3 border-2 border-dashed border-gray-200 rounded-2xl p-4 cursor-pointer hover:border-blue-400 transition">
                                <HiPhotograph className="h-6 w-6 text-gray-300 shrink-0" />
                                <span className="text-gray-400 font-medium text-sm truncate">Upload images</span>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                            {imagePreviews.length > 0 && (
                                <div className="flex gap-2 mt-3 flex-wrap">
                                    {imagePreviews.map((src, i) => (
                                        <SafeImage key={i} src={src} className="h-16 w-16 rounded-xl object-cover border border-black/10" alt="" />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <div onClick={() => setForm({ ...form, is_published: !form.is_published })} className={`h-6 w-11 rounded-full transition ${form.is_published ? 'bg-blue-600' : 'bg-gray-200'} relative`}>
                                    <div className={`h-5 w-5 bg-white rounded-full absolute top-0.5 transition-all ${form.is_published ? 'left-5' : 'left-0.5'}`} />
                                </div>
                                <span className="text-sm font-bold text-black">Published</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <div onClick={() => setForm({ ...form, is_featured: !form.is_featured })} className={`h-6 w-11 rounded-full transition ${form.is_featured ? 'bg-orange-500' : 'bg-gray-200'} relative`}>
                                    <div className={`h-5 w-5 bg-white rounded-full absolute top-0.5 transition-all ${form.is_featured ? 'left-5' : 'left-0.5'}`} />
                                </div>
                                <span className="text-sm font-bold text-black">Featured</span>
                            </label>
                        </div>
                    </div>
                </form>

                <div className="p-8 pt-3 flex gap-3">
                    <button onClick={onClose} className="flex-1 px-6 py-3 bg-white/70 border border-black/60 text-xs text-center font-black uppercase tracking-widest text-black hover:bg-blue-600 transition shadow-lg">Cancel</button>
                    <button onClick={handleSubmit} disabled={saving} className="flex-1 px-6 py-3 border border-black/30 bg-indigo-600 text-xs text-center font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Delete Confirm Modal ─────────────────────────────────────
const DeleteModal = ({ property, onClose, onDeleted }) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await propertyService.delete(property.id);
            onDeleted();
        } catch {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 text-center">
                <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HiTrash className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-3">Delete Property?</h2>
                <p className="text-gray-400 mb-8">
                    "<span className="font-bold text-gray-700">{property.title}</span>" will be permanently removed along with all its images. This cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-700 font-black rounded-2xl hover:bg-gray-200 transition">Cancel</button>
                    <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition disabled:opacity-50">
                        {deleting ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main Component ───────────────────────────────────────────
const MyProperties = () => {
    const [properties, setProperties] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingProperty, setDeletingProperty] = useState(null);
    const [editingProperty, setEditingProperty] = useState(null);
    const [toast, setToast] = useState(null);
    const { user } = useAuth();
    const isAdmin = user?.role?.slug === 'admin';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [propsRes, locsRes] = await Promise.all([
                propertyService.getMyProperties(),
                api.get('/locations'),
            ]);
            setProperties(propsRes.data.data || propsRes.data || []);
            setLocations(locsRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleSaved = () => {
        setEditingProperty(null);
        fetchData();
        showToast('Property updated successfully!');
    };

    const handleDeleted = () => {
        setDeletingProperty(null);
        fetchData();
        showToast('Property deleted.', 'info');
    };

    const handleToggleFeatured = async (id) => {
        try {
            const res = await propertyService.toggleFeatured(id);
            setProperties(prev => prev.map(p =>
                p.id === id ? { ...p, is_featured: res.data.is_featured } : p
            ));
            showToast(res.data.message);
        } catch (err) {
            showToast('Failed to toggle featured status.', 'error');
        }
    };

    return (
        <div className="space-y-8">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm transition-all ${toast.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>
                    <HiCheck className="h-5 w-5" />
                    <span>{toast.msg}</span>
                </div>
            )}

            {editingProperty && (
                <EditModal
                    property={editingProperty}
                    locations={locations}
                    onClose={() => setEditingProperty(null)}
                    onSaved={handleSaved}
                />
            )}
            {deletingProperty && (
                <DeleteModal
                    property={deletingProperty}
                    onClose={() => setDeletingProperty(null)}
                    onDeleted={handleDeleted}
                />
            )}

            <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">My Listings</h1>
                    <p className="px-4 sm:px-6 py-2 sm:py-3 border border-black/10 bg-green-600 relative text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg shrink-0">
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        Manage and track your properties.</p>
                </div>
                <div className="flex items-end gap-2">
                    <Link
                        to="/dashboard/saved"
                        className="w-full sm:w-auto px-6 py-2 flex items-center justify-center border border-black/10 bg-indigo-600 relative text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                    >
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <HiPlus className="h-5 w-5 mr-2" />
                        <span>Saved Properties</span>
                    </Link>
                    <Link
                        to="/dashboard/properties/create"
                        className="w-full sm:w-auto px-6 py-2 flex items-center justify-center border border-black/10 bg-indigo-600 relative text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                    >
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <HiPlus className="h-5 w-5 mr-2" />
                        <span>Add New Property</span>
                    </Link>
                </div>

            </div>

            <div className="bg-white shadow-sm border border-black/30 overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <BiBuildingHouse className="h-12 w-12 text-gray-200 mx-auto mb-4 animate-pulse" />
                        <p className="text-gray-400 font-medium">Loading your listings...</p>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="p-20 text-center">
                        <BiBuildingHouse className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-gray-900 mb-2">No Properties Yet</h3>
                        <p className="text-gray-400 mb-6">Add your first listing to get started.</p>
                        <Link to="/dashboard/properties/create" className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition">
                            <HiPlus className="h-5 w-5" />
                            <span>Add Property</span>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse border-black/30 min-w-[800px]">
                            <thead className='bg-green-600 relative border-b'>
                                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                <tr className="">
                                    <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest z-10 relative">Property</th>
                                    <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest z-10 relative">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest z-10 relative">Price</th>
                                    <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest z-10 relative">Visibility</th>
                                    {isAdmin && <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest z-10 relative">Featured</th>}
                                    <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest text-right z-10 relative">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/10 relative bg-green-100/50">
                                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                {properties.map(property => (
                                    <tr key={property.id} className="transition group hover:bg-teal-600/50  z-10 relative">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-14 w-14 bg-gray-100 flex-shrink-0 overflow-hidden border border-black/10">
                                                    <SafeImage
                                                        src={property.images?.[0]}
                                                        className="w-full h-full object-cover"
                                                        alt={property.title}
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-indigo-600 line-clamp-1 max-w-[200px]">{property.title}</p>
                                                    <p className="text-[10px] text-black/60 font-bold truncate max-w-[200px] mt-0.5">{property.address}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={property.status} availability={property.availability} />
                                        </td>
                                        <td className="px-6 py-5 font-black text-indigo-600">
                                            ${Number(property.price).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-black/20 ${property.is_published ? 'bg-green-500 text-white' : 'bg-indigo-600/30 text-black'}`}>
                                                {property.is_published ? 'Live' : 'Draft'}
                                            </span>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-5">
                                                <button
                                                    onClick={() => handleToggleFeatured(property.id)}
                                                    className={`p-2 transition-colors ${property.is_featured ? 'text-amber-400 hover:text-amber-500' : 'text-gray-400 hover:text-amber-500'}`}
                                                    title={property.is_featured ? 'Remove from featured' : 'Mark as featured'}
                                                >
                                                    {property.is_featured ? <HiStar className="h-6 w-6" /> : <HiOutlineStar className="h-6 w-6" />}
                                                </button>
                                            </td>
                                        )}
                                        <td className="px-6 py-5">
                                            <div className="flex justify-end space-x-1">
                                                <Link to={`/properties/${property.slug}`} className="p-2 px-2.5 relative text-white bg-green-600 border border-black/20 transition" title="View">
                                                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                    <HiChevronRight className="h-4 w-4" />
                                                </Link>
                                                <button onClick={() => setEditingProperty(property)} className="p-2 px-2.5 relative text-white bg-indigo-600 border border-black/20 transition" title="Edit">
                                                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                    <HiPencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => setDeletingProperty(property)} className="p-2 px-2.5 relative text-red-100 bg-red-600 border border-black/20 transition" title="Delete">
                                                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                    <HiTrash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProperties;
