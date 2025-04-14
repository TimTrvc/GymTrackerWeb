import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import exercisesService from '@/services/exercisesService';
import LoadingDisplay from '@/components/common/LoadingDisplay';
import ErrorDisplay from '@/components/common/ErrorDisplay';

/**
 * ExerciseDetailsModal - Komponente zur Anzeige von Übungsdetails in einem Modal
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Fokussiert nur auf die Detailanzeige einer Übung
 * - Open/Closed: Erweiterbar für verschiedene Anzeigebereiche ohne Kerncode zu ändern
 * 
 * KISS: Einfache, klare Strukturierung der Detailanzeige
 * DRY: Wiederverwendung von UI-Elementen durch Detail-Komponenten
 * 
 * @param {Object} props - Komponenten-Props
 * @param {number|string} props.exerciseId - Die ID der anzuzeigenden Übung
 * @param {Object} props.exerciseData - Optional: Bereits geladene Übungsdaten
 * @param {Function} props.onClose - Callback zum Schließen des Modals
 */
const ExerciseDetailsModal = ({ exerciseId, exerciseData, onClose }) => {
    // State für das Laden der Übungsdaten
    const [exercise, setExercise] = useState(exerciseData || null);
    const [isLoading, setIsLoading] = useState(!exerciseData);
    const [error, setError] = useState(null);
    
    // Übungsdetails laden, wenn nur die ID übergeben wurde
    useEffect(() => {
        const fetchExerciseDetails = async () => {
            if (!exerciseId || exerciseData) return;
            
            setIsLoading(true);
            setError(null);
            
            try {
                const data = await exercisesService.getById(exerciseId);
                setExercise(data);
            } catch (err) {
                console.error("Fehler beim Laden der Übungsdetails:", err);
                setError("Die Übungsdetails konnten nicht geladen werden. Bitte versuchen Sie es später erneut.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchExerciseDetails();
    }, [exerciseId, exerciseData]);

    // Frühes Return, wenn keine Übung vorhanden ist (KISS-Prinzip)
    if (!exercise && !isLoading) return null;

    // Schließen mit ESC-Taste
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);

        // Cleanup-Funktion
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    // Hintergrund-Klick zum Schließen
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    /**
     * Helper-Funktion zum Format von Eigenschaften
     * Verbessert nach DRY-Prinzip
     */
    const formatProperty = (property) => {
        // Wenn es bereits ein String ist
        if (typeof property === 'string') {
            return property;
        }

        // Wenn es ein Array ist
        if (Array.isArray(property)) {
            return property.join(', ');
        }

        return String(property);
    };

    /**
     * Unterkomponente für einen Detailpunkt
     * Extrahiert nach SRP (Single Responsibility Principle)
     */
    const DetailItem = ({ label, value }) => {
        // Keine Anzeige wenn kein Wert vorhanden ist (KISS)
        if (!value) return null;
        
        const formattedValue = formatProperty(value);
        if (!formattedValue) return null;
        
        return (
            <div>
                <p className="font-semibold text-gray-700">{label}:</p>
                <p className="text-gray-600">{formattedValue}</p>
            </div>
        );
    };

    /**
     * Übersetzungsfunktion für Schwierigkeitsgrade
     * Hilft bei der Nutzerfreundlichkeit
     */
    const translateDifficulty = (level) => {
        const translations = {
            'beginner': 'Anfänger',
            'intermediate': 'Fortgeschritten',
            'advanced': 'Profi'
        };
        
        return translations[level] || level;
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleBackdropClick}
            aria-modal="true"
            role="dialog"
            aria-labelledby="exercise-detail-title"
        >
            <div 
                className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative"
                onClick={(e) => e.stopPropagation()} // Verhindert Bubble-Up
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    aria-label="Schließen"
                >
                    <span className="text-xl font-bold">&times;</span>
                </button>

                <h2 
                    id="exercise-detail-title" 
                    className="text-2xl font-bold mb-4"
                >
                    {exercise.name}
                </h2>

                <div className="space-y-4">
                    <DetailItem label="Beschreibung" value={exercise.description} />
                    <DetailItem label="Primäre Muskelgruppe" value={exercise.primary_muscle_group} />
                    <DetailItem label="Sekundäre Muskelgruppen" value={exercise.secondary_muscle_groups} />
                    <DetailItem label="Ausrüstung" value={exercise.equipment_needed} />
                    <DetailItem 
                        label="Schwierigkeitsgrad" 
                        value={translateDifficulty(exercise.difficulty_level)} 
                    />
                    <DetailItem label="Anweisungen" value={exercise.instructions} />

                    {exercise.is_compound && (
                        <div className="bg-blue-50 text-blue-700 p-2 rounded-md">
                            <p className="text-sm">
                                <span className="font-semibold">Verbundübung:</span> Diese Übung trainiert mehrere Muskelgruppen gleichzeitig.
                            </p>
                        </div>
                    )}

                    {(exercise.video_url || exercise.image_url) && (
                        <div className="border-t pt-4 mt-4">
                            {exercise.video_url && (
                                <a 
                                    href={exercise.video_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline block mb-2"
                                >
                                    Video zur Übung ansehen
                                </a>
                            )}
                            {exercise.image_url && (
                                <img 
                                    src={exercise.image_url} 
                                    alt={`Bild zur Übung ${exercise.name}`}
                                    className="mt-2 max-w-full h-auto rounded"
                                />
                            )}
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={onClose}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Schließen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// PropTypes für bessere Entwicklerfreundlichkeit und Typsicherheit
ExerciseDetailsModal.propTypes = {
    exercise: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        primary_muscle_group: PropTypes.string,
        secondary_muscle_groups: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]),
        equipment_needed: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]),
        difficulty_level: PropTypes.string,
        instructions: PropTypes.string,
        is_compound: PropTypes.bool,
        video_url: PropTypes.string,
        image_url: PropTypes.string
    }),
    onClose: PropTypes.func.isRequired
};

export default ExerciseDetailsModal;