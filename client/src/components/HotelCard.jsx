import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const HotelCard = ({ room, index }) => {
    return (
        /* to={} -> navigates to room detail page 
        onClick = {() => scrollTo(0,0)} -> scrolls to top on click */
        <Link to={`/rooms/${room._id}`} onClick={() => scrollTo(0, 0)} key={room._id} className='relative group block max-w-70 w-full rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-100/80 cursor-pointer'>
            <div className='relative overflow-hidden rounded-t-2xl aspect-[4/3]'>
                <img src={room.images[0]} alt={room.name} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
                {index % 2 === 0 && <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full shadow-sm z-10' >Best Seller</p>}
            </div>

            <div className='p-4'>
                <h2 className='text-lg font-medium text-gray-800 transition-colors duration-300 group-hover:text-blue-600'>{room.name}</h2>

                <div className='flex items-center justify-between mt-1'>
                    <p className='font-playfair text-base font-medium text-gray-600' >{room.hotel.name}</p>

                    <div className='flex items-center gap-1 text-sm text-gray-600' >
                        <img src={assets.starIconFilled} alt="rating" className='h-4' /> 4.5
                    </div>
                </div>

                <div className='flex items-center gap-1 text-sm text-gray-500 mt-1'>
                    <img src={assets.locationIcon} alt="location-icon" className='h-4' />
                    <span className='truncate'>{room.hotel.address}</span>
                </div>

                <div className='flex items-center justify-between mt-4' >
                    <p className='text-gray-500'> <span className='text-xl font-semibold text-gray-800' >${room.pricePerNight}</span> /night</p>
                    <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg cursor-pointer hover:bg-black hover:text-white hover:border-black transition-all duration-300'>
                        Book Now
                    </button>
                </div>

            </div>
        </Link>
    )
}

export default HotelCard