import React, { useState } from 'react';
import Title from '../../components/Title';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-hot-toast';

const AddRoom = () => {
  const { axios, token, currency = '$' } = useAppContext();

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null
  });

  const [inputs, setInputs] = useState({
    roomType: '',
    city: '',
    pricePerNight: '',
    amenities: {
      'Free Wifi': false,
      'Free Breakfast': false,
      'Room Service': false,
      'Mountain View': false,
      'Pool Access': false
    }
  });

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!inputs.roomType || !inputs.pricePerNight || !Object.values(images).some(image => image)) {
      toast.error('Please fill in room type, price per night, and upload at least one image');
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('roomType', inputs.roomType);
      formData.append('pricePerNight', inputs.pricePerNight);
      if (inputs.city) {
        formData.append('city', inputs.city);
      }

      const amenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key]);
      formData.append('amenities', JSON.stringify(amenities));

      Object.keys(images).forEach((key) => {
        if (images[key]) {
          formData.append('images', images[key]);
        }
      });

      const { data } = await axios.post('/api/rooms', formData, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (data.success) {
        toast.success(data.message);
        setInputs({
          roomType: '',
          city: '',
          pricePerNight: '',
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
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-gray-200/80 pb-5">
        <h1 className="font-playfair text-3xl font-bold text-gray-900 tracking-tight">
          Add New Room
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Provide room specifications, location, amenities, and photos to list on the marketplace.
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 md:p-8 space-y-6">
        {/* Upload Area for Images */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
            Room Photos (Upload up to 4) *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.keys(images).map((key) => (
              <label 
                htmlFor={`roomImage${key}`} 
                key={key}
                className="relative border-2 border-dashed border-gray-300 hover:border-gray-500 rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden bg-gray-50/50"
              >
                {images[key] ? (
                  <img 
                    src={URL.createObjectURL(images[key])} 
                    alt={`Preview ${key}`} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-gray-400 p-2 text-center">
                    <img src={assets.uploadArea} alt="Upload" className="w-8 h-8 opacity-60" />
                    <span className="text-[11px] font-medium">Slot {key}</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  id={`roomImage${key}`} 
                  hidden 
                  onChange={e => setImages({ ...images, [key]: e.target.files[0] })} 
                />
              </label>
            ))}
          </div>
        </div>

        {/* Room Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Room Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
              Room Type *
            </label>
            <select
              required
              value={inputs.roomType}
              onChange={e => setInputs({ ...inputs, roomType: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:border-black transition-colors"
            >
              <option value="">Select Room Type</option>
              <option value="Single Bed">Single Bed</option>
              <option value="Double Bed">Double Bed</option>
              <option value="Luxury Room">Luxury Room</option>
              <option value="Family Suite">Family Suite</option>
            </select>
          </div>

          {/* City / Location (Requested Feature) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
              City / Location
            </label>
            <input
              type="text"
              placeholder="e.g. New York, Paris, Dubai"
              value={inputs.city}
              onChange={e => setInputs({ ...inputs, city: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Price per night */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
              Price / Night ({currency}) *
            </label>
            <input
              type="number"
              required
              placeholder="0"
              min="1"
              value={inputs.pricePerNight}
              onChange={e => setInputs({ ...inputs, pricePerNight: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        {/* Amenities Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2.5">
            Included Amenities
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.keys(inputs.amenities).map((amenity, index) => (
              <label 
                key={amenity}
                className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                  inputs.amenities[amenity]
                    ? 'border-black bg-gray-50 text-gray-900 font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  id={`amenities${index + 1}`}
                  checked={inputs.amenities[amenity]}
                  onChange={() => setInputs({ 
                    ...inputs, 
                    amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] } 
                  })}
                  className="rounded text-black focus:ring-0 cursor-pointer"
                />
                <span className="text-xs sm:text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-black hover:bg-gray-800 text-white font-medium px-8 py-3 rounded-xl text-sm transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            <span>{loading ? "Adding Room..." : "Publish Room Listing"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;
