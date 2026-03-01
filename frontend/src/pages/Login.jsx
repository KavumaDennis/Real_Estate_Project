import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        <div className="min-h-[80vh] bg-emerald-100/80 grid grid-cols-2 py-10">
            <div className=""></div>
            <div className="w-full lg:col-span-1 col-span-2 space-y-8 border bg-amber-600 p-10 py-15 shadow-xl">
                <div className="text-center mx-auto w-full">
                    <h2 className="text-lg text-black text-center font-black uppercase tracking-widest ">Welcome back</h2>
                    <p className="mt-2 text-sm text-white">Please sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            <label className="ml-2 text-white font-bold">Remember me</label>
                        </div>
                        <Link to="/forgot-password" size="xs" className="border border-black/20 bg-teal-700 font-bold text-white focus:outline-none cursor-pointer p-0.5">Forgot password?</Link>
                    </div>


                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 w-fit flex justify-start border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition`}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                        <p className="text-center text-sm text-white">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-teal-800 hover:text-blue-500">
                                Sign up now
                            </Link>
                        </p>
                        <div className="flex items-center text-sm text-white gap-3">
                            <p>
                                Sign in with
                            </p>
                            <button
                                type="button"
                                onClick={() => window.location.href = 'http://localhost:8000/api/login/google'}
                                className="w-fit flex items-center justify-center p-2 px-3 bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm font-black text-gray-700 uppercase tracking-widest text-xs"
                            >
                                <FcGoogle className="h-6 w-6" />
                            </button>
                        </div>

                    </div>



                </form>


            </div>
        </div>
    );
};

export default Login;
