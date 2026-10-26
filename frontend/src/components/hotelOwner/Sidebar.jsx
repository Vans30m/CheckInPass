import React from 'react';
import { assets } from '../../assets/assets.js';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const sidebarLinks = [
        { name: "Dashboard", path: "/owner", icon: assets.dashboardIcon },
        { name: "Add Room", path: "/owner/add-room", icon: assets.addIcon },
        { name: "Room Listings", path: "/owner/list-room", icon: assets.listIcon },
    ];

    return (
        <aside className='md:w-64 w-18 border-r border-gray-200 bg-white h-full py-6 flex flex-col shrink-0 select-none'>
            <div className="px-4 mb-4 hidden md:block">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3">
                    Management
                </p>
            </div>

            <nav className="flex flex-col gap-1 px-2.5">
                {sidebarLinks.map((item, index) => (
                    <NavLink
                        to={item.path}
                        key={index}
                        end={item.path === "/owner"}
                        className={({ isActive }) => `flex items-center py-3 px-3.5 md:px-4 rounded-xl gap-3 text-sm font-medium transition-all ${
                            isActive
                                ? "bg-black text-white shadow-xs"
                                : "text-gray-600 hover:text-black hover:bg-gray-100"
                        }`}
                    >
                        {({ isActive }) => (
                            <>
                                <img
                                    src={item.icon}
                                    alt={item.name}
                                    className={`w-5 h-5 shrink-0 ${isActive ? "brightness-0 invert" : "opacity-70"}`}
                                />
                                <span className='hidden md:block truncate'>
                                    {item.name}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;