import React from 'react'
import { assets } from '../assets/assets.js'

const About = () => {
    const stats = [
        { label: 'Hotels Worldwide', value: '50,000+', icon: assets.homeIcon },
        { label: 'Happy Travelers', value: '1M+', icon: assets.guestsIcon },
        { label: 'Destinations', value: '200+', icon: assets.locationIcon },
        { label: 'Avg. Rating', value: '4.8/5', icon: assets.starIconFilled },
    ]

    const features = [
        {
            icon: assets.badgeIcon,
            title: 'Verified Properties',
            description: 'Every hotel is personally vetted for quality, safety, and authenticity before listing.'
        },
        {
            icon: assets.shieldIcon || assets.badgeIcon,
            title: 'Secure Booking',
            description: 'End-to-end encryption and trusted payment partners keep your data safe.'
        },
        {
            icon: assets.heartIcon,
            title: 'Price Match Guarantee',
            description: 'Found a better price? We\'ll match it and refund the difference.'
        },
        {
            icon: assets.freeBreakfastIcon,
            title: 'Exclusive Perks',
            description: 'Complimentary breakfast, room upgrades, late checkout, and more for members.'
        },
        {
            icon: assets.freeWifiIcon,
            title: '24/7 Support',
            description: 'Real humans ready to help via chat, email, or phone — anytime, anywhere.'
        },
        {
            icon: assets.arrowIcon,
            title: 'Flexible Cancellation',
            description: 'Free cancellation on most rooms up to 24 hours before check-in.'
        },
    ]

    const values = [
        {
            title: 'Traveler First',
            description: 'Every decision starts with what\'s best for the traveler. No hidden fees, no misleading photos — just honest, transparent booking.'
        },
        {
            title: 'Quality Over Quantity',
            description: 'We\'d rather have 1,000 exceptional properties than 100,000 mediocre ones. Curation beats aggregation.'
        },
        {
            title: 'Empower Local',
            description: 'We partner with independent hotels and local hosts, helping them reach global travelers without losing their identity.'
        },
        {
            title: 'Continuous Innovation',
            description: 'From AI-powered recommendations to seamless mobile check-in, we\'re constantly reimagining the travel experience.'
        },
    ]

    const team = [
        { name: 'Vansh Thakur', role: 'Founder & CEO', bio: 'Former product lead at a major OTA. Obsessed with making travel booking delightful.' },
        { name: 'Priya Sharma', role: 'CTO', bio: 'Ex-Google engineer. Builds scalable systems that handle millions of searches daily.' },
        { name: 'Rahul Mehta', role: 'Head of Partnerships', bio: '15+ years in hospitality. Brings the world\'s best independent hotels to CheckInPass.' },
        { name: 'Ananya Singh', role: 'Head of Design', bio: 'Award-winning designer. Crafts experiences that feel effortless and beautiful.' },
    ]

    const milestones = [
        { year: '2023', title: 'Founded', description: 'Started with a mission to fix broken hotel booking.' },
        { year: '2024', title: '10K Properties', description: 'Onboarded 10,000 verified hotels across 50 countries.' },
        { year: '2024', title: 'Series A', description: 'Raised $15M from top travel and tech investors.' },
        { year: '2025', title: '1M Travelers', description: 'Served 1 million happy customers with 4.8 avg rating.' },
        { year: '2025', title: 'Mobile App', description: 'Launched iOS & Android apps with offline itineraries.' },
        { year: '2026', title: 'Global Expansion', description: 'Now in 200+ destinations with 24/7 multilingual support.' },
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center px-6 md:px-16 lg:px-24 xl:px-32 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <img src={assets.regImage} alt="About CheckInPass" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="text-center text-white max-w-3xl">
                    <p className="bg-white/20 px-4 py-1.5 rounded-full inline-block text-sm font-medium mb-6 backdrop-blur">
                        About CheckInPass
                    </p>
                    <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                        Redefining How You <br />Experience Travel
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                        We believe booking a stay should be as inspiring as the journey itself. 
                        CheckInPass connects discerning travelers with the world\'s most remarkable hotels — 
                        curated, verified, and booked with confidence.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 md:py-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                        <div>
                            <p className="text-blue-600 font-medium text-sm tracking-wide uppercase mb-3">Our Mission</p>
                            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                Making extraordinary stays accessible to everyone
                            </h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    CheckInPass was born from a simple frustration: finding a truly great hotel 
                                    shouldn\'t require hours of research, cross-referencing reviews, and worrying 
                                    about hidden fees or misleading photos.
                                </p>
                                <p>
                                    We set out to build a platform where every property is hand-vetted, 
                                    every photo is recent and authentic, and every price is transparent. 
                                    No surprises. No compromises. Just exceptional stays, booked in minutes.
                                </p>
                                <p>
                                    Today, we partner with over 50,000 carefully selected properties across 
                                    200+ destinations — from boutique city hotels to remote luxury villas — 
                                    all united by a commitment to quality and genuine hospitality.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                                <img src={assets.heroVideo} alt="CheckInPass team" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-xs">
                                <p className="font-playfair text-4xl md:text-5xl font-bold text-gray-900">98%</p>
                                <p className="text-gray-600 mt-1">Guest Satisfaction Rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 md:py-20 px-6 md:px-16 lg:px-24 xl:px-32 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <p className="text-blue-600 font-medium text-sm tracking-wide uppercase mb-3">By the Numbers</p>
                        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">
                            Trusted by travelers worldwide
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center p-6 md:p-8 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full mb-4">
                                    <img src={stat.icon} alt="" className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
                                </div>
                                <p className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                <p className="text-gray-600 text-sm md:text-base">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <p className="text-blue-600 font-medium text-sm tracking-wide uppercase mb-3">Why Choose Us</p>
                        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">
                            Built for the modern traveler
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                                    <img src={feature.icon} alt="" className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 md:py-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <p className="text-blue-600 font-medium text-sm tracking-wide uppercase mb-3">Our Values</p>
                        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">
                            Principles that guide everything we do
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        {values.map((value, index) => (
                            <div key={index} className="p-6 md:p-8 border border-gray-100 rounded-2xl hover:border-blue-200 transition-colors">
                                <h3 className="font-playfair text-xl md:text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 md:py-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <p className="text-blue-600 font-medium text-sm tracking-wide uppercase mb-3">Meet the Team</p>
                        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">
                            Passionate travelers building for travelers
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm text-center">
                                <div className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                    <span className="text-3xl md:text-4xl font-bold text-blue-600">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <h3 className="font-playfair text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                                <p className="text-blue-600 text-sm font-medium mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Milestones Section */}
            <section className="py-16 md:py-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <p className="text-blue-600 font-medium text-sm tracking-wide uppercase mb-3">Our Journey</p>
                        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">
                            Milestones that define us
                        </h2>
                    </div>
                    <div className="relative">
                        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
                        {milestones.map((milestone, index) => (
                            <div key={index} className="relative pl-16 md:pl-20 pb-10 md:pb-12">
                                <div className="absolute left-6 md:left-8 top-1 w-4 h-4 md:w-5 md:h-5 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10" />
                                <div className="bg-gray-50 p-5 md:p-6 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-playfair text-xl font-bold text-blue-600 bg-white px-3 py-1 rounded-lg shadow-sm">
                                            {milestone.year}
                                        </span>
                                        <h3 className="font-playfair text-lg font-bold text-gray-900">{milestone.title}</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm md:text-base">{milestone.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-gray-900">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to experience travel differently?
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                        Join millions of travelers who trust CheckInPass for their most memorable stays.
                    </p>
                    <a href="/rooms" className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-3.5 rounded-full font-medium hover:bg-gray-100 transition-colors">
                        Explore Hotels
                        <img src={assets.arrowIcon} alt="" className="w-4 h-4" />
                    </a>
                </div>
            </section>
        </div>
    )
}

export default About