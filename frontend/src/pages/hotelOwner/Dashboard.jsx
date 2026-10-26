import React, { useState, useEffect } from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { currency = '$', user, token, axios } = useAppContext();

    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        recentBookings: [],
        totalBookings: 0,
        totalRevenue: 0,
    });

    const fetchDashboardData = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const { data } = await axios.get('/api/bookings/hotel', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            if (data.success) {
                setDashboardData(data.dashboardData || { recentBookings: [], totalBookings: 0, totalRevenue: 0 });
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
            fetchDashboardData();
        }
    }, [user, token]);

    return (
        <div className="space-y-8 pb-10">
            {/* Header with Title and Quick Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-6">
                <div>
                    <h1 className="font-playfair text-3xl font-bold text-gray-900 tracking-tight">
                        Host Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 max-w-xl">
                        Monitor live room listings, track customer bookings, and analyze real-time property performance.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/owner/add-room"
                        className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                        <span>+</span>
                        <span>Add New Room</span>
                    </Link>
                </div>
            </div>

            {/* Metrics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Total Bookings Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between hover:border-gray-300 transition-all">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Total Bookings
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {dashboardData.totalBookings}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                            Live guest stays
                        </p>
                    </div>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between hover:border-gray-300 transition-all">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Total Revenue
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {currency} {Number(dashboardData.totalRevenue).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                            Gross earnings
                        </p>
                    </div>
                </div>

                {/* Quick Link Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between sm:col-span-2 lg:col-span-1 hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Property Management
                        </p>
                        <p className="text-sm font-medium text-gray-800 mt-2">
                            Manage room availability & pricing
                        </p>
                    </div>
                    <Link
                        to="/owner/list-room"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 mt-4 flex items-center gap-1 group"
                    >
                        <span>View Room Inventory</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>

            {/* Recent Bookings Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="font-playfair text-xl font-bold text-gray-900">
                            Recent Reservations
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Latest guest bookings placed for your hotel
                        </p>
                    </div>

                    <button
                        onClick={fetchDashboardData}
                        className="text-xs text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Refresh
                    </button>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50/80 text-xs uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3.5">Guest</th>
                                <th scope="col" className="px-6 py-3.5">Room Type</th>
                                <th scope="col" className="px-6 py-3.5 text-center">Amount</th>
                                <th scope="col" className="px-6 py-3.5 text-center">Payment Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {dashboardData.recentBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                        <div className="max-w-xs mx-auto">
                                            <p className="text-sm font-medium text-gray-600">No bookings recorded yet</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                New guest reservations will appear here in real time.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                dashboardData.recentBookings.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center text-xs shrink-0">
                                                    {item.user?.username?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <span className="truncate">{item.user?.username || 'Guest'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {item.room?.roomType || 'Standard Room'}
                                        </td>
                                        <td className="px-6 py-4 text-center font-semibold text-gray-900">
                                            {currency} {item.totalPrice}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                item.isPaid 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                                                    : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${item.isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                {item.isPaid ? 'Completed' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
