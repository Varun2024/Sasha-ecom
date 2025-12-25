import React from 'react';
import { MapPin, Clock, Phone, Navigation, Mail } from 'lucide-react';

const StoreLocation = () => {
    // Replace these with your actual generated Google URLs
    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.547144422791!2d81.6586393!3d21.2497917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dd9070f80695%3A0xc66087b0a3203c94!2sSasha%20Store!5e0!3m2!1sen!2sin!4v1700000000000";
    const directionsUrl = "https://maps.app.goo.gl/YourActualGoogleMapsLink";

    return (
        <div className="bg-white min-h-screen pt-5 pb-20 font-light">
            <div className="container mx-auto px-4 md:px-12">
                
                {/* --- Editorial Header --- */}
                <header className="text-center mb-16">
                    <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold mb-3 italic">Visit Us</h2>
                    <h1 className="text-3xl md:text-5xl font-light tracking-[0.1em] text-gray-900 uppercase">
                        Our <span className="font-semibold">Atelier</span>
                    </h1>
                    <div className="h-[1px] w-12 bg-black mx-auto mt-6"></div>
                </header>

                <div className="max-w-6xl mx-auto bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden rounded-sm">
                    <div className="grid grid-cols-1 md:grid-cols-12">
                        
                        {/* --- Store Details Column (5 cols) --- */}
                        <div className="md:col-span-5 p-10 md:p-14 space-y-12 bg-[#fafafa]">
                            
                            {/* Address Section */}
                            <section className="space-y-4">
                                <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-gray-900 flex items-center gap-2">
                                    <MapPin size={14} strokeWidth={1.5} /> Location
                                </h3>
                                <div className="space-y-1">
                                    <p className="text-lg font-medium text-gray-900 uppercase tracking-tight">Sasha Store — Raipur</p>
                                    <p className="text-sm text-gray-500 leading-relaxed font-light uppercase tracking-wider">
                                        Shop No. 10/31 Nagar Nigam Complex,<br />
                                        Near SBI Shankar Nagar,<br /> 
                                        Raipur, Chhattisgarh 492001
                                    </p>
                                </div>
                            </section>

                            {/* Opening Hours Section */}
                            <section className="space-y-4">
                                <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-gray-900 flex items-center gap-2">
                                    <Clock size={14} strokeWidth={1.5} /> Hours
                                </h3>
                                <ul className="text-sm text-gray-500 font-light space-y-2 uppercase tracking-tight">
                                    <li className="flex justify-between border-b border-gray-100 pb-2">
                                        <span>Mon — Fri</span>
                                        <span className="text-gray-900 font-normal">10:00 AM — 09:00 PM</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-100 pb-2">
                                        <span>Sat — Sun</span>
                                        <span className="text-gray-900 font-normal">11:00 AM — 10:00 PM</span>
                                    </li>
                                </ul>
                            </section>

                            {/* Contact Section */}
                            <section className="space-y-4">
                                <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-gray-900 flex items-center gap-2">
                                    <Phone size={14} strokeWidth={1.5} /> Concierge
                                </h3>
                                <div className="space-y-3 text-sm font-light">
                                    <a href="tel:+917225801231" className="flex items-center gap-3 text-gray-500 hover:text-black transition-colors">
                                        <span>M: +91 72258 01231</span>
                                    </a>
                                    <a href="mailto:sashastoreindia@gmail.com" className="flex items-center gap-3 text-gray-500 hover:text-black transition-colors">
                                        <span>E: sashastoreindia@gmail.com</span>
                                    </a>
                                </div>
                            </section>

                            {/* CTA Button */}
                            <a
                                href={directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-full bg-black text-white text-[11px] font-semibold uppercase tracking-[0.2em] py-5 hover:bg-gray-800 transition-all gap-3"
                            >
                                <Navigation size={14} />
                                Get Directions
                            </a>
                        </div>

                        {/* --- Map Column (7 cols) --- */}
                        <div className="md:col-span-7 w-full h-96 md:h-full min-h-[400px] grayscale hover:grayscale-0 transition-all duration-700">
                            <iframe
                                src={mapEmbedUrl}
                                className="w-full h-full grayscale-[0.2]"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Sasha Store Location"
                            />
                        </div>
                    </div>
                </div>

                {/* --- Bottom Trust Line --- */}
                <div className="mt-12 text-center">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400">
                        Ample Parking Available • Fully Air-Conditioned • Personalized Styling
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StoreLocation;