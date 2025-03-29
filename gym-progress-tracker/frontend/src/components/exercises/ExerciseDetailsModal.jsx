import React, { useEffect } from 'react'

const ExerciseDetailsModal = ({ exercise, onClose }) => {
    if (!exercise) return null;

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

    // Formatieren der Ausrüstungsliste
    const formatEquipment = (equipment) => {
        if (!equipment) return '';

        // Wenn es bereits ein String ist
        if (typeof equipment === 'string') {
            return equipment;
        }

        // Wenn es ein Array ist
        if (Array.isArray(equipment)) {
            return equipment.join(', ');
        }

        return String(equipment);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <span className="text-xl font-bold">&times;</span>
                </button>

                <h2 className="text-2xl font-bold mb-4">{exercise.name}</h2>

                <div className="space-y-4">
                    <div>
                        <p className="font-semibold text-gray-700">Beschreibung:</p>
                        <p className="text-gray-600">{exercise.description}</p>
                    </div>

                    {exercise.primary_muscle_group && (
                        <div>
                            <p className="font-semibold text-gray-700">Muskelgruppe:</p>
                            <p className="text-gray-600">{exercise.primary_muscle_group}</p>
                        </div>
                    )}

                    {exercise.equipment_needed && (
                        <div>
                            <p className="font-semibold text-gray-700">Ausrüstung:</p>
                            <p className="text-gray-600">{formatEquipment(exercise.equipment_needed)}</p>
                        </div>
                    )}

                    {exercise.difficulty_level && (
                        <div>
                            <p className="font-semibold text-gray-700">Schwierigkeitsgrad:</p>
                            <p className="text-gray-600">{exercise.difficulty_level}</p>
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
    )
}

export default ExerciseDetailsModal