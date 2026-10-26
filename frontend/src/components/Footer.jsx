import React from 'react';
import { assets } from '../assets/assets.js';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className='bg-[#F6F9FC] text-gray-500 pt-12 px-6 md:px-16 lg:px-24 xl:px-32 border-t border-gray-200/60'>
            <div className='flex flex-wrap justify-between gap-10 md:gap-8'>
                {/* Brand & Description */}
                <div className='max-w-sm'>
                    <Link to="/" className="inline-block group">
                        <img 
                            src={assets.logo} 
                            alt="logo" 
                            className='mb-4 h-8 md:h-9 invert opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-300' 
                        />
                    </Link>
                    <p className='text-sm text-gray-500 leading-relaxed'>
                        Discover the world's most extraordinary places to stay, from boutique hotels to luxury villas and private islands.
                    </p>

                    {/* Social Media Links with Interactive Hover */}
                    <div className='flex items-center gap-2.5 mt-5'>
                        {/* Instagram */}
                        <a
                            href="#"
                            aria-label="Instagram"
                            className='w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:border-gray-900 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group'
                        >
                            <img 
                                src={assets.instagramIcon} 
                                alt="instagram-icon" 
                                className='w-4.5 group-hover:brightness-0 group-hover:invert transition-all duration-300' 
                            />
                        </a>

                        {/* Facebook */}
                        <a
                            href="#"
                            aria-label="Facebook"
                            className='w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:border-gray-900 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group'
                        >
                            <img 
                                src={assets.facebookIcon} 
                                alt="facebook-icon" 
                                className='w-4.5 group-hover:brightness-0 group-hover:invert transition-all duration-300' 
                            />
                        </a>

                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/in/vansh-thakur-vans30m/"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="LinkedIn Profile"
                            aria-label="LinkedIn"
                            className='w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:border-gray-900 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group'
                        >
                            <img 
                                src={assets.linkendinIcon} 
                                alt="linkedin-icon" 
                                className='w-4.5 group-hover:brightness-0 group-hover:invert transition-all duration-300' 
                            />
                        </a>

                        {/* GitHub */}
                        <a 
                            href="https://github.com/Vans30m/CheckInPass" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            title="GitHub Repository"
                            aria-label="GitHub"
                            className='w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:border-gray-900 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group'
                        >
                            <img 
                                src={assets.githubIcon} 
                                alt="github-icon" 
                                className='w-4.5 group-hover:brightness-0 group-hover:invert transition-all duration-300' 
                            />
                        </a>
                    </div>
                </div>

                {/* Company Links */}
                <div>
                    <p className='font-playfair text-base font-semibold text-gray-900 tracking-wide'>COMPANY</p>
                    <ul className='mt-4 flex flex-col gap-2.5 text-sm'>
                        <li>
                            <Link to="/about" className='hover:text-black hover:translate-x-1 inline-block transition-all duration-200'>
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/rooms" className='hover:text-black hover:translate-x-1 inline-block transition-all duration-200'>
                                Hotels
                            </Link>
                        </li>
                        <li>
                            <Link to="/experience" className='hover:text-black hover:translate-x-1 inline-block transition-all duration-200'>
                                Experiences
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Support Links */}
                <div>
                    <p className='font-playfair text-base font-semibold text-gray-900 tracking-wide'>SUPPORT</p>
                    <ul className='mt-4 flex flex-col gap-2.5 text-sm'>
                        <li>
                            <Link to="/about" className='hover:text-black hover:translate-x-1 inline-block transition-all duration-200'>
                                Help Center
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className='hover:text-black hover:translate-x-1 inline-block transition-all duration-200'>
                                Cancellation Options
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className='hover:text-black hover:translate-x-1 inline-block transition-all duration-200'>
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <hr className='border-gray-200 mt-10' />
            <div className='flex flex-col sm:flex-row gap-3 items-center justify-between py-6 text-xs text-gray-400'>
                <p>
                    © {new Date().getFullYear()}{' '}All rights reserved.
                </p>
                <ul className='flex items-center gap-5'>
                    <li>
                        <a href="#" className='hover:text-gray-700 hover:underline transition-colors'>
                            Privacy
                        </a>
                    </li>
                    <li>
                        <a href="#" className='hover:text-gray-700 hover:underline transition-colors'>
                            Terms
                        </a>
                    </li>
                    <li>
                        <a href="#" className='hover:text-gray-700 hover:underline transition-colors'>
                            Sitemap
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;