import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets.js';
import { AuthContext } from '../../context/Auth.jsx';
import { useAppContext } from '../../context/AppContext.jsx';

const Navbar = () => {
    const { logout } = useContext(AuthContext);
    const { user } = useAppContext();
    const navigate = useNavigate();

    return (
        <header className='relative flex items-center justify-between px-6 md:px-10 border-b border-gray-200 py-3.5 bg-white shrink-0 sticky top-0 z-30 shadow-xs'>
            {/* Left: Brand Logo */}
            <div className="flex items-center">
                <Link to='/'>
                    <img src={assets.logo} alt="CheckInPass" className='w-24 h-auto object-contain invert opacity-90 hover:opacity-100 transition-opacity' />
                </Link>
            </div>

            {/* Center: Host Portal Title */}
            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
                <span className="font-playfair text-base sm:text-lg font-bold text-gray-900 tracking-wide">
                    Host Portal
                </span>
            </div>

            {/* Right: Quick link back to site & User profile info */}
            <div className="flex items-center gap-4 sm:gap-6">
                <Link 
                    to="/" 
                    className="text-xs sm:text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                    ← Back to Website
                </Link>

                {user && (
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        {user.picture ? (
                            <img 
                                src={user.picture} 
                                alt={user.name} 
                                className="w-8 h-8 rounded-full border border-gray-200 object-cover" 
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                                {user.name?.[0] || 'O'}
                            </div>
                        )}
                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-semibold text-gray-900 leading-tight truncate max-w-32">
                                {user.name || user.username}
                            </p>
                            <p className="text-[10px] text-gray-400">Hotel Partner</p>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                            className="text-xs text-red-600 hover:text-red-700 font-medium ml-2 cursor-pointer transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;