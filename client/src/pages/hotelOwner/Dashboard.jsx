import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const Dashboard = () => {

  const { currency = '$', user, token, axios } = useAppContext();

  const [dashboardData, setDashboardData] = useState({
    recentBookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  });

  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get('/api/bookings/hotel', { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        setDashboardData(data.dashboardData || { recentBookings: [], totalBookings: 0, totalRevenue: 0 });
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if(user && token){
      fetchDashboardData();
    }
  }, [user, token])

  return (
    <div>
      <Title align='left' font='outfit' title='Dashboard' subTitle='Monitor your room listings, track bookings and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth operations.' />

      <div className='flex gap-4 my-8'>

        {/* ------ Total Bookings ------ */}
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8' >
          <img src={assets.totalBookingIcon} alt="" className='msx-sm:hidden h-10' />

          <div className='flex flex-col sm:ml-4 font-medium' >
            <p className='text-blue-500 text-lg' >Total Bookings</p>
            {/* text-neutral -> medium gray color */}
            <p className='text-neutral-400 text-base' >{dashboardData.totalBookings}</p>
          </div>

        </div>

        {/* ------ Total Revenue ------ */}
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8' >
          <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10' />

          <div className='flex flex-col sm:ml-4 font-medium' >
            <p className='text-blue-500 text-lg' >Total Revenue</p>
            <p className='text-neutral-400 text-base' >{currency} {dashboardData.totalRevenue}</p>
          </div>

        </div>

        {/* ------ Recent Bookings ------ */}
        <h2 className='text-xl text-blue-950/70 font-medium mb-5'> Recent Bookings </h2>

        {/* overflow-y-scroll ->  Always shows a vertical scrollbar */}
        <div className='w-full max-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll' >

          {/* table -> creates an HTML table element */}
          <table className='w-full' >
            {/* thead -> defines table header container */}
            <thead className='bg-gray-50' >
              {/* tr -> defines a table row */}
              <tr>
                {/* th -> defines a header cell in a table */}
                <th className='px-4 py-3 text-gray-800 font-medium' > User Name </th>
                <th className='px-4 py-3 text-gray-800 font-medium max-sm:hidden' > Room Name </th>
                <th className='px-4 py-3 text-gray-800 font-medium text-center' > Total Amount </th>
                <th className='px-4 py-3 text-gray-800 font-medium text-center' > Payment Status </th>
              </tr>
            </thead>

            {/* tbody -> defines the table body section ; like thead but, for body not header */}
            <tbody className='text-sm' >
              {/* map -> loops through the recentBookings array */}
              {dashboardData.recentBookings.map((item, index) => {
                return (
                  <tr key={index} >
                    {/* td -> defines a data cell in a table */}
                    <td className='px-4 py-3 text-gray-800 font-medium' >{item.user.username}</td>
                    <td className='px-4 py-3 text-gray-800 font-medium max-sm:hidden' >{item.room.roomType}</td>
                    <td className='px-4 py-3 text-gray-800 font-medium text-center' >{currency} {item.totalPrice}</td>
                    <td className='px-4 py-3 text-gray-800 font-medium flex' >
                      <button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.isPaid ? 'bg-green-200 test-green-600' : 'bg-amber-200 text-yellow-600'} text-white`} >
                        {item.isPaid ? 'Completed' : 'Pending'}
                      </button>
                    </td>
                  </tr>
                )
              })}

            </tbody>
          </table>

        </div>

      </div>
    </div>
  )
}

export default Dashboard
