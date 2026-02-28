import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] grid grid-cols-2 bg-gray-50 py-10">
            <div className=""></div>
            <div className="w-full space-y-8 border bg-amber-600 p-10 py-15 shadow-xl">
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
                            <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <label className="ml-2 text-gray-700">Remember me</label>
                        </div>
                        <a href="#" className="border border-black/20 bg-teal-700 font-bold text-white focus:outline-none cursor-pointer p-0.5">Forgot password?</a>
                    </div>


                    <div className="flex gap-5 items-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 w-fit flex justify-start border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition`}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                        <p className="text-center text-sm text-white">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500">
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </form>


            </div>
        </div>
    );
};

export default Login;
