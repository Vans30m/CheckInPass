import React, { useContext, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';
import OwnerPinVerification from '../components/OwnerPinVerification';
import { useAppContext } from '../context/AppContext';

const Login = () => {
    const { login } = useContext(AuthContext);
    const { isOwner, setIsOwner } = useAppContext();
    const navigate = useNavigate();
    const [showPinVerification, setShowPinVerification] = useState(false);
    const [pendingUser, setPendingUser] = useState(null);
    const [pendingToken, setPendingToken] = useState(null);

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
                const userRole = data.user?.role || 'user';
                const userIsOwner = userRole === 'hotelOwner';
                setIsOwner(userIsOwner);

                if (userIsOwner) {
                    setPendingUser(data.user);
                    setPendingToken(data.token);
                    setShowPinVerification(true);
                } else {
                    login(data.user, data.token);
                    navigate('/');
                }
            } else {
                console.warn('Backend verification failed, using local Google profile:', data.message);
                const decoded = jwtDecode(token);
                const userIsOwner = decoded.role === 'hotelOwner';
                setIsOwner(userIsOwner);

                if (userIsOwner) {
                    setPendingUser(decoded);
                    setPendingToken(token);
                    setShowPinVerification(true);
                } else {
                    login(decoded, token);
                    navigate('/');
                }
            }
        } catch (error) {
            console.error('Error during Google authentication API call:', error);
            try {
                const decoded = jwtDecode(credentialResponse.credential);
                const userIsOwner = decoded.role === 'hotelOwner';
                setIsOwner(userIsOwner);

                if (userIsOwner) {
                    setPendingUser(decoded);
                    setPendingToken(credentialResponse.credential);
                    setShowPinVerification(true);
                } else {
                    login(decoded, credentialResponse.credential);
                    navigate('/');
                }
            } catch (err) {
                console.error('Failed to decode credential:', err);
            }
        }
    };

    const handleError = () => {
        console.error('Google Sign In Failed');
    };

    const handlePinVerified = () => {
        if (pendingUser && pendingToken) {
            login(pendingUser, pendingToken);
            navigate('/owner');
        }
        setShowPinVerification(false);
        setPendingUser(null);
        setPendingToken(null);
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

            {showPinVerification && (
                <OwnerPinVerification onSuccess={handlePinVerified} onClose={() => setShowPinVerification(false)} />
            )}
        </div>
    );
};

export default Login;