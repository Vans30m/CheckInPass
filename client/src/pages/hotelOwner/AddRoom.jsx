import React, { useState } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-hot-toast'

const AddRoom = () => {

  const { axios, token } = useAppContext();

  {/* initializes a two state variable(images , imputs)  */ }
  const [images, setImages] = useState({
    /* stores upto 4 images as 4 KEYS only and are NULL as nothing is yet updated or uploaded */
    1: null,
    2: null,
    3: null,
    4: null
  })

  {/* initializes inputs state variables and stores user inputs and the values(roomtype, pricepernight, amenities(toggle boxes)) for the room to be added by hotel owner */ }
  const [inputs, setInputs] = useState({
    roomType: '',
    pricePerNight: 0,
    amenities: {
      'Free Wifi': false,
      'Free Breakfast': false,
      'Room Service': false,
      'Mountain View': false,
      'Pool Access': false
    }
  })

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    if(!inputs.roomType || !inputs.pricePerNight || !Object.values(images).some(image => image)) {
      toast.error('Please fill in all required fields and upload at least one image');
      return;
    };
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('roomType', inputs.roomType);
      formData.append('pricePerNight', inputs.pricePerNight);

      const amenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key]);
      formData.append('amenities', JSON.stringify(amenities));

      Object.keys(images).forEach((key) => {
        if (images[key]) {
          formData.append('images', images[key]);
        }
      });

      const { data } = await axios.post('/api/rooms', formData, { headers: { Authorization: `Bearer ${token}` } });

      if (data.success) {
        toast.success(data.message);
        setInputs({
          roomType: '',
          pricePerNight: 0,
          amenities: {
            'Free Wifi': false,
            'Free Breakfast': false, 
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false
          }
        });
        setImages({
          1: null,
          2: null,
          3: null,
          4: null
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} >
      <Title align='left' font='outfit' title='Add Room' subTitle='Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience' />

      {/* ---- Upload Area for Images ---- */}
      <p className='text-gray-800 mt-10' > Images </p>
      <div className='grid grid-cols-2 sm:flex ggap-4 my-2 flex-wrap' >

        {/* loops over 4 keys or images slots and shows the ui for image upload */}
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <img className='max-h-13 cursor-pointer opacity-80' src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt="" />
            <input type="file" acceplt='image/*' id={`roomImage${key}`} hidden onChange={e => setImages({ ...images, [key]: e.target.files[0] })} />
          </label>
        ))}

      </div>

      <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4' >
        <div className='flex-1 max-w-48' >
          <p className='text-gray-800 mt-4' >Room Type</p>
          <select
            /* value is always driven by inputs.roomType from component state */
            value={inputs.roomType}
            /* update roomType in inputs while preserving all other properties in inputs */
            onChange={e => setInputs({ ...inputs, roomType: e.target.value })}
            className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full' >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        <div>
          <p className='text-gray-800 mt-4' >Price <span className='text-xs' >/night</span>
          </p>
          <input type="number" placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-24'
            value={inputs.pricePerNight}
            /* onChange -> takes the value from the input field and updates the inputs state variable */
            onChange={e => setInputs({ ...inputs, pricePerNight: e.target.value })}
          />
        </div>
      </div>

      <p className='text-gray-800 mt-4' >Amenities</p>
      <div className='flex flex-col flex-wrap mt- text-gray-400 max-w-sm' >
        {/* loops over the amenities as per the number of amenities available */}
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={amenity} >

            <input type="checkbox"
              id={`amenities${index + 1}`}
              /* checked={inputs.amenities} -> reflects boolean of current amenity */
              checked={inputs.amenities[amenity]}
              /* onChange -> toggle the boolean of the amenity(true->false) and !inputs.amenities[amenity] -> keeps all other values intact */
              onChange={() => setInputs({ ...inputs, amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] } })} />
            <label htmlFor={`amenities${index + 1}`}> {amenity} </label>
          </div>
        ))}
      </div>

      <button disabled={loading} className='bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer' >
        {loading ? "Adding" : "Add Room"}
      </button>

    </form>
  )
}

export default AddRoom
