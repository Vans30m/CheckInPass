import React from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx'

const FeaturedDestination = () => {

    const { rooms, navigate } = useAppContext();

    return rooms.length > 0 && (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-6'>
            <Title title="Featured Destinations" subTitle="Discover the world's most breathtaking destinations and find your perfect escape with our curated selection of luxury hotels and resorts." />

            <div className='flex flex-wrap items-center justify-center gap-6 mt-16'>
                {rooms.slice(0, 4) // takes first 4 rooms from the array //
                    .map((room, index) => ( // renders a <HotelCard/> for each of these 4 rooms //
                        <HotelCard key={room._id} room={room} index={index} /> // key -> unique react key; room={room} -> full room object as prop //
                    ))
                }
            </div>
            {/* navigate('/rooms') -> navigates to /rooms page and then, scrollTo(0,0) -> scrolls to top of the page */}
            <button onClick={() => { navigate('/rooms'); scrollTo(0, 0) }} className='mt-10 px-6 py-2.5 text-sm font-medium border border-gray-300 rounded-full bg-white hover:bg-gray-100 transition-all cursor-pointer shadow-xs' >
                View All Destinations
            </button>
        </div>
    )
}

export default FeaturedDestination