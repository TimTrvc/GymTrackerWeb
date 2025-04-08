import React from 'react';
import PropTypes from 'prop-types';

/**
 * ExerciseCategoryCard - Zeigt eine Übungskategorie als Karte an
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Verantwortlich nur für die Anzeige einer Kategorie
 * - Open/Closed: Erweiterbar durch verschiedene Icon-Varianten
 * 
 * KISS: Einfache, klar strukturierte Komponente
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.name - Name der Kategorie
 * @param {string} props.description - Beschreibung der Kategorie
 * @param {number|string} props.category_id - ID der Kategorie
 * @param {Function} props.onCategoryClick - Callback-Funktion für Klick-Events
 * @param {string} props.iconVariant - Optional: Variante des Icons ('plus', 'dumbbell', 'running', 'swim')
 */
const ExerciseCategoryCard = ({ 
    name, 
    description, 
    category_id, 
    onCategoryClick,
    iconVariant = 'plus'
}) => {
    // Icon-Komponente extrahiert nach SRP (Single Responsibility Principle)
    const CategoryIcon = ({ variant }) => {
        // Verschiedene Icons für verschiedene Kategorietypen
        const icons = {
            plus: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
            ),
            dumbbell: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M18 5h-2a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zM6 5H4a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2z"/>
                    <line x1="8" y1="12" x2="16" y2="12" strokeWidth="2" />
                </svg>
            ),
            running: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
            ),
            swim: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
            )
        };

        return icons[variant] || icons.plus;
    };
    
    // Klick-Handler - verhindert Event-Bubbling
    const handleClick = (e) => {
        e.preventDefault();
        onCategoryClick(category_id);
    };

    return (
        <div 
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer" 
            onClick={handleClick}
            aria-label={`Kategorie ${name} öffnen`}
        >
            <div className="bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <CategoryIcon variant={iconVariant} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <p className="text-gray-500 text-sm">{description}</p>
        </div>
    );
};

// PropTypes für bessere Entwicklerfreundlichkeit und Typsicherheit
ExerciseCategoryCard.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onCategoryClick: PropTypes.func.isRequired,
    iconVariant: PropTypes.oneOf(['plus', 'dumbbell', 'running', 'swim'])
};

export default ExerciseCategoryCard;
