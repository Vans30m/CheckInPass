import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { AuthContext } from './Auth.jsx';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || '$';
    const navigate = useNavigate();

    const { user, token } = useContext(AuthContext);

    const [isOwner, setIsOwner] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);
    const [rooms, setRooms] = useState([]);

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get('/api/rooms');
            if (data.success) {
                setRooms(data.rooms);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchUser = async () => {
        if (!token) {
            setIsOwner(false);
            setLoadingUser(false);
            return;
        }
        try {
            setLoadingUser(true);
            const { data } = await axios.get('/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (data.success) {
                setIsOwner(data.role === "hotelOwner");
                setSearchedCities(data.recentSearchedCities || []);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        if (user && token) {
            fetchUser();
        } else {
            setIsOwner(false);
            setLoadingUser(false);
            setSearchedCities([]);
        }
    }, [user, token]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const value = {
        currency,
        navigate,
        user,
        token,
        isOwner,
        setIsOwner,
        loadingUser,
        axios,
        showHotelReg,
        setShowHotelReg,
        searchedCities,
        setSearchedCities,
        rooms,
        setRooms,
        fetchUser,
        fetchRooms
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);