import React from "react";

/**
 * ErrorDisplay-Komponente zum Anzeigen von Fehlermeldungen
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Konzentriert sich nur auf die Anzeige von Fehlern
 * - Open/Closed: Erweiterbar durch verschiedene Props
 * 
 * KISS-Prinzip: Einfache, leicht verständliche Implementierung
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.message - Die anzuzeigende Fehlermeldung
 * @param {Function} props.onRetry - Optional: Callback-Funktion für den "Erneut versuchen"-Button
 * @param {string} props.variant - Optional: Variante der Fehleranzeige ('standard', 'inline', 'minimal')
 * @returns {JSX.Element} Die gerenderte ErrorDisplay-Komponente
 */
const ErrorDisplay = ({ 
    message = "Ein Fehler ist aufgetreten.", 
    onRetry,
    variant = 'standard'
}) => {
    // KISS: Einfache Varianten-Logik durch Objekte statt komplexer Bedingungen
    const variants = {
        standard: "max-w-5xl mx-auto p-4 text-center py-8 text-red-600",
        inline: "py-3 px-2 text-red-600",
        minimal: "text-red-600"
    };

    // Buttons als separate Komponenten für bessere Übersichtlichkeit (SRP)
    const RetryButton = () => (
        <button
            onClick={onRetry}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Erneut versuchen
        </button>
    );

    return (
        <div className={variants[variant] || variants.standard}>
            <p>{message}</p>
            {onRetry && <RetryButton />}
        </div>
    );
};

export default ErrorDisplay;