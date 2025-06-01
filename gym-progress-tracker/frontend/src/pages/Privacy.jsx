import HeroSection from '../components/layout/HeroSection';
import React from "react";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 pb-10">
            <HeroSection
                title="Datenschutz"
                subtitle="Deine Daten sind bei uns sicher! Erfahre, wie wir mit deinen Informationen umgehen."
                background="bg-gradient-to-r from-indigo-700 to-blue-600"
                textColor="text-white"
                size="large"
            />
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white/90 rounded-2xl shadow-xl p-8 mt-8 text-gray-800 border-2 border-indigo-100">
                    <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
                        <span role="img" aria-label="Shield">🛡️</span> Datenschutz auf einen Blick
                    </h2>
                    <p className="mb-4 text-lg">Wir nehmen den Schutz deiner persönlichen Daten sehr ernst. Deine Trainingsdaten, Fortschritte und persönlichen Informationen werden ausschließlich zur Verbesserung deines Nutzererlebnisses verwendet und niemals an Dritte weitergegeben.</p>
                    <ul className="list-disc ml-6 mb-4 text-base">
                        <li>Alle Daten werden verschlüsselt gespeichert.</li>
                        <li>Du kannst jederzeit deine Daten einsehen oder löschen lassen.</li>
                        <li>Wir verwenden keine Daten für Werbung oder Tracking.</li>
                    </ul>
                    <div className="mt-8 bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <h3 className="font-semibold mb-2 text-indigo-800">Kontakt für Datenschutzanfragen</h3>
                        <p>Bei Fragen zum Datenschutz kannst du uns jederzeit unter <a href="mailto:privacy@gymtracker.com" className="text-indigo-600 underline font-medium">privacy@gymtracker.com</a> kontaktieren.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;