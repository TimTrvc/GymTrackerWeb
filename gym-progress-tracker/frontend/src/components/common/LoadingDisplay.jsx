import React from "react";

/**
 * LoadingDisplay-Komponente zum Anzeigen von Ladezuständen
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Konzentriert sich nur auf die Anzeige von Ladezuständen
 * - Open/Closed: Erweiterbar durch verschiedene Anzeigevarianten
 * 
 * KISS-Prinzip: Einfache, leicht verständliche Implementierung
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.message - Die anzuzeigende Lademeldung
 * @param {string} props.variant - Optional: Variante des Ladeindikators ('text', 'spinner', 'dots', 'progress')
 * @param {number} props.progress - Optional: Fortschritt (0-100) für die 'progress'-Variante
 * @returns {JSX.Element} Die gerenderte LoadingDisplay-Komponente
 */
const LoadingDisplay = ({ 
    message = "Wird geladen...", 
    variant = 'text',
    progress = 0
}) => {
    // Verschiedene Ladeanimationen für unterschiedliche Anwendungsfälle
    const LoadingIndicator = () => {
        switch (variant) {
            case 'spinner':
                return (
                    <div className="flex justify-center mb-3">
                        <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                );
            case 'dots':
                return (
                    <div className="flex justify-center mb-3 space-x-1">
                        {[1, 2, 3].map((dot) => (
                            <div 
                                key={dot}
                                className="h-2 w-2 bg-indigo-600 rounded-full animate-pulse"
                                style={{ animationDelay: `${dot * 150}ms` }}
                            ></div>
                        ))}
                    </div>
                );
            case 'progress':
                return (
                    <div className="w-full h-2 bg-gray-200 rounded-full mb-3">
                        <div 
                            className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-in-out" 
                            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                        ></div>
                    </div>
                );
            case 'text':
            default:
                return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="text-center py-8">
                <LoadingIndicator />
                <p className="text-gray-700">{message}</p>
            </div>
        </div>
    );
};

export default LoadingDisplay;