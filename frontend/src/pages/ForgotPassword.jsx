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
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/login" className="flex items-center text-sm font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition mb-8 w-fit mx-auto">
                    <HiArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                </Link>
                <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">
                    Reset Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500 font-medium">
                    Enter your email to receive a reset link.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-6 shadow-xl rounded-[40px] border border-gray-100 sm:px-12">
                    {submitted ? (
                        <div className="text-center space-y-4">
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
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold uppercase tracking-widest rounded-r-xl">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2">
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
                                        className="appearance-none block w-full pl-12 pr-6 py-4 bg-gray-50 border-transparent rounded-2xl placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 transition font-bold text-gray-900"
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
                                    className="w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-xl shadow-blue-100 text-xs font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
                                >
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
