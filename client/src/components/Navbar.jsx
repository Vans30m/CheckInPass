import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { AuthContext } from "../context/Auth.jsx"
import { useAppContext } from "../context/AppContext.jsx"

const Navbar = () => {

    const { logout } = useContext(AuthContext);
    const location = useLocation();
    const { user, navigate, isOwner, setShowHotelReg } = useAppContext();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/' },
        { name: 'About', path: '/' },
    ];

    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [showDropdown, setShowDropdown] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 bg-gray-700 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

            {/* Logo */}
            <Link to='/'>
                <img src={assets.logo} alt="logo" className={`w-24 h-auto object-contain ${isScrolled && "invert opacity-80"}`} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <a key={i} href={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}>
                        {link.name}
                        <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                    </a>
                ))}
                {user && (
                    <button className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`}
                        onClick={() => isOwner ? navigate('owner') : setShowHotelReg(true)}
                    >
                        {isOwner ? 'Dashboard' : 'Register Hotel'}
                    </button>
                )}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                <img src={assets.searchIcon}
                    alt="search"        /* if image is not displayed text comes */
                    className={`${isScrolled && "invert"} 
                    h-7 transition-all duration-500`}

                />
                {user ? (
                    <div className="relative ml-4">
                        <img
                            src={user.picture}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            className="h-9 w-9 rounded-full border border-gray-300 cursor-pointer hover:opacity-90 transition-all focus:outline-none"
                            onClick={() => setShowDropdown(!showDropdown)}
                        />
                        {/* Simple Dropdown */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 text-gray-800 text-left">
                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        navigate('/my-bookings');
                                    }}
                                    className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 text-left cursor-pointer"
                                >
                                    My Bookings
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        logout();
                                    }}
                                    className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 text-left cursor-pointer font-medium"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className={`cursor-pointer px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${isScrolled ? "text-white bg-black" : "bg-white text-black"}`}
                    >
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                <img onClick={() => setIsMenuOpen(!isMenuOpen)} /* Listens for a click event on image */
                    src={assets.menuIcon} alt="menu" className={`${isScrolled && "invert"} h-4`} />
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <img src={assets.closeIcon} alt="close-menu" className="h-6.5" />
                </button>

                {navLinks.map((link, i) => (
                    <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                        {link.name}
                    </a>
                ))}

                <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
                    onClick={() => isOwner ? navigate('owner') : setShowHotelReg(true)}
                >
                    {isOwner ? 'Dashboard' : 'Register Hotel'}
                </button>

                {user ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                            <img
                                src={user.picture}
                                alt={user.name}
                                referrerPolicy="no-referrer"
                                className="h-10 w-10 rounded-full border border-gray-300"
                            />
                            <span className="text-gray-800 font-medium">{user.name}</span>
                        </div>
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                navigate('/my-bookings');
                            }}
                            className="text-gray-800 font-medium hover:text-gray-600 transition-all cursor-pointer"
                        >
                            My Bookings
                        </button>
                        <button
                            onClick={() => {
                                logout();
                                setIsMenuOpen(false);
                            }}
                            className="cursor-pointer bg-red-600 text-white px-8 py-2.5 rounded-full transition-all duration-500"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            navigate('/login');
                            setIsMenuOpen(false);
                        }}
                        className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>

    );
}
export default Navbar