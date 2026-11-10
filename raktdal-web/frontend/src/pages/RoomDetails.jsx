import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData } from '../assets/assets.js'
import StarRating from '../components/StarRating.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'

const RoomDetails = () => {
    const { id } = useParams();    /* Extracts the dynamic URL */
    const { rooms, axios, navigate, token } = useAppContext();
    const [room, setRoom] = useState(null)
    const [mainImage, setMainImage] = useState(null)

    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [guests, setGuests] = useState(1);
    const [isAvailable, setIsAvailable] = useState(false);

    const todayDate = new Date().toISOString().split('T')[0];

    {/* check if the room is available */}
    const checkAvailability = async () => {
        try {
            if(!checkInDate || !checkOutDate){
                toast.error('Please select both Check-In and Check-Out dates');
                return;
            }
            if(checkInDate < todayDate){
                toast.error('Check-In date cannot be in the past');
                return;
            }
            if(checkInDate >= checkOutDate){
                toast.error('Check-Out date must be after Check-In date');
                return;
            }
            const {data} = await axios.post('/api/bookings/checkAvailability',
                {
                    roomId: id,
                    checkInDate,
                    checkOutDate,
                    guests
                })
                if(data.success){
                    if(data.isAvailable){
                        setIsAvailable(true);
                        toast.success('Room is available');
                    }else{
                        setIsAvailable(false);
                        toast.error('Room is not available');
                    }
                }
                else{
                    toast.error(data.message);
                }
        } catch (error) {
            toast.error(error.message);
        }
    }

    {/*onSubmit handler function to check availability and book the room */}
    const onSubmitHandler = async (e) =>{
        try {
            e.preventDefault();
            if(!isAvailable){
                await checkAvailability();
                return;
            }
            else{
                const {data} = await axios.post('/api/bookings/book', {room: id, checkInDate, checkOutDate, guests, paymentMethod: "Pay at hotel"}, {headers: {Authorization: `Bearer ${token}`}});
                if(data.success){
                    toast.success('Room booked successfully');
                    navigate('/my-bookings');
                    scrollTo(0,0);
                }
                else{
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        const foundRoom = rooms.find(room => room._id === id)
        if (foundRoom) {
            setRoom(foundRoom);
            if (foundRoom.images && foundRoom.images.length > 0) {
                setMainImage(foundRoom.images[0]);
            }
        }
    }, [rooms, id])

    /* when room data will be available then only it will render */
    return room && (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 bg-color-white' >
            {/* Room Details */}
            <div className='flex flex-col md:flex-row item-start md:items-center gap-2' >
                <h1 className='text-3xl md:text-4xl font-playfair' >{room.hotel.name}
                    <span className='font-inter text-sm' >({room.roomType})</span>
                </h1>
                <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full' >20% OFF</p>
            </div>

            {/* Room Rating and Review */}
            <div className='flex items-center gap-1 mt-2' >
                <StarRating />
                <p>200+ reviews</p>
            </div>

            {/* Room Address */}
            <div className='flex items-center gap-1 text-gray-500 mt-2'>
                <img src={assets.locationIcon} alt="location-icon" className='w-4 h-4' />
                <span> {room.hotel.address} </span>
            </div>

            {/* Room Images */}
            <div className='flex flex-col lg:flex-row mt-6 gap-6' >
                <div className='lg:w-1/2 w-full' >
                    <img src={mainImage} alt="room-image" className='w-full rounded-xl shadow-lg object-cover' />
                </div>

                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full' >
                    {/* {} -> opens JavaScript expression inside a rect file */}
                    {/* ?. -> safely checks ir room and room.images exists */}
                    {room?.images.length > 1 && room.images.map((image, index) => (
                        <img onClick={() => setMainImage(image)}    // when user clicks it calls setMainImage(image) and updates the image variable
                            key={index}
                            src={image}     // unique key property for react when rendering list of items
                            alt='room-image'
                            className={`w-full rounded-xl shadow-md object-cover cursor-pointer 
                        ${mainImage === image ? 'outline-3 outline-orange-500' : ''}`}
                        />
                    ))}
                </div>
            </div>

            {/* Room Highlights */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10' >
                <div className='flex flex-col' >
                    <h1 className='text-3xl md:text-4xl font-playfair' > Experience Luxury Like Never Before</h1>
                    {/* flex-wrap -> on single row and shrinks if there is no space to fit all items */}
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4' >
                        {room.amenities.map((item, index) =>
                            /* items-center -> centers items vertically and horizontally */
                            <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100' >
                                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                <p className='text-xs' >{item}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Room Price */}
                <p>${room.pricePerNight}/night</p>
            </div>

            {/* CheckIn and CheckOut Form */}
            <form onSubmit={onSubmitHandler} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500' >
                    <div className='flex flex-col' >
                        <label htmlFor="checkInDate" className='font-medium' >Check-In</label>
                        <input onChange={(e) => setCheckInDate(e.target.value)} value={checkInDate} min={todayDate} type="date" id='checkInDate' placeholder='Check-In' className='w-full rounded border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>
                </div>

                <div className='w-px h-15 bg-gray-300 max-md:hidden' ></div>

                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500' >
                    <div className='flex flex-col' >
                        <label htmlFor="checkOutDate" className='font-medium' >Check-Out</label>
                        <input onChange={(e) => setCheckOutDate(e.target.value)} value={checkOutDate} min={checkInDate || todayDate} disabled={!checkInDate} type="date" id='checkOutDate' placeholder='Check-Out' className='w-full rounded border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>
                </div>

                <div className='w-px h-15 bg-gray-300 max-md:hidden' ></div>

                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500' >
                    <div className='flex flex-col' >
                        <label htmlFor="guests" className='font-medium' >Guests</label>
                        <input onChange={(e) => setGuests(e.target.value)} value={guests} type="number" id='guests' placeholder='1' className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none text-center' required />
                    </div>
                </div>

                {/* active:scale-95 -> Click or Press effect animation as scale-95 shrinks the button size to 95% of the original size */}
                <button type='submit' className='bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-15 py-3 md:py-3 md:py-4 text-base cursor-pointer'>
                    {isAvailable ? "Book Now" : "Check Availability"}
                </button>

            </form>

            {/* Common Specifications */}
            <div className='mt-25 space-y-4' >
                {roomCommonData.map((spec, index) => (
                    <div key={index} className='flex items-start gap-2' >
                        <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5' />

                        <div>
                            {/* text-base -> deault font size of 16px(1rem) */}
                            <p className='text-base' >{spec.title}</p>
                            <p className='text-gray-500' >{spec.description}</p>
                        </div>

                    </div>
                ))}
            </div>

            <div className='max--w-3xl border-y border-gray-300 my-15 py-10 text-gray-500' >
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam voluptate, ipsum harum, unde nihil praesentium recusandae quo sint aspernatur iure error! Maxime nesciunt consequatur a ipsum, error hic. Facilis suscipit, voluptates beatae culpa reprehenderit quam asperiores voluptate qui. Consequuntur aspernatur nobis ut suscipit modi molestias quaerat praesentium excepturi eum tempora!</p>
            </div>

            {/* Hosted by */}
            <div className='flex flex-col items-start gap-4' >
                <div className='flex items-center gap-4' >
                    <img src={room.hotel.owner.image} alt="Host" className='h-14 w-14 md:h-18 md:w-18 rounded-full' />
                    <div>
                        <p className='text-lg md:text-xl' >Hosted by {room.hotel.name}</p>
                        <div className='flex items-center mt-1' >
                            <StarRating />
                            <p className='ml-2' >200+ reviews</p>
                        </div>
                    </div>
                </div>

                <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer' > Contact Now </button>

            </div>

        </div>
    )
}

export default RoomDetails;