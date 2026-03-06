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
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);
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
                    <div className="bg-amber-600 p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {/* Avatar */}
                            <div className="relative group shrink-0">
                                <div className="h-28 w-28 overflow-hidden bg-white border border-black/20 flex items-center justify-center shadow-xl">
                                    {avatarPreview ? (
                                        <SafeImage src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-black text-amber-600">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => avatarRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 h-10 w-10 bg-teal-700 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition border border-white/20"
                                    title="Change avatar"
                                >
                                    <HiPhotograph className="h-5 w-5" />
                                </button>
                                <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </div>

                            <div className="text-center sm:text-left flex flex-col justify-center">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{user?.name}</h2>
                                <p className="text-black/70 font-bold text-sm mt-2">{user?.email}</p>
                                <div className="flex justify-center sm:justify-start mt-4">
                                    <span className={`px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] border border-black/10 shadow-sm ${user?.role?.slug === 'admin' ? 'bg-indigo-600 text-white' : user?.role?.slug === 'agent' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500'}`}>
                                        {user?.role?.name || 'User'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6 bg-teal-700">
                    <h3 className="text-lg text-start font-black text-white uppercase tracking-widest flex items-center space-x-3">
                        <div className="p-2 bg-amber-600 border border-black/10">
                            <HiUser className="h-5 w-5 text-white" />
                        </div>
                        <span>Personal Information</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                        <Field label="Full Name" icon={HiUser} error={errors.name}>
                            <input className={inputClass} value={accountForm.name} onChange={e => setAccountForm({ ...accountForm, name: e.target.value })} placeholder="Full Name" required />
                        </Field>
                        <Field label="Email Address" icon={HiMail} error={errors.email}>
                            <input type="email" className={inputClass} value={accountForm.email} onChange={e => setAccountForm({ ...accountForm, email: e.target.value })} placeholder="email@example.com" required />
                        </Field>
                        <Field label="Phone Number" icon={HiPhone} error={errors.phone}>
                            <input type="tel" className={inputClass} value={accountForm.phone} onChange={e => setAccountForm({ ...accountForm, phone: e.target.value })} placeholder="Phone Number" />
                        </Field>
                        {isAgent && (
                            <Field label="Specialization" icon={HiBriefcase} error={errors.specialization}>
                                <input className={inputClass} value={accountForm.specialization} onChange={e => setAccountForm({ ...accountForm, specialization: e.target.value })} placeholder="e.g. Luxury Estates" />
                            </Field>
                        )}
                    </div>

                    {isAgent && (
                        <Field label="Professional Bio" error={errors.bio}>
                            <textarea rows="4" className={`${inputClass} resize-none`} value={accountForm.bio} onChange={e => setAccountForm({ ...accountForm, bio: e.target.value })} placeholder="Write a short professional bio..." />
                        </Field>
                    )}

                    <div className="flex justify-end pt-4 border-t border-black/10">
                        <button type="submit" disabled={saving} className="w-full sm:w-auto px-10 py-4 bg-amber-600 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-2xl disabled:opacity-50 flex items-center justify-center space-x-2">
                            {saving ? (
                                <><div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" /><span>Syncing...</span></>
                            ) : (
                                <><HiCheck className="h-5 w-5" /><span>Save Changes</span></>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* ── Password ─────────────────────────────────────── */}
            <form onSubmit={handleChangePassword} className="bg-teal-700 border border-black/20 shadow-sm p-6 sm:p-8 space-y-6">
                <h3 className="text-lg text-start font-black text-white uppercase tracking-widest flex items-center space-x-3">
                    <div className="p-2 bg-amber-600 border border-black/10">
                        <HiLockClosed className="h-5 w-5 text-white" />
                    </div>
                    <span>Password Security</span>
                </h3>

                <Field label="Current Password" error={errors.current_password}>
                    <div className="relative">
                        <input
                            type={showPw.current ? 'text' : 'password'}
                            className={`${inputClass} pr-12`}
                            value={pwForm.current_password}
                            onChange={e => setPwForm({ ...pwForm, current_password: e.target.value })}
                            placeholder="Current Password"
                            required
                        />
                        <button type="button" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                            {showPw.current ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                        </button>
                    </div>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <Field label="New Password" error={errors.password}>
                        <div className="relative">
                            <input
                                type={showPw.new ? 'text' : 'password'}
                                className={`${inputClass} pr-12`}
                                value={pwForm.password}
                                onChange={e => setPwForm({ ...pwForm, password: e.target.value })}
                                placeholder="New Password"
                                required minLength={8}
                            />
                            <button type="button" onClick={() => setShowPw(p => ({ ...p, new: !p.new }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
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
                                placeholder="Confirm Password"
                                required
                            />
                            <button type="button" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                                {showPw.confirm ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                            </button>
                        </div>
                    </Field>
                </div>

                {/* Password strength hint */}
                {pwForm.password && (
                    <div className="flex items-center gap-3">
                        <div className="flex flex-grow gap-1">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`h-1 flex-1 transition-all ${pwForm.password.length >= i * 2 ? (pwForm.password.length >= 10 ? 'bg-emerald-500' : 'bg-amber-400') : 'bg-white/10'}`} />
                            ))}
                        </div>
                        <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{pwForm.password.length < 6 ? 'Weak' : pwForm.password.length < 10 ? 'Medium' : 'Strong'}</span>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t border-black/10">
                    <button type="submit" disabled={changingPw} className="w-full sm:w-auto px-10 py-4 bg-amber-600 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-2xl disabled:opacity-50 flex items-center justify-center space-x-2">
                        {changingPw ? (
                            <><div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" /><span>Updating Security...</span></>
                        ) : (
                            <><HiLockClosed className="h-5 w-5" /><span>Update Password</span></>
                        )}
                    </button>
                </div>
            </form>

            {/* ── Danger Zone ──────────────────────────────────── */}
            <div className="bg-white border border-dashed border-red-500 shadow-sm p-6 sm:p-8">
                <h3 className="block text-xs text-start font-black uppercase tracking-widest text-red-600 mb-6">Danger Zone</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="max-w-md">
                        <p className="font-black text-gray-900 uppercase tracking-tight">Delete Account</p>
                        <p className="text-sm text-gray-400 mt-2 leading-relaxed">Permanently remove your account and all associated data. This action is irreversible.</p>
                    </div>
                    <button type="button" className="w-full sm:w-auto px-8 py-4 bg-red-600 text-xs font-black uppercase tracking-widest text-white hover:bg-black transition shadow-xl">
                        Terminate Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
