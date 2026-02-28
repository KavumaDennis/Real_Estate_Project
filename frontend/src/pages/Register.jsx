import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

        <div className="min-h-[80vh] grid grid-cols-2 bg-gray-50 py-10">
            <div className=""></div>
            <div className="w-full space-y-8 border bg-amber-600 p-10 py-15 shadow-xl">
                <div className="text-center">
                    <h2 className="text-lg text-black text-center font-black uppercase tracking-widest ">Create Account</h2>
                    <p className="mt-2 text-sm text-white">Join our community of property seekers and agents</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Password</label>
                            <input
                                type="password"
                                className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Confirm Password</label>
                            <input
                                type="password"
                                className="w-full bg-gray-50 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                placeholder="••••••••"
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">I am an:</label>
                        <div className="flex gap-4">
                            <label className={`w-full text-black/70 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold placeholder-black/70 ${formData.role === 'user' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-gray-50'}`}>
                                <input type="radio" value="user" className="hidden" checked={formData.role === 'user'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                                Member (User)
                            </label>
                            <label className={`w-full text-black/70 border border-black/80 p-2 pr-4 focus:ring-0 text-sm font-bold placeholder-black/70 ${formData.role === 'agent' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-gray-50'}`}>
                                <input type="radio" value="agent" className="hidden" checked={formData.role === 'agent'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                                Listing Agent
                            </label>
                        </div>
                    </div>


                    <div className="flex items-center gap-5">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 w-fit flex justify-start border border-black/10 bg-teal-700 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg  ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                        <p className="text-center text-sm text-white">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>


            </div>
        </div>
    );
};

export default Register;
