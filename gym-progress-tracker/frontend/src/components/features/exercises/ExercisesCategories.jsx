import React from "react";
import PropTypes from 'prop-types';
import ExerciseCategoryCard from "./ExerciseCategoryCard.jsx";
import Hoverer from "@/components/animation/Hoverer.jsx";

/**
 * ExercisesCategories - Zeigt eine Rasteranordnung von Übungskategorien an
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Verantwortlich nur für die Anordnung von Kategoriekarten
 * - Dependency Inversion: Abhängig von abstrakten Komponenten (ExerciseCategoryCard)
 * 
 * KISS: Einfache, klar strukturierte Komponente
 * DRY: Vermeidet Wiederholung von Kategorie-Anzeige-Logik
 * 
 * @param {Object} props - Komponenten-Props
 * @param {Array} props.categories - Liste der anzuzeigenden Kategorien
 * @param {Function} props.onCategoryClick - Callback-Funktion für Klick auf eine Kategorie
 * @param {Object} props.layout - Optional: Layout-Konfiguration für das Raster
 */
const ExercisesCategories = ({ 
    categories = [], 
    onCategoryClick,
    layout = {
        cols: {
            sm: 1,
            md: 2,
            lg: 4
        },
        gap: 4
    }
}) => {
    // Keine Kategorien vorhanden - Leerer Zustand
    if (!categories || categories.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                Keine Übungskategorien gefunden.
            </div>
        );
    }

    // Generieren der Grid-Klassen basierend auf Layout-Config (Open/Closed Principle)
    const getGridClasses = () => {
        const { cols, gap } = layout;
        return `grid grid-cols-${cols.sm} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg} gap-${gap} mb-8`;
    };

    // IconVariant-Funktion zum Zuweisen passender Icons basierend auf Kategorienamen
    // (Verbessert die Nutzererfahrung durch visuelle Differenzierung)
    const getIconVariant = (categoryName) => {
        const name = categoryName.toLowerCase();
        if (name.includes('kraft') || name.includes('gewicht')) return 'dumbbell';
        if (name.includes('lauf') || name.includes('cardio')) return 'running';
        if (name.includes('wasser') || name.includes('schwimm')) return 'swim';
        return 'plus';
    };

    return (
        <div className={getGridClasses()} aria-label="Übungskategorien">
            {categories.map((category) => (
                <Hoverer key={category.category_id}>
                    <ExerciseCategoryCard
                        name={category.name}
                        description={category.description}
                        category_id={category.category_id}
                        onCategoryClick={onCategoryClick}
                        iconVariant={getIconVariant(category.name)}
                    />
                </Hoverer>
            ))}
        </div>
    );
};

// PropTypes für bessere Entwicklerfreundlichkeit und Typsicherheit
ExercisesCategories.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string
        })
    ).isRequired,
    onCategoryClick: PropTypes.func.isRequired,
    layout: PropTypes.shape({
        cols: PropTypes.shape({
            sm: PropTypes.number,
            md: PropTypes.number,
            lg: PropTypes.number
        }),
        gap: PropTypes.number
    })
};

export default ExercisesCategories;
