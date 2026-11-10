import React, { useState } from 'react';
import Title from './Title.jsx';
import { assets } from '../assets/assets.js';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';

const NewsLetter = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Please enter a valid email address');
            return;
        }

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (!serviceId || !templateId || !publicKey || templateId === 'your_template_id_here') {
            toast.error('EmailJS is not fully configured in .env yet.');
            return;
        }

        try {
            setLoading(true);

            const templateParams = {
                name: name.trim() || email.split('@')[0],
                email: email.trim(),
                user_email: email.trim(),
                to_email: email.trim(),
                to_name: name.trim() || email.split('@')[0],
                company_name: 'CheckInPass',
                reply_to: 'avictorlens26@gmail.com'
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);

            toast.success('Welcome email sent! Check your inbox.');
            setEmail('');
            setName('');
        } catch (error) {
            console.error('EmailJS Error:', error);
            toast.error(error?.text || 'Failed to send welcome email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="px-4 md:px-16 lg:px-24 xl:px-32 my-16 md:my-24">
            {/* Clean theme card: deep dark minimalist container with elegant border and subtle shadow */}
            <div className="bg-gray-900 text-white rounded-3xl p-8 sm:p-12 md:p-16 shadow-xl border border-gray-800 flex flex-col items-center text-center max-w-4xl mx-auto">
                {/* Pill header matching project theme */}
                <span className="inline-block py-1 px-3.5 rounded-full bg-white/10 text-gray-300 text-xs font-medium uppercase tracking-wider mb-4 border border-white/10">
                    Stay Updated
                </span>

                <Title
                    title="Stay Inspired with CheckInPass"
                    subTitle="Subscribe to receive exclusive hotel offers, secret weekend getaways, and hand-picked travel deals straight to your inbox."
                />

                {/* Clean, minimalist input bar matching project theme */}
                <form
                    onSubmit={handleSubscribe}
                    className="w-full max-w-lg mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white/10 p-2 rounded-2xl border border-white/20 focus-within:border-white/40 transition-all"
                >
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name (optional)"
                        disabled={loading}
                        className="bg-transparent px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-white/15"
                    />

                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        disabled={loading}
                        className="bg-transparent px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none flex-1 w-full"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-medium px-6 py-2.5 rounded-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 text-sm shadow-sm"
                    >
                        {loading ? (
                            <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Subscribe</span>
                                <img
                                    src={assets.arrowIcon}
                                    alt="arrow"
                                    className="w-3.5"
                                />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-gray-400 text-xs mt-4">
                    Instant welcome confirmation sent to your inbox. No spam, unsubscribe anytime.
                </p>
            </div>
        </section>
    );
};

export default NewsLetter;