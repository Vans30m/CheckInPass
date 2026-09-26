import React, {useEffect} from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
    const {isOwner, loadingUser, navigate} = useAppContext();

    useEffect(() => {
        {/* If user data finished loading and user is not an owner, redirect them to the home page */}
        if(!loadingUser && !isOwner){
            navigate('/');
        }
    }, [isOwner, loadingUser])

    if (loadingUser) {
        return (
            <div className='flex items-center justify-center h-screen bg-gray-50'>
                <p className='text-gray-600 font-medium animate-pulse'>Loading Owner Dashboard...</p>
            </div>
        );
    }

    return (
        <div className='flex flex-col h-screen' >
            <Navbar />
            <div className='flex h-full' >
                <Sidebar />
                {/* Outlet -> acts as a placeholder for nested routes to render inside parent layout */}
                {/* instead of repeating navbar and sidebar in every page we defined in layout.jsx and used by outlet to render */}
                <div className='flex-1 p-4 pt-10 md:px-10 h-full' >
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}
export default Layout