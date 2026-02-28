import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiOutlineSearch, HiOutlinePlus, HiOutlinePencil,
    HiOutlineTrash, HiOutlineSparkles, HiOutlineCheckCircle
} from 'react-icons/hi';

const AdminAmenities = () => {
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAmenity, setCurrentAmenity] = useState({ name: '', icon: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchAmenities();
    }, []);

    const fetchAmenities = async () => {
        try {
            const res = await api.get('/admin/amenities');
            setAmenities(res.data);
        } catch (err) {
            console.error('Failed to fetch amenities:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/admin/amenities/${currentAmenity.id}`, currentAmenity);
            } else {
                await api.post('/admin/amenities', currentAmenity);
            }
            fetchAmenities();
            closeModal();
        } catch (err) {
            console.error('Error saving amenity:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this amenity?')) return;
        try {
            await api.delete(`/admin/amenities/${id}`);
            fetchAmenities();
        } catch (err) {
            console.error('Error deleting amenity:', err);
        }
    };

    const openModal = (amenity = { name: '', icon: '' }) => {
        setCurrentAmenity(amenity);
        setIsEditing(!!amenity.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentAmenity({ name: '', icon: '' });
    };

    const filteredAmenities = amenities.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Manage Amenities</h1>
                    <p className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Create features that agents can assign to their property listings.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-6 py-3 flex items-center border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>Add New Amenity</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                 <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search amenities by name..."
                    className="flex-grow w-full pl-10 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold placeholder-black/70"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="border border-dashed border-black/30 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-40 flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Syncing amenities...</p>
                    </div>
                ) : filteredAmenities.length === 0 ? (
                    <div className="p-40 text-center italic text-gray-400 font-medium">No amenities available.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Feature Name</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Icon Reference</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAmenities.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition duration-300">
                                                <HiOutlineSparkles className="h-6 w-6" />
                                            </div>
                                            <p className="font-black text-gray-900 tracking-tight">{a.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <code className="text-[10px] font-black bg-gray-50 px-3 py-1.5 rounded-lg text-gray-400">
                                            {a.icon || 'default-icon'}
                                        </code>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-[10px] font-black text-green-600 uppercase tracking-widest">
                                            <HiOutlineCheckCircle className="mr-1.5 h-4 w-4" />
                                            <span>Active</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => openModal(a)}
                                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 rounded-2xl transition shadow-sm"
                                            >
                                                <HiOutlinePencil className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(a.id)}
                                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-2xl transition shadow-sm"
                                            >
                                                <HiOutlineTrash className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-teal-700 border border-black/20 w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-300">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-gray-900">{isEditing ? 'Edit Amenity' : 'New Amenity'}</h2>
                            <p className="text-gray-500 font-medium">Define property feature tags.</p>
                        </div>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Amenity Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold placeholder-black/70"
                                    placeholder="e.g. Swimming Pool"
                                    value={currentAmenity.name}
                                    onChange={(e) => setCurrentAmenity({ ...currentAmenity, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Icon Name (optional)</label>
                                <input
                                    type="text"
                                    className="w-full pl-10 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold placeholder-black/70"
                                    placeholder="e.g. pool-icon"
                                    value={currentAmenity.icon}
                                    onChange={(e) => setCurrentAmenity({ ...currentAmenity, icon: e.target.value })}
                                />
                            </div>
                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-grow py-4 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-grow py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-100 uppercase tracking-widest text-xs"
                                >
                                    {isEditing ? 'Save Changes' : 'Create Amenity'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAmenities;
