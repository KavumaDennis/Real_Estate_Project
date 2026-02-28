import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    HiUser, HiMail, HiPhone, HiLockClosed, HiPhotograph,
    HiCheck, HiExclamation, HiEye, HiEyeOff, HiBriefcase
} from 'react-icons/hi';
import SafeImage from '../components/SafeImage';

const API_BASE = 'http://localhost:8000';

const ProfileSettings = () => {
    const { user, setUser } = useAuth();

    // ── Account Form ─────────────────────────────────────────
    const [accountForm, setAccountForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        specialization: user?.specialization || '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(
        user?.avatar ? `${API_BASE}/storage/${user.avatar}` : null
    );
    const avatarRef = useRef();

    // ── Password Form ────────────────────────────────────────
    const [pwForm, setPwForm] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

    // ── State ────────────────────────────────────────────────
    const [saving, setSaving] = useState(false);
    const [changingPw, setChangingPw] = useState(false);
    const [toast, setToast] = useState(null);
    const [errors, setErrors] = useState({});

    const isAgent = user?.role?.slug === 'agent' || user?.role?.slug === 'admin';

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    // ── Avatar Handler ───────────────────────────────────────
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // ── Save Account ─────────────────────────────────────────
    const handleSaveAccount = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            const fd = new FormData();
            Object.entries(accountForm).forEach(([k, v]) => fd.append(k, v));
            if (avatarFile) fd.append('avatar', avatarFile);

            const res = await api.post('/profile', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (setUser) setUser(res.data.user);
            showToast('Profile updated successfully!');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                showToast(err.response?.data?.message || 'Update failed.', 'error');
            }
        } finally {
            setSaving(false);
        }
    };

    // ── Change Password ──────────────────────────────────────
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (pwForm.password !== pwForm.password_confirmation) {
            setErrors({ password_confirmation: ['Passwords do not match.'] });
            return;
        }
        setChangingPw(true);
        setErrors({});
        try {
            await api.post('/profile/password', pwForm);
            setPwForm({ current_password: '', password: '', password_confirmation: '' });
            showToast('Password changed successfully!');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                showToast(err.response?.data?.message || 'Password change failed.', 'error');
            }
        } finally {
            setChangingPw(false);
        }
    };

    const Field = ({ label, icon: Icon, error, children }) => (
        <div>
            <label className="text-xs text-start font-black text-black uppercase tracking-widest mb-1 flex items-center space-x-1.5">
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{label}</span>
            </label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error[0]}</p>}
        </div>
    );

    const inputClass = "w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70";

    return (
        <div className="max-w-3xl mx-auto space-y-10">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm animate-fade-in ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
                    {toast.type === 'success' ? <HiCheck className="h-5 w-5" /> : <HiExclamation className="h-5 w-5" />}
                    <span>{toast.msg}</span>
                </div>
            )}

            {/* Header */}
            <div>
                <h1 className="block text-xl text-start font-black text-black uppercase tracking-widest">Profile Settings</h1>
                <p className="text-teal-700 text-start mt-1">Update your account details and preferences.</p>
            </div>

            {/* ── Avatar + Account ────────────────────────────── */}
            <form onSubmit={handleSaveAccount} className="bg-teal-700 border border-black/20 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-violet-50">
                    <div className="flex items-center bg-amber-600 space-x-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="h-24 w-24 overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0 shadow-lg">
                                {avatarPreview ? (
                                    <SafeImage src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-black text-blue-600">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => avatarRef.current?.click()}
                                className="absolute -bottom-2 -right-2 h-8 w-8 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md hover:bg-blue-700 transition"
                                title="Change avatar"
                            >
                                <HiPhotograph className="h-4 w-4" />
                            </button>
                            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>

                        <div cl>
                            <p className="text-xl text-start font-black text-white">{user?.name}</p>
                            <p className="text-sm text-black text-start">{user?.email}</p>
                            <span className={`w-fit mt-2 flex items-start px-3 py-1 text-xs font-black uppercase tracking-widest ${user?.role?.slug === 'admin' ? 'bg-violet-100 text-violet-700' : user?.role?.slug === 'agent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                {user?.role?.name || 'User'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-5 bg-teal-700">
                    <h3 className="text-lg text-start font-black text-white uppercase tracking-widest flex items-center space-x-2">
                        <HiUser className="h-5 w-5" />
                        <span>Account Details</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Full Name" icon={HiUser} error={errors.name}>
                            <input className={inputClass} value={accountForm.name} onChange={e => setAccountForm({ ...accountForm, name: e.target.value })} placeholder="Your full name" required />
                        </Field>
                        <Field label="Email Address" icon={HiMail} error={errors.email}>
                            <input type="email" className={inputClass} value={accountForm.email} onChange={e => setAccountForm({ ...accountForm, email: e.target.value })} placeholder="your@email.com" required />
                        </Field>
                        <Field label="Phone Number" icon={HiPhone} error={errors.phone}>
                            <input type="tel" className={inputClass} value={accountForm.phone} onChange={e => setAccountForm({ ...accountForm, phone: e.target.value })} placeholder="+256 700 000 000" />
                        </Field>
                        {isAgent && (
                            <Field label="Specialization" icon={HiBriefcase} error={errors.specialization}>
                                <input className={inputClass} value={accountForm.specialization} onChange={e => setAccountForm({ ...accountForm, specialization: e.target.value })} placeholder="e.g. Residential Properties" />
                            </Field>
                        )}
                    </div>

                    {isAgent && (
                        <Field label="Bio" error={errors.bio}>
                            <textarea rows="3" className={`${inputClass} resize-none`} value={accountForm.bio} onChange={e => setAccountForm({ ...accountForm, bio: e.target.value })} placeholder="Tell clients about yourself and your experience..." />
                        </Field>
                    )}

                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={saving} className="px-6 py-3 border border-black/30 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                            {saving ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <HiCheck className="h-5 w-5" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* ── Password ─────────────────────────────────────── */}
            <form onSubmit={handleChangePassword} className="bg-teal-700 border border-black/20 shadow-sm p-8 space-y-5">
                <h3 className=" text-lg text-start font-black text-white uppercase tracking-widest flex items-center space-x-2">
                    <HiLockClosed className="h-5 w-5 " />
                    <span>Change Password</span>
                </h3>

                <Field label="Current Password" error={errors.current_password}>
                    <div className="relative">
                        <input
                            type={showPw.current ? 'text' : 'password'}
                            className={`${inputClass} pr-12`}
                            value={pwForm.current_password}
                            onChange={e => setPwForm({ ...pwForm, current_password: e.target.value })}
                            placeholder="Enter current password"
                            required
                        />
                        <button type="button" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPw.current ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                        </button>
                    </div>
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="New Password" error={errors.password}>
                        <div className="relative">
                            <input
                                type={showPw.new ? 'text' : 'password'}
                                className={`${inputClass} pr-12`}
                                value={pwForm.password}
                                onChange={e => setPwForm({ ...pwForm, password: e.target.value })}
                                placeholder="Min 8 characters"
                                required minLength={8}
                            />
                            <button type="button" onClick={() => setShowPw(p => ({ ...p, new: !p.new }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPw.new ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                            </button>
                        </div>
                    </Field>
                    <Field label="Confirm New Password" error={errors.password_confirmation}>
                        <div className="relative">
                            <input
                                type={showPw.confirm ? 'text' : 'password'}
                                className={`${inputClass} pr-12`}
                                value={pwForm.password_confirmation}
                                onChange={e => setPwForm({ ...pwForm, password_confirmation: e.target.value })}
                                placeholder="Repeat new password"
                                required
                            />
                            <button type="button" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPw.confirm ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                            </button>
                        </div>
                    </Field>
                </div>

                {/* Password strength hint */}
                {pwForm.password && (
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full ${pwForm.password.length >= i * 2 ? (pwForm.password.length >= 10 ? 'bg-green-500' : 'bg-yellow-400') : 'bg-gray-100'}`} />
                        ))}
                        <span className="text-xs text-gray-400 ml-2 font-medium">{pwForm.password.length < 6 ? 'Weak' : pwForm.password.length < 10 ? 'Fair' : 'Strong'}</span>
                    </div>
                )}

                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={changingPw} className="px-6 py-3 border border-black/30 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg disabled:opacity-50 flex items-center space-x-2">
                        {changingPw ? (
                            <><div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" /><span>Updating...</span></>
                        ) : (
                            <><HiLockClosed className="h-5 w-5" /><span>Update Password</span></>
                        )}
                    </button>
                </div>
            </form>

            {/* ── Danger Zone ──────────────────────────────────── */}
            <div className="bg-white border border-dashed border-red-500 shadow-sm p-8">
                <h3 className="block text-xs text-start font-black uppercase tracking-widest text-red-600 mb-4">Danger Zone</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-start text-gray-900">Delete Account</p>
                        <p className="text-sm text-start text-gray-400 mt-1">Permanently remove your account and all associated data.</p>
                    </div>
                    <button type="button" className="px-6 py-3 border border-black/10 bg-red-500 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
