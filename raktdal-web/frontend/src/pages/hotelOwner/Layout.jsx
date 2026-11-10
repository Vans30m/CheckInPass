import React, {useEffect, useState} from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext';
import OwnerPinVerification from '../../components/OwnerPinVerification';

const Layout = () => {
    const {isOwner, loadingUser, navigate, user} = useAppContext();
    const routerNavigate = useNavigate();
    const [pinVerified, setPinVerified] = useState(false);
    const [showPinVerification, setShowPinVerification] = useState(false);

    useEffect(() => {
        if(!loadingUser && !isOwner){
            navigate('/');
        }
    }, [isOwner, loadingUser])

    useEffect(() => {
        if (isOwner && user && !loadingUser) {
            const storedPin = localStorage.getItem(`owner_pin_${user._id || user.id || user.email}`);
            if (storedPin) {
                setShowPinVerification(true);
            } else {
                setPinVerified(true);
            }
        }
    }, [isOwner, user, loadingUser]);

    const handlePinVerified = () => {
        setPinVerified(true);
        setShowPinVerification(false);
    };

    if (loadingUser) {
        return (
            <div className='flex items-center justify-center h-screen bg-gray-50'>
                <p className='text-gray-600 font-medium animate-pulse'>Loading Owner Dashboard...</p>
            </div>
        );
    }

    if (!pinVerified && isOwner) {
        return (
            <div className='flex items-center justify-center h-screen bg-gray-50'>
                {showPinVerification && (
                    <OwnerPinVerification onSuccess={handlePinVerified} onClose={() => routerNavigate('/')} />
                )}
            </div>
        );
    }

    return (
        <div className='flex flex-col h-screen bg-slate-50/50 overflow-hidden' >
            <Navbar />
            <div className='flex flex-1 overflow-hidden' >
                <Sidebar />
                <main className='flex-1 p-5 md:p-8 lg:p-10 overflow-y-auto' >
                    <div className='max-w-6xl mx-auto'>
                        <Outlet/>
                    </div>
                </main>
            </div>
        </div>
    )
}
export default Layout