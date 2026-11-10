import React, { useState, useEffect, useContext } from 'react';
import { assets } from '../assets/assets.js';
import StarRating from '../components/StarRating.jsx';
import Title from '../components/Title.jsx';
import { AuthContext } from '../context/Auth.jsx';
import { toast } from 'react-hot-toast';

// Curated guest reviews matching CheckInPass brand aesthetic
const initialExperiences = [
    {
        id: 1,
        author: "Sophia Loren",
        role: "Solo Traveler",
        location: "Santorini, Greece",
        hotelName: "Astra Suites Luxury Villa",
        rating: 5,
        date: "Oct 18, 2026",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250",
        tag: "Luxury Stay",
        title: "An unforgettable sunset over the caldera",
        review: "The check-in process was smooth beyond words. The host had chilled wine and Greek treats ready. Watching the caldera from the private hot tub at dusk is something I'll carry with me forever. The curated suggestions on CheckInPass guided every single excursion.",
        verified: true,
    },
    {
        id: 2,
        author: "Marcus Chen",
        role: "Business Traveler",
        location: "Tokyo, Japan",
        hotelName: "The Prince Gallery Kioicho",
        rating: 5,
        date: "Sep 24, 2026",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250",
        tag: "Workcation",
        title: "Flawless digital check-in and whisper-quiet rooms",
        review: "High-speed Wi-Fi, seamless owner messaging, and an authentic tea ceremony recommendation in Ginza. CheckInPass took out all the stress of traveling to East Asia for back-to-back conferences.",
        verified: true,
    },
    {
        id: 3,
        author: "Elena & David Rostova",
        role: "Couple Traveler",
        location: "Amalfi Coast, Italy",
        hotelName: "Cliffside Positano Residence",
        rating: 5,
        date: "Aug 12, 2026",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=250",
        tag: "Romantic Stay",
        title: "Pure paradise and unmatched hospitality",
        review: "Every single photo on the listing was completely honest. The panoramic lemon grove views and fresh Mediterranean breakfast delivered right to our balcony made our honeymoon truly magical.",
        verified: true,
    },
    {
        id: 4,
        author: "Liam Gallagher",
        role: "Adventure Traveler",
        location: "Interlaken, Switzerland",
        hotelName: "Alpine Chalet & Spa",
        rating: 4,
        date: "Jul 30, 2026",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250",
        tag: "Alpine Retreat",
        title: "Cozy fireplace after long days on the trails",
        review: "Waking up to the Swiss Alps and having steam baths waiting after a 15km mountain trek is unbeatable. Host gave insider hiking maps not found on standard tourist guides.",
        verified: true,
    },
    {
        id: 5,
        author: "Amara Ndiaye",
        role: "Cultural Traveler",
        location: "Marrakech, Morocco",
        hotelName: "Riad Al Jazira",
        rating: 5,
        date: "Jun 15, 2026",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250",
        tag: "Heritage Riad",
        title: "Tranquil courtyard in the heart of the Medina",
        review: "Stepping inside from the bustling Medina into birdsong and mint tea was heavenly. Authentic zellige tiles, exceptional hospitality, and personalized culinary classes.",
        verified: true,
    }
];

const Experience = () => {
    const { user } = useContext(AuthContext);

    // Persist reviews locally
    const [experiences, setExperiences] = useState(() => {
        const saved = localStorage.getItem('checkinpass_experiences');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error(e);
            }
        }
        return initialExperiences;
    });

    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        author: '',
        role: '',
        location: '',
        hotelName: '',
        tag: 'Luxury Stay',
        rating: 5,
        title: '',
        review: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                author: prev.author || user.name || user.username || ''
            }));
        }
    }, [user, showModal]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.author.trim() || !formData.hotelName.trim() || !formData.review.trim() || !formData.title.trim()) {
            toast.error("Please fill in all required fields!");
            return;
        }

        const newExperience = {
            id: Date.now(),
            author: formData.author,
            role: formData.role || "Verified Guest",
            location: formData.location || "Global Destination",
            hotelName: formData.hotelName,
            rating: Number(formData.rating),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            avatar: user?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.author)}`,
            tag: formData.tag || "Verified Stay",
            title: formData.title,
            review: formData.review,
            verified: true,
        };

        const updated = [newExperience, ...experiences];
        setExperiences(updated);
        localStorage.setItem('checkinpass_experiences', JSON.stringify(updated));

        toast.success("Thank you! Your experience has been published.");
        setShowModal(false);
        setFormData({
            author: user?.name || '',
            role: '',
            location: '',
            hotelName: '',
            tag: 'Luxury Stay',
            rating: 5,
            title: '',
            review: ''
        });
    };

    return (
        <div className="pt-24 sm:pt-28 md:pt-36 pb-20 sm:pb-28 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 bg-white min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
                <Title
                    title="Guest Experiences"
                    subTitle="Discover authentic stories and reviews from travelers who experienced memorable stays with CheckInPass."
                />

                <div className="mt-6 sm:mt-8 w-full sm:w-auto flex justify-center">
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-medium px-6 py-3 rounded-full transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span className="text-base leading-none">+</span>
                        <span>Share Your Experience</span>
                    </button>
                </div>
            </div>

            {/* Experience Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {experiences.map((exp) => (
                        <div
                            key={exp.id}
                            className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 hover:border-gray-300 hover:shadow-xs transition-all flex flex-col justify-between"
                        >
                            <div>
                                {/* Header: Author info & tag */}
                                <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={exp.avatar}
                                            alt={exp.author}
                                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-gray-100 shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <p className="font-playfair text-base sm:text-lg text-gray-900 leading-tight truncate">
                                                {exp.author}
                                            </p>
                                            <p className="text-gray-400 text-[11px] sm:text-xs mt-0.5 truncate">{exp.role}</p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-full shrink-0">
                                        {exp.tag}
                                    </span>
                                </div>

                                {/* Star rating & date */}
                                <div className="flex items-center justify-between mt-2 mb-3">
                                    <div className="flex items-center gap-1">
                                        <StarRating rating={exp.rating} />
                                    </div>
                                    <span className="text-[11px] sm:text-xs text-gray-400">{exp.date}</span>
                                </div>

                                {/* Hotel and location */}
                                <div className="mb-3.5 text-xs text-gray-600 border-b border-gray-100 pb-3">
                                    <p className="font-medium text-gray-900 truncate">{exp.hotelName}</p>
                                    <p className="text-gray-400 text-[11px] mt-0.5 truncate">{exp.location}</p>
                                </div>

                                {/* Title & Review */}
                                <h3 className="font-playfair text-sm sm:text-base font-semibold text-gray-900 mb-2 leading-snug">
                                    "{exp.title}"
                                </h3>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-4">
                                    {exp.review}
                                </p>
                            </div>

                            {/* Clean subtle footer */}
                            <div className="pt-3.5 mt-4 border-t border-gray-100 text-right">
                                <span className="text-[10px] sm:text-[11px] text-gray-400 font-light">
                                    Verified Stay
                                </span>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Modal for adding review - fully responsive for small mobile to large monitors */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 max-w-lg w-full shadow-xl relative max-h-[92vh] overflow-y-auto border border-gray-100">
                        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                            <div>
                                <h2 className="font-playfair text-xl sm:text-2xl font-bold text-gray-900">
                                    Share Your Experience
                                </h2>
                                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                                    Tell us about your stay and help other travelers.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="mt-4 sm:mt-5 space-y-3.5 text-xs sm:text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        placeholder="e.g. Sophia Loren"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">
                                        Traveler Type
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="e.g. Solo Traveler, Couple"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">
                                        Hotel Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.hotelName}
                                        onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                                        placeholder="e.g. Astra Suites"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">
                                        City, Country
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g. Santorini, Greece"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">
                                        Stay Tag
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tag}
                                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                        placeholder="e.g. Luxury Stay, Weekend Trip"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">
                                        Rating
                                    </label>
                                    <select
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black bg-white"
                                    >
                                        <option value={5}>5 Stars</option>
                                        <option value={4}>4 Stars</option>
                                        <option value={3}>3 Stars</option>
                                        <option value={2}>2 Stars</option>
                                        <option value={1}>1 Star</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">
                                    Review Headline *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. An unforgettable sunset over the caldera"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">
                                    Your Detailed Review *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.review}
                                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                                    placeholder="Share details about the room, amenities, and hospitality..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black resize-none"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl text-xs font-medium bg-black text-white hover:bg-gray-800 transition-all cursor-pointer shadow-xs active:scale-95"
                                >
                                    Publish Story
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Experience;
