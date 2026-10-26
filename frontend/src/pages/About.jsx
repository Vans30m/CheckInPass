import React from 'react';
import { assets } from '../assets/assets.js';
import { Link } from 'react-router-dom';
import Title from '../components/Title.jsx';

const About = () => {
    const highlights = [
        {
            title: "Direct Hotel Listings",
            desc: "Empowering hotel owners with a dedicated portal to manage rooms, toggle live availability, and control listings directly without middleman markups."
        },
        {
            title: "Zero Hidden Fees",
            desc: "Designed to eliminate deceptive commissions, offering authentic upfront pricing and straightforward reservations for travelers."
        },
        {
            title: "Modern Tech Stack",
            desc: "Engineered on the MERN stack with secure Google OAuth, Cloudinary media CDN, instant room filtering, and responsive design for every device."
        }
    ];

    return (
        <div className="pt-24 sm:pt-28 md:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-14">
                    <span className="inline-block py-1 px-3.5 rounded-full bg-blue-50 text-blue-600 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-3">
                        About The Project
                    </span>
                    <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 font-bold mb-4 tracking-tight">
                        CheckInPass
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
                        A modern, full-stack hotel reservation and property management platform built to bridge independent hoteliers and travelers directly.
                    </p>
                </div>

                {/* Project Overview Card */}
                <div className="bg-slate-50 border border-gray-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 mb-8 sm:mb-12 shadow-xs">
                    <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Our Mission
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                        Commercial online travel agencies often impose hefty commissions and restrictive control over hotel listings. <strong>CheckInPass</strong> was conceived to solve this imbalance by providing a clean, self-hostable alternative.
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        Hoteliers gain complete autonomy over room tiers, real-time availability toggles, and photo uploads, while guests get a lightning-fast interface to discover, filter, and reserve verified accommodations with total peace of mind.
                    </p>
                </div>

                {/* Key Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-14">
                    {highlights.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-5 sm:p-6 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-xs transition-all flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="font-playfair text-base sm:text-lg font-bold text-gray-900 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call To Action Buttons */}
                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto sm:max-w-none">
                    <Link
                        to="/rooms"
                        className="bg-black text-white hover:bg-gray-800 px-6 py-3.5 rounded-full text-xs sm:text-sm font-medium transition-all text-center shadow-xs active:scale-95"
                    >
                        Browse Available Rooms
                    </Link>
                    <Link
                        to="/experience"
                        className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3.5 rounded-full text-xs sm:text-sm font-medium transition-all text-center active:scale-95"
                    >
                        Guest Experiences
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;