import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { HiOutlineLockClosed, HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: searchParams.get('email') || '',
        token: searchParams.get('token') || '',
        password: '',
        password_confirmation: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!formData.token || !formData.email) {
            setError('Invalid or missing password reset token.');
        }
    }, [formData.token, formData.email]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await api.post('/reset-password', formData);
            setMessage(res.data.message);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">
                    Set New Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500 font-medium">
                    Please enter your new password below.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-6 shadow-xl rounded-[40px] border border-gray-100 sm:px-12">
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HiOutlineCheckCircle className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900">Success!</h3>
                            <p className="text-gray-500 text-sm font-medium">
                                {message || 'Your password has been reset successfully. Redirecting you to login...'}
                            </p>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold uppercase tracking-widest rounded-r-xl flex items-center">
                                    <HiOutlineExclamationCircle className="mr-2 h-5 w-5" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="appearance-none block w-full pl-12 pr-12 py-4 bg-gray-50 border-transparent rounded-2xl placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 transition font-bold text-gray-900"
                                        placeholder="********"
                                        value={formData.password}
                                        onChange={handleChange}
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

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        name="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        className="appearance-none block w-full pl-12 pr-12 py-4 bg-gray-50 border-transparent rounded-2xl placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 transition font-bold text-gray-900"
                                        placeholder="********"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? <HiOutlineEyeOff className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading || !formData.token}
                                    className="w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-xl shadow-blue-100 text-xs font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
                                >
                                    {loading ? 'Updating...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
