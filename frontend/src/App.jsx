import React from "react"

import Navbar from "./components/Navbar.jsx"
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import About from "./pages/About.jsx"
import { Routes, Route, useLocation } from 'react-router-dom'
import Footer from "./components/Footer.jsx"
import AllRooms from "./pages/AllRooms.jsx"
import RoomDetails from "./pages/RoomDetails.jsx"
import Experience from "./pages/Experience.jsx"
import MyBookings from "./pages/MyBookings.jsx"
import HotelReg from "./components/HotelReg.jsx"
import Layout from "./pages/hotelOwner/Layout.jsx"
import Dashboard from "./pages/hotelOwner/Dashboard.jsx"
import AddRoom from "./pages/hotelOwner/AddRoom.jsx"
import ListRoom from "./pages/hotelOwner/ListRoom.jsx"
import {Toaster} from 'react-hot-toast';
import {useAppContext} from './context/AppContext.jsx';

const App = () => {

  const isOwnerPath = useLocation().pathname.includes("owner");   /* It checks whether URL contains "Owner" and stores result as boolean (true or false) */

  const {showHotelReg} = useAppContext();

  return (
    <div>
      <Toaster/>
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      <div className='min-h-[70vh]'>    {/* vh means viewport height and 70vh means 70% of total height od user's browser */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<Login />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/experience' element={<Experience />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/owner' element={<Layout />} >
            {/* Nested (child) routes under /owner parent route */}
            {/* index -> tells react router to render dashboard by default when only /owner route is matched */}
            <Route index element={<Dashboard />} />
            <Route path='add-room' element={<AddRoom />} />
            <Route path='list-room' element={<ListRoom />} />
          </Route>
        </Routes>
      </div>
      {!isOwnerPath && <Footer />}
    </div>
  )
}
export default App 