import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiOutlineSearch, HiOutlineFilter, HiOutlinePlus, HiOutlinePencil,
    HiOutlineTrash, HiOutlineBadgeCheck, HiOutlineUserGroup, HiOutlineShieldCheck,
    HiOutlineX, HiOutlineMail, HiOutlinePhone, HiOutlineUserCircle, HiOutlineEye, HiOutlineEyeOff
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
    const [showPassword, setShowPassword] = useState(false);
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

    const handleToggleVerification = async (id) => {
        try {
            const res = await api.post(`/admin/users/${id}/toggle-verification`);
            setUsers(prev => prev.map(u =>
                u.id === id ? { ...u, is_verified: res.data.is_verified } : u
            ));
        } catch (err) {
            console.error('Error toggling verification:', err);
            alert('Failed to update verification status');
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
        setShowPassword(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setShowPassword(false);
        setCurrentUser({ name: '', email: '', password: '', role_id: '', phone: '', specialization: '', bio: '' });
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row items-end justify-between gap-4 sm:gap-6">
                <div>
                    <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">User Management</h1>
                    <p className="px-4 sm:px-6 py-2 sm:py-3 relative border border-black/10 bg-green-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        Manage permissions and roles.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-6 py-2.5 flex items-center justify-center relative z-10 border border-black/30 bg-gray-900 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg w-full sm:w-auto"
                >
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <HiOutlinePlus className="h-5 w-5 mr-2" />
                    <span>Create User</span>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-gray-900 relative z-10 p-6 shadow-sm border border-black/30 flex items-center space-x-4">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <div className="h-12 w-12 bg-blue-50 border border-black/30 text-blue-600 flex items-center justify-center shrink-0">
                        <HiOutlineUserGroup className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl text-start font-black text-white leading-none">{users.filter(u => u.role?.slug === 'agent').length || stats?.total_agents || 0}</p>
                        <p className="text-[10px] text-start font-black text-black uppercase tracking-widest mt-1">Total Agents</p>
                    </div>
                </div>
                <div className="bg-gray-900 relative z-10 p-6 shadow-sm border border-black/30 flex items-center space-x-4">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <div className="h-12 w-12 bg-purple-50 border border-black/30 text-purple-600 flex items-center justify-center shrink-0">
                        <HiOutlineBadgeCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl text-start font-black text-white leading-none">{users.length || stats?.total_users || 0}</p>
                        <p className="text-[10px] text-start font-black text-black uppercase tracking-widest mt-1">Active Members</p>
                    </div>
                </div>
                <div className="bg-gray-900 relative z-10 p-6 shadow-sm border border-black/30 flex items-center space-x-4">
                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <div className="h-12 w-12 bg-emerald-50 border border-black/30 text-emerald-600 flex items-center justify-center shrink-0">
                        <HiOutlineShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl text-start font-black text-white leading-none">94%</p>
                        <p className="text-[10px] text-start font-black text-black uppercase tracking-widest mt-1">Verification Rate</p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-gray-900 relative p-4 sm:p-8 border border-black/30 shadow-sm">

                <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 z-10 relative">
                    <div className="relative flex-grow">
                        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Find by name..."
                            className="w-full pl-10 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                            <HiOutlineFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <select
                                className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-black/80 focus:ring-0 text-sm font-bold text-black/70"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.slug}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="px-6 py-2.5 relative z-10 border border-black/30 bg-green-600 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                            <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            Apply
                        </button>
                    </div>
                </form>
            </div>

            {/* User List */}
            <div className="border border-black/30 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Syncing user data...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="py-20 text-center italic text-gray-400">No users found for this selection.</div>
                ) : (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left relative z-10 border-collapse min-w-[700px]">
                            <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                            <thead>
                                <tr className="bg-green-600 border-b border-black/30">
                                    <th className="px-6 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em]">Profile</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em]">Role & Access</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em]">Join Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/10">
                                {users.map((u) => (
                                    <tr key={u.id} className="bg-green-100/50 z-10 relative transition-colors group hover:bg-teal-600/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-12 w-12 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition shadow-sm border border-black/10">
                                                    <SafeImage src={u.avatar_url} className="h-full w-full object-cover" alt="" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-indigo-600 tracking-tight truncate max-w-[150px]">{u.name}</p>
                                                    <p className="text-[10px] text-black font-bold truncate max-w-[150px]">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest inline-flex items-center border border-black/10 ${u.role?.slug === 'admin' ? 'bg-gray-900 text-white' :
                                                u.role?.slug === 'agent' ? 'bg-blue-600 text-white' :
                                                    'bg-white/90 text-gray-500'
                                                }`}>
                                                {u.role?.name || 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-black">{new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            <p className={`text-[9px] font-black uppercase mt-0.5 ${u.is_verified ? 'text-green-600' : 'text-amber-600'}`}>
                                                {u.is_verified ? 'Verified' : 'Pending'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end space-x-3">
                                                {u.role?.slug === 'agent' && (
                                                    <button
                                                        onClick={() => handleToggleVerification(u.id)}
                                                        className={`px-3 py-1.5 text-[10px] relative z-10 font-black uppercase tracking-widest border transition ${u.is_verified
                                                            ? ' border-red-500/30 text-indigo-100 bg-red-500 hover:text-white'
                                                            : ' border-green-500/30 text-indigo-100 bg-green-600 hover:text-white'}`}
                                                        title={u.is_verified ? 'Revoke Verification' : 'Approve Agent'}
                                                    >
                                                        <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                        {u.is_verified ? 'Unverify' : 'Verify Agent'}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openModal(u)}
                                                    className="p-2 text-white relative z-10 bg-gray-900 border border-black/30 transition"
                                                >
                                                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                    <HiOutlinePencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(u.id)}
                                                    className="p-2 text-red-400 relative z-10 bg-red-600 border border-black/30 hover:text-white transition"
                                                >
                                                    <img src="/public/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                                    <HiOutlineTrash className="h-4 w-4" />
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-green-900 relative w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-start text-indigo-100">{isEditing ? 'Edit User' : 'New User'}</h2>
                                <p className="text-gray-500 font-medium text-start">Manage account and profile details.</p>
                            </div>
                            <button onClick={closeModal} className="p-2 relative z-10 bg-indigo-600 border border-black/30 transition">
                                <HiOutlineX className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6 z-10 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1 flex flex-col items-start">
                                    <label className="text-[10px] tex-start font-black text-black uppercase tracking-widest">Full Name</label>
                                    <div className="relative w-full">
                                        <HiOutlineUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-12 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                            value={currentUser.name}
                                            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 flex flex-col items-start">
                                    <label className="text-[10px] tex-start font-black text-black uppercase tracking-widest">Email Address</label>
                                    <div className="relative w-full">
                                        <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-12 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                            value={currentUser.email}
                                            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 flex flex-col items-start">
                                    <label className="text-[10px] tex-start font-black text-black uppercase tracking-widest">Role</label>
                                    <select
                                        required
                                        className=" w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                        value={currentUser.role_id}
                                        onChange={(e) => setCurrentUser({ ...currentUser, role_id: e.target.value })}
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1 flex flex-col items-start">
                                    <label className="text-[10px] tex-start font-black text-black uppercase tracking-widest">Password {isEditing && '(Leave blank to keep current)'}</label>
                                    <div className="relative w-full">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required={!isEditing}
                                            className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                            value={currentUser.password}
                                            onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <HiOutlineEyeOff className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1 flex flex-col items-start">
                                    <label className="text-[10px] tex-start font-black text-black uppercase tracking-widest">Phone Number</label>
                                    <div className="relative w-full">
                                        <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            className="w-full pl-12 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                            value={currentUser.phone || ''}
                                            onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 flex flex-col items-start">
                                    <label className="text-[10px] tex-start font-black text-black uppercase tracking-widest">Specialization (For Agents)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                        placeholder="e.g. Luxury Residences"
                                        value={currentUser.specialization || ''}
                                        onChange={(e) => setCurrentUser({ ...currentUser, specialization: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 flex flex-col items-start">
                                <label className="text-[10px] font-black text-black uppercase tracking-widest">Bio / About</label>
                                <textarea
                                    className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70 min-h-[100px]"
                                    value={currentUser.bio || ''}
                                    onChange={(e) => setCurrentUser({ ...currentUser, bio: e.target.value })}
                                />
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-grow py-4 bg-gray-50 text-gray-500 font-black hover:bg-gray-100 transition uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-grow py-4 relative bg-gray-900 border border-black/30 text-white font-black  hover:bg-blue-700 transition uppercase tracking-widest text-xs"
                                >
                                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
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

