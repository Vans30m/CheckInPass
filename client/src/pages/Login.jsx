import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

            const response = await fetch(`${backendUrl}/api/user/google-auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (data.success) {
                login(data.user, data.token);
                navigate('/');
            } else {
                console.warn('Backend verification failed, using local Google profile:', data.message);
                const decoded = jwtDecode(token);
                login(decoded, token);
                navigate('/');
            }
        } catch (error) {
            console.error('Error during Google authentication API call:', error);
            // Fallback to client-side decoded profile if server is unavailable
            try {
                const decoded = jwtDecode(credentialResponse.credential);
                login(decoded, credentialResponse.credential);
                navigate('/');
            } catch (err) {
                console.error('Failed to decode credential:', err);
            }
        }
    };

    const handleError = () => {
        console.error('Google Sign In Failed');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-900 via-gray-900 to-black px-4">
            <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-300 mb-8 text-sm">Securely log in to CheckInPass using Google</p>

                <div className="flex justify-center items-center py-4 bg-white/5 rounded-lg border border-white/10 mb-6">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        theme="filled_blue"
                        shape="pill"
                    />
                </div>

                <p className="text-xs text-gray-500">
                    By signing in, you agree to our Terms of Service & Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default Login;