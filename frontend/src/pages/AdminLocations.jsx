import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiOutlineSearch, HiOutlinePlus, HiOutlinePencil,
    HiOutlineTrash, HiOutlineLocationMarker, HiOutlineMap
} from 'react-icons/hi';

const AdminLocations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({ name: '', type: 'city', parent_id: null });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const res = await api.get('/admin/locations');
            setLocations(res.data);
        } catch (err) {
            console.error('Failed to fetch locations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/admin/locations/${currentLocation.id}`, currentLocation);
            } else {
                await api.post('/admin/locations', currentLocation);
            }
            fetchLocations();
            closeModal();
        } catch (err) {
            console.error('Error saving location:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this location?')) return;
        try {
            await api.delete(`/admin/locations/${id}`);
            fetchLocations();
        } catch (err) {
            console.error('Error deleting location:', err);
        }
    };

    const openModal = (location = { name: '', type: 'city', parent_id: null }) => {
        setCurrentLocation(location);
        setIsEditing(!!location.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentLocation({ name: '', type: 'city', parent_id: null });
    };

    const filteredLocations = locations.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Manage Locations</h1>
                    <p className="px-4 sm:px-6 py-2 sm:py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg shrink-0">Define regions and cities.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 border border-black/10 bg-teal-700 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>New Location</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative flex-grow">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Filter locations by name or type..."
                    className="w-full pl-10 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold placeholder-black/70"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="border border-black/20 shadow-sm overflow-x-auto scrollbar-hide">
                {loading ? (
                    <div className="p-20 sm:p-40 flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                        <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Syncing...</p>
                    </div>
                ) : filteredLocations.length === 0 ? (
                    <div className="p-20 sm:p-40 text-center italic text-gray-400 font-black text-[10px] uppercase tracking-widest">No locations.</div>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-amber-600 border-b border-black/20">
                                <th className="px-6 py-5 text-[9px] font-black text-white uppercase tracking-[0.2em]">Location Name</th>
                                <th className="px-6 py-5 text-[9px] font-black text-white uppercase tracking-[0.2em]">Type</th>
                                <th className="px-6 py-5 text-[9px] font-black text-white uppercase tracking-[0.2em]">Properties</th>
                                <th className="px-6 py-5 text-[9px] font-black text-white uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/10">
                            {filteredLocations.map((l) => (
                                <tr key={l.id} className="bg-teal-700 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 w-10 bg-amber-600/20 text-amber-500 border border-amber-600/30 flex items-center justify-center shrink-0">
                                                <HiOutlineLocationMarker className="h-5 w-5" />
                                            </div>
                                            <p className="font-black text-white tracking-tight">{l.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-black/20 text-[9px] font-black text-blue-400 border border-white/5 uppercase tracking-widest">
                                            {l.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                            <HiOutlineMap className="mr-2 h-3.5 w-3.5" />
                                            <span>Active</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => openModal(l)}
                                                className="p-2.5 bg-amber-600 text-white hover:bg-white hover:text-amber-600 transition shadow-sm border border-black/10"
                                            >
                                                <HiOutlinePencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(l.id)}
                                                className="p-2.5 bg-rose-600 text-white hover:bg-white hover:text-rose-600 transition shadow-sm border border-black/10"
                                            >
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-teal-700 border border-black/20 w-full max-w-md p-6 sm:p-10 shadow-2xl animate-in zoom-in duration-300">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">{isEditing ? 'Edit Location' : 'New Location'}</h2>
                            <p className="text-white/50 text-xs font-black uppercase tracking-widest mt-2">Define geographic attributes.</p>
                        </div>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Location Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border border-black/80 p-3 text-sm font-bold text-black/70 focus:ring-0"
                                    placeholder="e.g. UpperHill"
                                    value={currentLocation.name}
                                    onChange={(e) => setCurrentLocation({ ...currentLocation, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Type</label>
                                <select
                                    required
                                    className="w-full bg-white border border-black/80 p-3 text-sm font-black uppercase tracking-widest text-black/70 focus:ring-0"
                                    value={currentLocation.type}
                                    onChange={(e) => setCurrentLocation({ ...currentLocation, type: e.target.value })}
                                >
                                    <option value="city">City</option>
                                    <option value="region">Region</option>
                                    <option value="neighborhood">Neighborhood</option>
                                </select>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-4 bg-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/20 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-amber-600 text-white font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition shadow-xl"
                                >
                                    {isEditing ? 'Save' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLocations;
