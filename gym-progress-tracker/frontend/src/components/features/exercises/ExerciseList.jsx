import React from "react";
import LoadingDisplay from "@/components/common/LoadingDisplay.jsx";
import ErrorDisplay from "@/components/common/ErrorDisplay.jsx";

/**
 * ExerciseList-Komponente zur Anzeige einer Liste von Übungen
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Fokussiert nur auf die Anzeige der Übungsliste
 * - Open/Closed: Erweiterbar durch verschiedene Props
 * - Dependency Inversion: Abhängigkeit von abstrakten Komponenten (LoadingDisplay, ErrorDisplay)
 * 
 * KISS-Prinzip: Klare, verständliche Struktur mit separaten UI-Komponenten
 * 
 * @param {Object} props - Komponenten-Props
 * @param {Array} props.exercises - Liste der anzuzeigenden Übungen
 * @param {boolean} props.isLoading - Ladezustand
 * @param {string} props.error - Fehlermeldung, falls vorhanden
 * @param {string} props.categoryName - Name der aktuellen Kategorie
 * @param {Function} props.onViewDetails - Callback für Detailansicht einer Übung
 * @param {Function} props.onAddExerciseClick - Callback zum Hinzufügen einer Übung
 * @param {Function} props.onBackToCategoriesClick - Callback zur Rückkehr zur Kategorieübersicht
 */
const ExerciseList = ({
    exercises,
    isLoading,
    error,
    categoryName,
    onViewDetails,
    onAddExerciseClick,
    onBackToCategoriesClick
}) => {
    // Extrahierte UI-Komponenten nach SRP (Single Responsibility Principle)
    
    // Header-Komponente mit Zurück-Button und Titel
    const ListHeader = () => (
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
                <button
                    onClick={onBackToCategoriesClick}
                    className="mr-2 text-blue-500 hover:text-blue-700"
                    aria-label="Zurück zur Kategorieübersicht"
                >
                    ← Zurück
                </button>
                <h1 className="text-2xl font-bold">{categoryName}</h1>
            </div>
            <button
                onClick={onAddExerciseClick}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                aria-label="Neue Übung hinzufügen"
            >
                Übung hinzufügen
            </button>
        </div>
    );

    // Komponente für leere Liste
    const EmptyState = () => (
        <div className="text-center py-8">
            Keine Übungen in dieser Kategorie gefunden.
        </div>
    );

    // Einzelne Übungskarte - extrahiert für bessere Lesbarkeit
    const ExerciseCard = ({ exercise }) => (
        <div
            onClick={() => onViewDetails(exercise.exercise_id)}
            className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition-shadow"
            aria-label={`Details für ${exercise.name} anzeigen`}
        >
            <h3 className="font-bold text-lg">{exercise.name}</h3>
            <p className="text-gray-600 truncate">{exercise.description}</p>
        </div>
    );

    // Übungsliste
    const ExerciseGrid = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map(exercise => (
                <ExerciseCard 
                    key={exercise.exercise_id} 
                    exercise={exercise} 
                />
            ))}
        </div>
    );

    // Hauptinhalt basierend auf Zustand (KISS: klare, verständliche Bedingungen)
    const renderContent = () => {
        if (isLoading) return <LoadingDisplay message="Übungen werden geladen..." variant="spinner" />;
        if (error) return <ErrorDisplay message={error} />;
        if (!exercises || exercises.length === 0) return <EmptyState />;
        return <ExerciseGrid />;
    };

    return (
        <>
            <ListHeader />
            {renderContent()}
        </>
    );
};

export default ExerciseList;