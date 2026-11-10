import React, { useState } from 'react'
import { assets, cities } from '../assets/assets.js'
import { useAppContext } from '../context/AppContext.jsx'

const Hero = () => {

    const { navigate, token, axios, setSearchedCities } = useAppContext();
    const [destination, setDestination] = useState("");
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");

    const todayDate = new Date().toISOString().split('T')[0];

    const onSearch = async(e) => {
        {/* prevents reload after submission */}
        e.preventDefault();

        {/* redirects to room page with query param(destination name) */}
        navigate(`/rooms?destination=${destination}`);

        {/* call api to save recent searched cities;
        saves search to backend with auth header
        */}
        if (token && destination) {
            try {
                await axios.post('/api/user/store-recent-search', { recentSearchedCity: destination }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (err) {
                console.error("Error storing search city:", err);
            }
        }

        {/* add destination to searchedCities; max. 3 recent searched cities;
        updates local recent searched with max. 3 and uses FIFO with shift()
        */}
        if (destination) {
            setSearchedCities((prevSearchedCities) => {
                const updatedSearchedCities = [ ...prevSearchedCities, destination ];
                if(updatedSearchedCities.length > 3) {
                    updatedSearchedCities.shift();
                }
                return updatedSearchedCities;
            });
        }
    }

    return (
        <div className='relative flex flex-col items-center justify-center min-h-screen text-center text-white px-6 md:px-16 lg:px-32 xl:px-32 overflow-hidden'>
            <video
                autoPlay
                loop
                muted
                playsInline
                className='absolute top-0 left-0 w-full h-full object-cover -z-10'
            >
                <source src={assets.heroVideo} type="video/mp4" />
            </video>
            <div className='absolute top-0 left-0 w-full h-full bg-black/30 -z-10' />

            <p className='bg-[#49B9FF]/75 px-3.5 py-1 rounded-full mt-20 text-gray-700 font-medium' >
                The Ultimate Hotel Experience
            </p>
            <h1 className='font-playfair text-2xl text-white md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-2xl mt-4 text-center' >
                Discover Your Perfect <br />
                Gateway Destination
            </h1>
            <p className='max-w-xl mt-2 text-sm text-gray-200 text-center' >
                Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.
            </p>

            <form onSubmit={onSearch} className='bg-gray-100 opacity-95 text-gray-500 rounded-xl px-6 py-4 mt-8 flex flex-col md:flex-row flex-wrap items-stretch md:items-end justify-center gap-4 md:gap-6 shadow-lg max-w-full text-left mb-10'>

                <div className='flex flex-col items-start'>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt='calendar' className='h-4' />
                        <label htmlFor="destinationInput" className='text-sm font-medium'>Destination</label>
                    </div>

                    {/*  User types → onChange fires → setDestination updates state → value reflects new state → input re-renders with new text */}
                    <input onChange={e => setDestination(e.target.value)} value={destination} id="destinationInput" list="destinations" type="text" placeholder="Where to?" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full md:w-auto" />
                    
                    <datalist id='destinations' > {/* container for suggestions linked to input via destinations */}
                        {cities.map((city, index) => (
                            <option value={city} key={index} />
                        ))}
                    </datalist>
                </div>

                <div className='flex flex-col items-start'>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="checkindate" className='h-4' />
                        <label htmlFor="checkIn" className='text-sm font-medium'>Check in</label>
                    </div>
                    <input id="checkIn" type="date" min={todayDate} value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full md:w-auto" />
                </div>

                <div className='flex flex-col items-start'>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt='checkoutdate' className='h-4' />
                        <label htmlFor="checkOut" className='text-sm font-medium'>Check out</label>
                    </div>
                    <input id="checkOut" type="date" min={checkInDate || todayDate} value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full md:w-auto" />
                </div>

                <div className='flex flex-col items-start'>
                    <div className='flex items-center gap-2'>
                        <img src={assets.guestsIcon} alt='guests' className='h-4' />
                        <label htmlFor="guests" className="text-sm font-medium">Guests</label>
                    </div>
                    <input min={1} max={10} id="guests" type="number" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full md:w-20" placeholder="1" />
                </div>

                <button className='flex items-center justify-center gap-2 rounded-lg bg-black hover:bg-gray-800 transition-colors py-2 px-5 text-white cursor-pointer w-full md:w-auto self-stretch md:self-end h-[34px] mt-2 md:mt-0 whitespace-nowrap' >
                    <img src={assets.searchIcon} alt='search' className='h-4 invert' />
                    <span>Search</span>
                </button>
            </form>
        </div>
    )
}

export default Hero