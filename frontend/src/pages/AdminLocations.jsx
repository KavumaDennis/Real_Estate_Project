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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Manage Locations</h1>
                    <p className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Define regions, cities, and neighborhoods available for property listings.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-6 py-3 flex items-center border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>Add New Location</span>
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
            <div className="border border-black/20 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-40 flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Syncing locations...</p>
                    </div>
                ) : filteredLocations.length === 0 ? (
                    <div className="p-40 text-center italic text-gray-400 font-medium">No locations found. Start by adding one.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-amber-600 border-b border-black/20">
                                <th className="px-8 py-6 text-[10px] font-black text-white uppercase tracking-[0.2em]">Location Name</th>
                                <th className="px-8 py-6 text-[10px] font-black text-white uppercase tracking-[0.2em]">Type</th>
                                <th className="px-8 py-6 text-[10px] font-black text-white uppercase tracking-[0.2em]">Properties</th>
                                <th className="px-8 py-6 text-[10px] font-black text-white uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-50">
                            {filteredLocations.map((l) => (
                                <tr key={l.id} className="bg-teal-700 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition">
                                                <HiOutlineLocationMarker className="h-6 w-6" />
                                            </div>
                                            <p className="font-black text-gray-900 tracking-tight">{l.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1.5 bg-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                            {l.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-sm font-bold text-amber-500">
                                            <HiOutlineMap className="mr-2 text-gray-300" />
                                            <span>12 Properties</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => openModal(l)}
                                                className="p-2 text-indigo-950 hover:text-blue-600 hover:border-blue-100 transition"
                                            >
                                                <HiOutlinePencil className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(l.id)}
                                                className="p-2 text-rose-600/95 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition"
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
                    <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-300">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-gray-900">{isEditing ? 'Edit Location' : 'New Location'}</h2>
                            <p className="text-gray-500 font-medium">Define geographical attributes.</p>
                        </div>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Location Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition font-bold"
                                    placeholder="e.g. UpperHill"
                                    value={currentLocation.name}
                                    onChange={(e) => setCurrentLocation({ ...currentLocation, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Type</label>
                                <select
                                    required
                                    className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition font-bold text-gray-700"
                                    value={currentLocation.type}
                                    onChange={(e) => setCurrentLocation({ ...currentLocation, type: e.target.value })}
                                >
                                    <option value="city">City</option>
                                    <option value="region">Region</option>
                                    <option value="neighborhood">Neighborhood</option>
                                </select>
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
                                    {isEditing ? 'Save Changes' : 'Create Location'}
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
