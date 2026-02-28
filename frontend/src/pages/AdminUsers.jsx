import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiOutlineSearch, HiOutlineFilter, HiOutlinePlus, HiOutlinePencil,
    HiOutlineTrash, HiOutlineBadgeCheck, HiOutlineUserGroup, HiOutlineShieldCheck,
    HiOutlineX, HiOutlineMail, HiOutlinePhone, HiOutlineUserCircle
} from 'react-icons/hi';
import SafeImage from '../components/SafeImage';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        name: '', email: '', password: '', role_id: '', phone: '', specialization: '', bio: ''
    });

    useEffect(() => {
        fetchData();
        fetchRoles();
        fetchStats();
    }, [roleFilter]);

    const fetchData = async () => {
        try {
            const res = await api.get('/admin/users', {
                params: {
                    role: roleFilter,
                    search: searchTerm
                }
            });
            setUsers(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await api.get('/admin/roles');
            setRoles(res.data);
        } catch (err) {
            console.error('Failed to fetch roles:', err);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/dashboard');
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch admin stats:', err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.post(`/admin/users/${currentUser.id}`, currentUser);
            } else {
                await api.post('/admin/users', currentUser);
            }
            fetchData();
            closeModal();
        } catch (err) {
            console.error('Error saving user:', err);
            alert(err.response?.data?.message || 'Failed to save user');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchData();
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const openModal = (user = null) => {
        if (user) {
            setCurrentUser({ ...user, password: '' });
            setIsEditing(true);
        } else {
            setCurrentUser({ name: '', email: '', password: '', role_id: '', phone: '', specialization: '', bio: '' });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentUser({ name: '', email: '', password: '', role_id: '', phone: '', specialization: '', bio: '' });
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">User Management</h1>
                    <p className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Manage permissions, roles, and account security for all members.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-6 py-3 flex items-center border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>Create New User</span>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-teal-700 p-6 shadow-sm border border-black/20 flex items-center space-x-4">
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 flex items-center justify-center">
                        <HiOutlineUserGroup className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl text-start font-black text-white line-none">{users.filter(u => u.role?.slug === 'agent').length || stats?.total_agents || 0}</p>
                        <p className="text-[10px] text-start font-black text-black uppercase tracking-widest">Total Agents</p>
                    </div>
                </div>
                <div className="bg-teal-700 p-6 shadow-sm border border-black/20 flex items-center space-x-4">
                    <div className="h-12 w-12 bg-purple-50 text-purple-600 flex items-center justify-center">
                        <HiOutlineBadgeCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl text-start font-black text-white line-none">{users.length || stats?.total_users || 0}</p>
                        <p className="text-[10px] text-start font-black text-black uppercase tracking-widest">Active Members</p>
                    </div>
                </div>
                <div className="bg-teal-700 p-6 shadow-sm border border-black/20 flex items-center space-x-4">
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <HiOutlineShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl text-start font-black text-white line-none">94%</p>
                        <p className="text-[10px] text-start font-black text-black uppercase tracking-widest">Verification Rate</p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-teal-700 p-8 border border-black/20 shadow-sm">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row  items-center gap-4">
                    <div className="relative flex-grow">
                        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Find by name, email, or ID..."
                            className="w-full pl-10 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <HiOutlineFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <select
                                className="pl-10 h-fit pr-10 py-2 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.slug}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="px-6 py-2.5 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                            Apply
                        </button>
                    </div>
                </form>
            </div>

            {/* User List */}
            <div className="border border-black/20 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-40 flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Syncing user data...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-40 text-center italic text-gray-400">No users found for this selection.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-amber-600 border-b border-black/20">
                                <th className="px-8 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em]">Profile</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em]">Role & Access</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em]">Join Date</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-50">
                            {users.map((u) => (
                                <tr key={u.id} className="bg-teal-700 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-14 w-14 bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition shadow-sm">
                                                <SafeImage src={u.avatar} className="h-full w-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <p className="font-black text-white tracking-tight">{u.name}</p>
                                                <p className="text-xs text-black font-medium group-hover:text-blue-600 transition-colors">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest inline-flex items-center border border-black/20 shadow-lg ${u.role?.slug === 'admin' ? 'bg-indigo-600 text-white' :
                                            u.role?.slug === 'agent' ? 'bg-blue-600 text-white' :
                                                'bg-gray-50 text-gray-500'
                                            }`}>
                                            <div className={`h-1.5 w-1.5 rounded-full mr-2 ${u.role?.slug === 'admin' ? 'bg-white' :
                                                u.role?.slug === 'agent' ? 'bg-white' :
                                                    'bg-gray-400'
                                                }`} />
                                            {u.role?.name || 'User'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-white">{new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        <p className="text-[10px] text-black font-black uppercase mt-0.5">Verified Account</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => openModal(u)}
                                                className="p-2 text-indigo-950 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition"
                                            >
                                                <HiOutlinePencil className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
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
                    <div className="bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">{isEditing ? 'Edit User' : 'New User'}</h2>
                                <p className="text-gray-500 font-medium">Manage account and profile details.</p>
                            </div>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <HiOutlineX className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                                    <div className="relative">
                                        <HiOutlineUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition font-bold"
                                            value={currentUser.name}
                                            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                                    <div className="relative">
                                        <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition font-bold"
                                            value={currentUser.email}
                                            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Role</label>
                                    <select
                                        required
                                        className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition font-bold text-gray-700"
                                        value={currentUser.role_id}
                                        onChange={(e) => setCurrentUser({ ...currentUser, role_id: e.target.value })}
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Password {isEditing && '(Leave blank to keep current)'}</label>
                                    <input
                                        type="password"
                                        required={!isEditing}
                                        className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition font-bold"
                                        value={currentUser.password}
                                        onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
                                    <div className="relative">
                                        <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition font-bold"
                                            value={currentUser.phone || ''}
                                            onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Specialization (For Agents)</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition font-bold"
                                        placeholder="e.g. Luxury Residences"
                                        value={currentUser.specialization || ''}
                                        onChange={(e) => setCurrentUser({ ...currentUser, specialization: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Bio / About</label>
                                <textarea
                                    className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition font-medium min-h-[100px]"
                                    value={currentUser.bio || ''}
                                    onChange={(e) => setCurrentUser({ ...currentUser, bio: e.target.value })}
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
                                    {isEditing ? 'Save Changes' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
