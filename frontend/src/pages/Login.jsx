import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const Login = () => {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState(searchParams.get('error') ? (searchParams.get('error') === 'auth_failed' ? 'Social authentication failed. Please try again.' : 'Login failed.') : '');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            if (errorParam === 'auth_failed') setError('Social authentication failed. Please try again.');
            else if (errorParam === 'google_auth_failed') setError('Google authentication failed at the source.');
            else setError('An authentication error occurred.');
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password, remember);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" bg-[#121417] my-3">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full overflow-hidden border border-white/10 shadow-2xl lg:min-h-[78vh]">
                <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#0a5f4a] via-[#0a2f34] to-[#101a22] p-8 lg:flex lg:flex-col lg:justify-between">
                    <img src="/bg-img.png" className="absolute inset-0 h-full w-full object-cover opacity-20" alt="" />
                    <div className="relative z-10">
                        <p className="text-[10px] text-start font-black uppercase tracking-[0.35em] text-white/80">Green Wave</p>
                        <h2 className="mt-6 text-start text-4xl font-black uppercase leading-tight text-white">
                            Get Started With Us
                        </h2>
                        <p className="mt-4 text-start text-sm font-semibold text-white/80">
                            Complete these easy steps to access your real estate dashboard.
                        </p>
                    </div>

                    <div className="relative z-10 grid grid-cols-3 gap-3">
                        <div className="border border-white/20 bg-white px-3 py-4 text-[11px] font-black uppercase text-black">
                            Sign up your account
                        </div>
                        <div className="border border-white/20 bg-white/10 px-3 py-4 text-[11px] font-black uppercase text-white/90">
                            Set up your workspace
                        </div>
                        <div className="border border-white/20 bg-white/10 px-3 py-4 text-[11px] font-black uppercase text-white/90">
                            Set up your profile
                        </div>
                    </div>
                </div>

                <div className="w-full bg-green-600 p-6 sm:p-8 lg:p-10 relative">
                    <img src="/bg-img.png" className="absolute inset-0 h-full w-full object-cover opacity-20" alt="" />
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-white text-start mb-2">Sign In Account</h2>
                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-black text-start">Enter your personal data to access your account.</p>
                    </div>

                    {error && (
                        <div className="mb-6 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5 z-10 relative" onSubmit={handleSubmit}>
                        <button
                            type="button"
                            onClick={() => window.location.href = 'http://localhost:8000/api/login/google'}
                            className="flex w-full items-center justify-center gap-2 border border-black/30 bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-gray-100"
                        >
                            <FcGoogle className="h-5 w-5" />
                            Google
                        </button>

                        <div>
                            <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-black text-start">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full border border-black/30 bg-white/15 px-3 py-3 text-sm font-bold text-white placeholder:text-white/30 focus:outline-none"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-black text-start">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full border border-black/30 bg-white/15 px-3 py-3 pr-10 text-sm font-bold text-white placeholder:text-white/30 focus:outline-none"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 text-white/70">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 border-white/30 bg-transparent"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                />
                                <span className="font-bold">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="font-black uppercase tracking-widest text-black hover:text-cyan-200">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full border border-black/30 bg-gray-900 px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <p className="text-start text-xs font-bold text-white/70">
                            Don&apos;t have an account?{' '}
                            <Link to="/register" className="font-black uppercase tracking-widest text-black hover:text-cyan-200">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
