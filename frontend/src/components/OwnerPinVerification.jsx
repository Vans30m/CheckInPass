import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/Auth';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const OwnerPinVerification = ({ onSuccess, onClose }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isSetup, setIsSetup] = useState(false);
    const [confirmPin, setConfirmPin] = useState('');
    const { user, token } = useContext(AuthContext);
    const { isOwner, navigate, axios } = useAppContext();
    const routerNavigate = useNavigate();

    useEffect(() => {
        if (isOwner && user) {
            const storedPin = localStorage.getItem(`owner_pin_${user._id || user.id || user.email}`);
            setIsSetup(!storedPin);
        }
    }, [isOwner, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isSetup) {
            if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
                setError('PIN must be 6 digits');
                return;
            }
            if (pin !== confirmPin) {
                setError('PINs do not match');
                return;
            }
            localStorage.setItem(`owner_pin_${user._id || user.id || user.email}`, pin);
            onSuccess?.();
            return;
        }

        const storedPin = localStorage.getItem(`owner_pin_${user._id || user.id || user.email}`);
        if (pin !== storedPin) {
            setError('Invalid PIN');
            return;
        }
        onSuccess?.();
    };

    const handleForgotPin = async () => {
        const newPin = prompt('Enter new 6-digit PIN:');
        if (newPin && newPin.length === 6 && /^\d{6}$/.test(newPin)) {
            const confirmNewPin = prompt('Confirm new 6-digit PIN:');
            if (newPin === confirmNewPin) {
                localStorage.setItem(`owner_pin_${user._id || user.id || user.email}`, newPin);
                setPin('');
                setError('PIN reset successful');
            } else {
                alert('PINs do not match');
            }
        } else if (newPin) {
            alert('PIN must be 6 digits');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isSetup ? 'Set Up Owner PIN' : 'Enter Owner PIN'}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {isSetup
                            ? 'Create a 6-digit PIN to secure your owner dashboard'
                            : 'Enter your 6-digit PIN to access the owner dashboard'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isSetup ? 'New PIN' : 'PIN'}
                        </label>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            maxLength={6}
                            placeholder="••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest font-mono"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete="off"
                            required
                        />
                    </div>

                    {isSetup && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm PIN
                            </label>
                            <input
                                type="password"
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(e.target.value)}
                                maxLength={6}
                                placeholder="••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest font-mono"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="off"
                                required
                            />
                        </div>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {isSetup ? 'Create PIN' : 'Verify PIN'}
                    </button>

                    {!isSetup && (
                        <button
                            type="button"
                            onClick={handleForgotPin}
                            className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Forgot PIN?
                        </button>
                    )}
                </form>

                <p className="mt-6 text-center text-xs text-gray-400">
                    This PIN is stored locally on this device only.
                </p>
            </div>
        </div>
    );
};

export default OwnerPinVerification;