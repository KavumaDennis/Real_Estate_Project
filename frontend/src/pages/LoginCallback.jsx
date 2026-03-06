import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser, api } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (token) {
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Fetch user data
            api.get('/user').then(response => {
                setUser(response.data);
                navigate('/dashboard');
            }).catch(() => {
                navigate('/login?error=auth_failed');
            });
        } else if (error) {
            navigate(`/login?error=${error}`);
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, setUser, api]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Finalizing authentication...</p>
            </div>
        </div>
    );
};

export default LoginCallback;
