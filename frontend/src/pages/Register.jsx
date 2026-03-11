import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please check your data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[86vh] bg-[#121417]">
            <div className="grid grid-cols-1 md:grid-cols-2 my-3 w-full overflow-hidden border border-white/10 shadow-2xl lg:min-h-[78vh]">
                <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#0a5f4a] via-[#0a2f34] to-[#101a22] p-8 lg:flex lg:flex-col lg:justify-between">
                    <img src="/bg-img.png" className="absolute inset-0 h-full w-full object-cover opacity-20" alt="" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/80 text-start">Green Wave</p>
                        <h2 className="mt-6  text-4xl font-black uppercase leading-tight text-white text-start">
                            Build Your Account
                        </h2>
                        <p className="mt-4 text-sm font-semibold text-white/80 text-start">
                            Create your profile and start listing or discovering premium properties.
                        </p>
                    </div>

                    <div className="relative z-10 grid grid-cols-3 gap-3">
                        <div className="border border-white/20 bg-white px-3 py-4 text-[11px] font-black uppercase text-black">
                            Create account
                        </div>
                        <div className="border border-white/20 bg-white/10 px-3 py-4 text-[11px] font-black uppercase text-white/90">
                            Complete profile
                        </div>
                        <div className="border border-white/20 bg-white/10 px-3 py-4 text-[11px] font-black uppercase text-white/90">
                            Start exploring
                        </div>
                    </div>
                </div>

                <div className="w-full relative bg-green-600 p-6 sm:p-8 lg:p-10">
                    <img src="/bg-img.png" className="absolute inset-0 h-full w-full object-cover opacity-20" alt="" />
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-white text-start mb-3">Create Account</h2>
                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-start text-black">Join as a buyer or listing agent.</p>
                    </div>

                    {error && (
                        <div className="mb-6 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4 z-10 relative" onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-black text-start">Full Name</label>
                            <input
                                type="text"
                                className="w-full border border-black/30 bg-teal-700/55 px-3 py-3 text-sm font-bold text-white placeholder:text-white/30 focus:outline-none"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-black text-start">Email</label>
                            <input
                                type="email"
                                className="w-full border border-black/30 bg-teal-700/55 px-3 py-3 text-sm font-bold text-white placeholder:text-white/30 focus:outline-none"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-black text-start">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="w-full border border-black/30 bg-teal-700/55 px-3 py-3 pr-10 text-sm font-bold text-white placeholder:text-white/30 focus:outline-none"
                                        placeholder="Create password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <HiOutlineEyeOff className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-black text-start">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="w-full border border-black/30 bg-teal-700/55 px-3 py-3 pr-10 text-sm font-bold text-white placeholder:text-white/30 focus:outline-none"
                                        placeholder="Repeat password"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? <HiOutlineEyeOff className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-black text-start">Role</label>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <label className={`cursor-pointer border px-3 py-3 text-xs font-black uppercase tracking-widest ${formData.role === 'user' ? 'border-cyan-400 bg-cyan-500/50 text-cyan-200' : 'border-white/20 bg-white/5 text-white/70'}`}>
                                    <input
                                        type="radio"
                                        value="user"
                                        className="hidden"
                                        checked={formData.role === 'user'}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    />
                                    Member
                                </label>
                                <label className={`cursor-pointer border px-3 py-3 text-xs font-black uppercase tracking-widest ${formData.role === 'agent' ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200' : 'border-white/20 bg-white/5 text-white/70'}`}>
                                    <input
                                        type="radio"
                                        value="agent"
                                        className="hidden"
                                        checked={formData.role === 'agent'}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    />
                                    Listing Agent
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full border border-black/30 bg-gray-900 relative z-10 px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <img src="/bg-img.png" className="absolute inset-0 h-full w-full object-cover opacity-20" alt="" />
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>

                        <p className="text-start text-xs font-bold text-white/70">
                            Already have an account?{' '}
                            <Link to="/login" className="font-black uppercase tracking-widest text-black hover:text-cyan-200">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
