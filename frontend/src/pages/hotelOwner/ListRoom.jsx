import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ListRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const { axios, token, user, currency = '$' } = useAppContext();

  {/* Fetch rooms for hotel owners */}
  const fetchRooms = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const { data } = await axios.get('/api/rooms/owner', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (data.success) {
        setRooms(data.rooms || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchRooms();
    }
  }, [user, token]);

  {/* Toggle availability of the room */}
  const toggleAvailability = async (roomId) => {
    try {
      setTogglingId(roomId);
      const { data } = await axios.post('/api/rooms/toggle-availability', { roomId }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (data.success) {
        toast.success(data.message);
        // Optimistically update local state for instantaneous feedback
        setRooms(prev => prev.map(room => 
          room._id === roomId ? { ...room, isAvailable: !room.isAvailable } : room
        ));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-gray-900 tracking-tight">
            Room Inventory
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your hotel room availability, facilities, and night rates.
          </p>
        </div>

        <Link
          to="/owner/add-room"
          className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95 w-fit"
        >
          <span>+</span>
          <span>Add Room</span>
        </Link>
      </div>

      {/* Rooms Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
              Listed Rooms ({rooms.length})
            </h2>
          </div>
          <button
            onClick={fetchRooms}
            className="text-xs text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-xs uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3.5">Room</th>
                <th scope="col" className="px-6 py-3.5 max-md:hidden">Amenities</th>
                <th scope="col" className="px-6 py-3.5">Price / Night</th>
                <th scope="col" className="px-6 py-3.5 text-center">Status</th>
                <th scope="col" className="px-6 py-3.5 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <p className="text-sm font-medium text-gray-600">No rooms listed yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click "Add Room" above to list your first hotel room.
                    </p>
                  </td>
                </tr>
              ) : (
                rooms.map((item, index) => {
                  const isToggling = togglingId === item._id;
                  return (
                    <tr key={item._id || index} className="hover:bg-slate-50/70 transition-colors">
                      {/* Room Image & Type */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.images && item.images[0] ? (
                            <img 
                              src={item.images[0]} 
                              alt={item.roomType} 
                              className="w-12 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs shrink-0">
                              Room
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">
                              {item.roomType}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {item.hotel?.city || 'Standard Listing'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Amenities */}
                      <td className="px-6 py-4 max-md:hidden text-xs text-gray-500">
                        {Array.isArray(item.amenities) && item.amenities.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 max-w-xs">
                            {item.amenities.slice(0, 3).map((amenity, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-[11px]">
                                {amenity}
                              </span>
                            ))}
                            {item.amenities.length > 3 && (
                              <span className="text-[11px] text-gray-400">+{item.amenities.length - 3} more</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">None</span>
                        )}
                      </td>

                      {/* Price per night */}
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {currency} {item.pricePerNight}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {item.isAvailable ? 'Available' : 'Paused'}
                        </span>
                      </td>

                      {/* Modern Clean Toggle Switch */}
                      <td className="px-6 py-4 text-center">
                        <label className="relative inline-flex items-center justify-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={item.isAvailable}
                            disabled={isToggling}
                            onChange={() => toggleAvailability(item._id)}
                            className="sr-only peer"
                          />
                          {/* Toggle Track */}
                          <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out border ${
                            item.isAvailable 
                              ? 'bg-black border-black' 
                              : 'bg-gray-200 border-gray-300'
                          } peer-focus:outline-none`}>
                            {/* Toggle Knob */}
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out mt-[1px] ${
                              item.isAvailable ? 'translate-x-5' : 'translate-x-[2px]'
                            }`} />
                          </div>
                        </label>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListRoom;
