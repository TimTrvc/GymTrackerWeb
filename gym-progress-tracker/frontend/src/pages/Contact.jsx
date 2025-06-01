import HeroSection from '../components/layout/HeroSection';
import React from "react";

const Contact = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 pb-10">
            <HeroSection
                title="Kontakt"
                subtitle="Wir sind für dich da! Kontaktiere uns bei Fragen, Feedback oder Kooperationen."
                background="bg-gradient-to-r from-indigo-700 to-blue-600"
                textColor="text-white"
                size="large"
            />
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white/90 rounded-2xl shadow-xl p-8 mt-8 text-gray-800 border-2 border-indigo-100">
                    <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
                        <span role="img" aria-label="Mail">📬</span> Kontaktmöglichkeiten
                    </h2>
                    <p className="mb-4 text-lg">Du hast Fragen, Feedback oder möchtest mit uns zusammenarbeiten? Wir freuen uns auf deine Nachricht!</p>
                    <ul className="mb-4 text-base">
                        <li className="mb-1"><b>E-Mail:</b> <a href="mailto:support@gymtracker.com" className="text-indigo-600 underline font-medium">support@gymtracker.com</a></li>
                        <li className="mb-1"><b>Telefon:</b> +49 123 4567890</li>
                        <li><b>Adresse:</b> Musterstraße 1, 12345 Musterstadt</li>
                    </ul>
                    <div className="mt-8 bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <h3 className="font-semibold mb-2 text-indigo-800">Ansprechpartner</h3>
                        <p>Tim Travica, Luis Geiger</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;