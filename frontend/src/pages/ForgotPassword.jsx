import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await api.post('/forgot-password', { email });
            setMessage(res.data.message);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-8 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/login" className="flex items-center text-sm font-black text-green-600 uppercase tracking-widest hover:text-blue-600 transition mb-8 w-fit mx-auto">
                    <HiArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                </Link>
                <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">
                    Reset Password
                </h2>
                <p className="mt-2 text-center text-sm text-green-600 font-medium">
                    Enter your email to receive a reset link.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-green-600 border border-black/30 relative py-10 px-6 shadow-xl sm:px-12">
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    {submitted ? (
                        <div className="text-center space-y-4 z-10 relative">
                            <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HiOutlineCheckCircle className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900">Link Sent!</h3>
                            <p className="text-gray-500 text-sm font-medium">
                                We've sent a password reset link to <span className="font-bold text-gray-900">{email}</span>. Please check your inbox.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="mt-6 text-blue-600 font-black uppercase text-xs tracking-widest hover:underline"
                            >
                                Didn't receive it? Try again
                            </button>
                        </div>
                    ) : (
                        <form className="space-y-6 z-10 relative" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold uppercase tracking-widest rounded-r-xl">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-[10px] text-start font-black text-black uppercase tracking-widest mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="w-full pl-12 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center relative z-10 py-4 px-6 border border-black/30 text-xs font-black uppercase tracking-widest text-white bg-gray-900 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
                                >
                                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
