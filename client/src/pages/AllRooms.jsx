import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets, roomsDummyData, facilityIcons } from '../assets/assets.js'
import StarRating from '../components/StarRating.jsx'

const CheckBox = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm" >
            <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
            <span className='font-light select-none' >{label}</span>
        </label>
    )
}

const RadioButton = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm" >
            <input type="radio" name="sortOption" checked={selected} onChange={(e) => onChange(label)} />
            <span className='font-light select-none' >{label}</span>
        </label>
    )
}

const AllRooms = () => {
    const navigate = useNavigate();
    const [openFilters, setOpenFilters] = useState(false);

    const roomTypes = [
        "Single Bed",
        "Double Bed",
        "Luxury Room",
        "Family Suite"
    ];
    const priceRanges = [
        '0 to 500',
        '500 to 1000',
        '1000 to 2000',
        '2000 to 4000'
    ];
    const sortOptions = [
        "Price Low to High",
        "Pricce Hoght to Low",
        "Newest First"
    ];

    return (
        <div className='pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            {/* Header at the top */}
            <div className='flex flex-col items-start text-left mb-8'>
                <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
                <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>
                    Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
                </p>
            </div>

            {/* Layout Container: Rooms on Left/Center, Filters on Right */}
            <div className='flex flex-col lg:flex-row gap-8 items-start'>
                {/* Rooms List Container */}
                <div className='flex flex-col w-full flex-1 order-2 lg:order-1'>
                    {/* .map -> array method that loops through each element in roomsDummyData array ; only returns room */}
                    {roomsDummyData.map((room) => (
                        /* whenever .map() is used a special key property is used to uniquely identify the data(rooms data) taken from array */
                        <div key={room._id} className='flex flex-col md:flex-row items-start py-6 gap-6 border-b border-gray-300 last:pb-0 last:border-0'>
                            {/* img tag -> used to display the image of the room ; onClick event -> used to navigate to the room details page */}
                            <img
                                onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}      /* scrollTo(0,0) -> scrolls to the top of the room._id page */
                                src={room.images[0]}
                                alt="hotel-image"
                                title='View Room Details' // when user hovers over image it displays "View Room Details" in a small bubble
                                className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer' />
                            {/* div tag -> used to display the details of the room */}
                            <div className='w-full md:w-1/2 cursor-pointer'>
                                {/* {room.hotel.city} -> used to display the city of the room from array of roomsDummyData */}
                                <p className='text-gray-500 text-sm'>{room.hotel.city}</p>
                                <p onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}
                                    className='text-gray-800 text-2xl font-playfair font-semibold cursor-pointer'>{room.hotel.name}</p>

                                <div className='flex items-center mt-1'>
                                    {/* room.rating -> take from array roomsDummyData and if empty/null/undefined/0 then 4 is shown */}
                                    <StarRating rating={room.rating || 4} />
                                    <p className='ml-2 text-xs text-gray-500'>200+ reviews</p>
                                </div>

                                <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                                    <img src={assets.locationIcon} alt="location-icon" className='h-4' />
                                    <span>{room.hotel.address}</span>
                                </div>

                                <div className='flex flex-wrap items-center mt-3 mb-4 gap-2'>
                                    {/* room.amenities.map -> take from array roomsDummyData and loop through each element ; (item, index) -> item is value and index is position of value */}
                                    {room.amenities.map((item, index) => (
                                        /* key={index} -> used to uniquely identify the data(amenities) taken from array of roomsDummyData */
                                        <div key={index} className='flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F5F5FF]/70'>
                                            {/* facilityIcons[item] -> looks for image of amenity using (name of amenity=item) value as a key from array facilityIcons */}
                                            <img src={facilityIcons[item]} alt={item} className='w-4 h-4' />
                                            <p className='text-xs text-gray-600'>{item}</p>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <p className='text-xl font-medium text-gray-700'>${room.pricePerNight} <span className='text-sm font-normal text-gray-500'>/Night</span></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar / Filters on Right */}
                <div className='bg-white w-full lg:w-72 shrink-0 border border-gray-300 rounded-lg text-gray-600 mb-6 lg:mb-0 order-1 lg:order-2'>
                    {/* openFilters -> toggles open and close when clicked */}
                    <div className={`flex items-center justify-between px-5 py-3 border-gray-300 ${openFilters ? "border-b" : "lg:border-b"}`}>
                        <p className='text-base font-medium text-gray-800'>FILTERS</p>
                        <div className='text-xs cursor-pointer'>
                            {/* !openFilters -> not for large screen ONLY for mobile screens to show and hide the filters section */}
                            <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden font-medium text-blue-600'>
                                {openFilters ? 'HIDE' : 'SHOW'}     {/* 'HIDE' is hown when filter is open and 'SHOW' when filter is closed */}
                            </span>
                        </div>
                    </div>

                    {/* Filter Options Content */}
                    {/* openFilters ? "h-auto" : "h-0 lg:h-auto" -> for large screen it is always visible and for mobile screen it is visible when openFilters is true and hidden when openFilters is false */}
                    <div className={`${openFilters ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`} >
                        <div className='px-5 pt-5' >
                            <p className='font-medium text-gray-800 pb-2' >Popular Filters</p>
                            {/* array of roomType is mapped and CheckBox component is rendered for each roomType in the array*/}
                            {roomTypes.map((room, index) => (
                            /* in which key is index of roomType and label gives name of roomType */
                                <CheckBox key={index} label={room} />
                            ))}
                        </div>
                        <div className='px-5 pt-5' >
                            <p className='font-medium text-gray-800 pb-2' >Price Range</p>
                            {priceRanges.map((price, index) => (
                                <CheckBox key={index} label={"$" + price} />
                            ))}
                        </div>
                        <div className='px-5 pt-5 pb-7' >
                            <p className='font-medium text-gray-800 pb-2' >Sort By</p>
                            {sortOptions.map((option, index) => (
                                <RadioButton key={index} label={option} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AllRooms