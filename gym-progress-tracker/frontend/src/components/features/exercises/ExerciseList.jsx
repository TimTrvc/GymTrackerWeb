import React, { useState } from "react";
import LoadingDisplay from "@/components/common/LoadingDisplay.jsx";
import ErrorDisplay from "@/components/common/ErrorDisplay.jsx";
import exercisesService from '@/services/exercisesService';

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
 * @param {Function} props.onAddExerciseClick - Callback zum Hinzufügen einer Übung
 * @param {Function} props.onBackToCategoriesClick - Callback zur Rückkehr zur Kategorieübersicht
 */
const ExerciseList = ({
    exercises,
    isLoading,
    error,
    categoryName,
    onAddExerciseClick,
    onBackToCategoriesClick
}) => {
    // State to track which exercise is expanded
    const [expandedId, setExpandedId] = useState(null);
    const [details, setDetails] = useState({});
    const [loadingId, setLoadingId] = useState(null);
    const [errorId, setErrorId] = useState(null);

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
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-600 text-lg mb-2">Keine Übungen in dieser Kategorie gefunden.</p>
            <p className="text-gray-500">Klicken Sie oben auf "Übung hinzufügen", um die erste Übung in dieser Kategorie zu erstellen.</p>
        </div>
    );

    // Einzelne Übungskarte - extrahiert für bessere Lesbarkeit
    const ExerciseCard = ({ exercise }) => {
        const isExpanded = expandedId === exercise.exercise_id;

        const handleCardClick = async () => {
            if (isExpanded) {
                setExpandedId(null);
                return;
            }
            setExpandedId(exercise.exercise_id);
            if (!details[exercise.exercise_id]) {
                setLoadingId(exercise.exercise_id);
                setErrorId(null);
                try {
                    const data = await exercisesService.getById(exercise.exercise_id);
                    setDetails(prev => ({ ...prev, [exercise.exercise_id]: data }));
                } catch (err) {
                    setErrorId(exercise.exercise_id);
                } finally {
                    setLoadingId(null);
                }
            }
        };

        return (
            <div>
                <div
                    onClick={handleCardClick}
                    className={`bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition-shadow ${isExpanded ? 'border-blue-500 border-2' : ''}`}
                    aria-label={`Details für ${exercise.name} anzeigen`}
                >
                    <h3 className="font-bold text-lg">{exercise.name}</h3>
                    <p className="text-gray-600 truncate">{exercise.description}</p>
                </div>
                {isExpanded && (
                    <div className="mt-2 bg-gray-50 p-4 rounded border">
                        {loadingId === exercise.exercise_id && <LoadingDisplay message="Details werden geladen..." />}
                        {errorId === exercise.exercise_id && <ErrorDisplay message="Fehler: Die Übung konnte nicht geladen werden." />}
                        {details[exercise.exercise_id] && (
                            <>
                                <p><span className="font-semibold">Beschreibung:</span> {details[exercise.exercise_id].description}</p>
                                <p><span className="font-semibold">Primäre Muskelgruppe:</span> {details[exercise.exercise_id].primary_muscle_group}</p>
                                <p><span className="font-semibold">Sekundäre Muskelgruppen:</span> {Array.isArray(details[exercise.exercise_id].secondary_muscle_groups) ? details[exercise.exercise_id].secondary_muscle_groups.join(', ') : details[exercise.exercise_id].secondary_muscle_groups}</p>
                                <p><span className="font-semibold">Ausrüstung:</span> {Array.isArray(details[exercise.exercise_id].equipment_needed) ? details[exercise.exercise_id].equipment_needed.join(', ') : details[exercise.exercise_id].equipment_needed}</p>
                                <p><span className="font-semibold">Schwierigkeitsgrad:</span> {details[exercise.exercise_id].difficulty_level}</p>
                                <p><span className="font-semibold">Anweisungen:</span> {details[exercise.exercise_id].instructions}</p>
                                {details[exercise.exercise_id].is_compound && <p className="text-blue-700">Verbundübung: Diese Übung trainiert mehrere Muskelgruppen gleichzeitig.</p>}
                                {details[exercise.exercise_id].video_url && <a href={details[exercise.exercise_id].video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block mb-2">Video zur Übung ansehen</a>}
                                {details[exercise.exercise_id].image_url && <img src={details[exercise.exercise_id].image_url} alt={`Bild zur Übung ${details[exercise.exercise_id].name}`} className="mt-2 max-w-full h-auto rounded" />}
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

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