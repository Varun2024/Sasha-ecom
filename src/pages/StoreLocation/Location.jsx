import React from 'react';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';

const StoreLocation = () => {
    // A valid Google Maps embed URL. I've used a real mall in Raipur as an example.
    // You can generate your own by searching for your location on Google Maps, clicking "Share", then "Embed a map".
    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.371105451413!2d81.65904257498164!3d21.256772979908668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dd6f7d73db33%3A0xfe7f24dec5da55ee!2sSASHA%20STORE!5e0!3m2!1sen!2sin!4v1758897323711!5m2!1sen!2sin";
    // <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.371105451413!2d81.65904257498164!3d21.256772979908668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dd6f7d73db33%3A0xfe7f24dec5da55ee!2sSASHA%20STORE!5e0!3m2!1sen!2sin!4v1758897323711!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    // Direct link for the "Get Directions" button.
    const directionsUrl = "https://maps.app.goo.gl/rY1dYk87qK1gYt8n6";

    return (
        <div className="bg-slate-50 min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">
                <header className="text-center mb-10">
                    <div className="flex justify-center items-center gap-3">
                        <MapPin className="w-10 h-10 text-purple-600" />
                        <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">Visit Our Store</h1>
                    </div>
                    <p className="mt-2 text-lg text-gray-500">
                        We'd love to see you! Find us at our Sasha Store - Raipur location.
                    </p>
                </header>

                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* --- Store Details Column --- */}
                        <div className="p-8 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Sasha Store - Raipur</h2>
                                <p className="mt-2 text-gray-600">
                                    SHOP NO. 10/31 NAGAR NIGAM COMPLEX,<br />
                                    NEAR SBI SHANKAR NAGAR,<br /> 
                                    RAIPUR, Chhattisgarh, 492001
                                </p>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                                    <Clock className="w-6 h-6 text-purple-500" />
                                    Opening Hours
                                </h3>
                                <ul className="mt-4 space-y-2 text-gray-600">
                                    <li><strong>Monday - Friday:</strong> 10:00 AM - 9:00 PM</li>
                                    <li><strong>Saturday - Sunday:</strong> 11:00 AM - 10:00 PM</li>
                                </ul>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                                    <Phone className="w-6 h-6 text-purple-500" />
                                    Contact Us
                                </h3>
                                <div className="mt-4 space-y-2 text-gray-600">
                                    <p><strong>Phone:</strong> <a href="tel:+917225801231" className="hover:underline">+91 72258 01231</a></p>
                                    <p><strong>Email:</strong> <a href="mailto:sashastoreindia@gmail.com" className="hover:underline">sashastoreindia@gmail.com</a></p>
                                </div>
                            </div>

                            <a
                                href={directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block w-full text-center mt-6 rounded-lg border-2 border-black bg-black px-8 py-3 font-semibold uppercase text-white transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_#6b7280] active:translate-x-[0px] active:translate-y-[0px] active:rounded-lg active:shadow-none"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Navigation className="w-5 h-5" />
                                    Get Directions
                                </span>
                            </a>
                        </div>

                        {/* --- Map Column --- */}
                        <div className="w-full h-80 md:h-full">
                            <iframe
                                src={mapEmbedUrl}
                                className="w-full h-full"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Store Location Map"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreLocation;
