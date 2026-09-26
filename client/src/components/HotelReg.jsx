import React, {useState} from 'react'
import { assets, cities } from '../assets/assets.js'
import { useAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'

const HotelReg = () => {

    {/* setShowHotelReg -> function to update hotel registration visiblity state 
    axios -> instances 
    token -> jwt authentication token from google oauth
    setIsOwner -> function to update owner status
    */}
    const {setShowHotelReg, axios, token, setIsOwner, fetchUser, navigate} = useAppContext();

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [city, setCity] = useState("");

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            if (!token) {
                toast.error("Please log in first to register your hotel");
                setShowHotelReg(false);
                navigate('/login');
                return;
            }

            if (!city) {
                toast.error("Please select a city");
                return;
            }

            const {data} = await axios.post('/api/hotels', {name, contact, address, city}, 
            {headers: {Authorization: `Bearer ${token}`}});

            if(data.success){
                toast.success(data.message);
                setIsOwner(true);
                setShowHotelReg(false);
                if (fetchUser) await fetchUser();
                navigate('/owner');
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
            /* Fixed Position -> Keeps the element in the same position even when the user scrolls */
            /* inset-0 -> top: 0px, right: 0px, bottom: 0px, left: 0px  (It covers the entire browser screen) */
            /* z-100 -> this ensures that the modal overlay sits safely above other elements onthe page */
            /* absolute -> positions the elements relative to the nearest parent container */
        <div onClick={() => setShowHotelReg(false)} className='fixed inset-0 z-[100] flex items-center justify-center bg-black/70' >

            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation() } className='flex bg-white rounded-2xl max-w-4xl w-full mx-4 overflow-hidden relative'>
                {/* Left Side: Image */}
                <img src={assets.regImage} alt="reg-image" className='hidden md:block w-1/2 object-cover' />

                {/* Right Side: Form Content */}
                <div className='relative flex flex-col items-center w-full md:w-1/2 p-8 md:p-10' >
                    <img src={assets.closeIcon} alt="close-icon" className='absolute top-4 right-4 h-4 w-4 cursor-pointer' 
                    onClick = {() => setShowHotelReg(false)}
                    />
                    <p className='text-2xl font-semibold mt-6' > Register Your Hotel </p>
                    
                    {/* Hotel Name */}
                    <div className='w-full mt-4' >
                        <label htmlFor="name" className='font-medium text-gray-500'>
                            Hotel Name
                        </label>
                        {/* type="text" -> single line text input 
                        value={name} -> 
                        onChange -> name is change to new value
                        */}
                        <input id="name" onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Type Here" className='w-full border border-gray-200 rounded-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>
                    {/* Phone Number */}
                    <div className='w-full mt-4' >
                        <label htmlFor="contact" className='font-medium text-gray-500'>
                            Phone Number
                        </label>
                        <input id='contact' onChange={(e) => setContact(e.target.value)} value={contact} type="text" placeholder="Type Here" className='w-full border border-gray-200 rounded-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>
                    {/* Address */}
                    <div className='w-full mt-4' >
                        <label htmlFor="address" className='font-medium text-gray-500'>
                            Address
                        </label>
                        <input id='address' onChange={(e) => setAddress(e.target.value)} value={address} type="text" placeholder="Type Here" className='w-full border border-gray-200 rounded-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>

                    {/* Select City Drop Down */}
                    <div className='w-full mt-4' >
                        <label htmlFor="city" className='font-medium text-gray-500' > City </label>
                        {/* event listener triggers whenever user chooses a different option in the dropdown */
                        /* e -> systhetic event object */
                        /* e.target.value -> extracts the value of newly selected option */
                        /* setCity() -> updates the state variable 'city' with the newly selected option */
                        /* value={city} -> controls the selected value */
                        /* map() -> iterates over the array */
                        /* key={city} -> provides unique key for each option */
                        /* value={city} -> sets the value of each option */
                        }
                        <select id="city" onChange={(e) => setCity(e.target.value)} value={city} className='w-full border border-gray-200 rounded-full px-3 py-2.5 mt-1 outline-indigo-500 font-light bg-white' required>
                            <option value=""> Select City </option>
                            {cities.map((city) =>(
                                <option key={city} value={city} >
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className='bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6'>
                            Register
                    </button>

                </div>

            </form>

        </div>
    )
}
export default HotelReg