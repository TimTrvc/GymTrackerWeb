import React, { useState } from 'react';

const AddExerciseModal = ({
                              isOpen,
                              onClose,
                              exerciseCategories,
                              onAddExercise
                          }) => {
    const [exercise, setExercise] = useState({
        name: '',
        description: '',
        category_id: '',
        instructions: '',
        difficulty_level: '',
        primary_muscle_group: '',
        secondary_muscle_groups: [],
        equipment_needed: [],
        is_compound: false,
        video_url: '',
        image_url: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle different input types
        if (type === 'checkbox') {
            setExercise(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (name === 'secondary_muscle_groups' || name === 'equipment_needed') {
            // Split comma-separated values into array
            setExercise(prev => ({
                ...prev,
                [name]: value.split(',').map(item => item.trim()).filter(item => item !== '')
            }));
        } else {
            setExercise(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = () => {
        // Validation
        if (!exercise.name || !exercise.category_id) {
            alert('Bitte Name und Kategorie ausfüllen');
            return;
        }

        onAddExercise(exercise);
        resetForm();
    };

    const resetForm = () => {
        setExercise({
            name: '',
            description: '',
            category_id: '',
            instructions: '',
            difficulty_level: '',
            primary_muscle_group: '',
            secondary_muscle_groups: [],
            equipment_needed: [],
            is_compound: false,
            video_url: '',
            image_url: ''
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Neue Übung hinzufügen</h2>
                    <p className="text-gray-500 text-sm">Erstellen Sie eine neue Übung für eine Kategorie</p>
                </div>

                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={exercise.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Name der Übung"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Beschreibung
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={exercise.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Beschreiben Sie die Übung"
                            rows="3"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Kategorie *
                        </label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={exercise.category_id}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Kategorie wählen</option>
                            {exerciseCategories.map((category) => (
                                <option
                                    key={category.category_id}
                                    value={category.category_id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Instructions */}
                    <div>
                        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                            Anweisungen
                        </label>
                        <textarea
                            id="instructions"
                            name="instructions"
                            value={exercise.instructions}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Detaillierte Ausführungsanweisungen"
                            rows="3"
                        />
                    </div>

                    {/* Difficulty Level */}
                    <div>
                        <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700 mb-1">
                            Schwierigkeitsstufe
                        </label>
                        <select
                            id="difficulty_level"
                            name="difficulty_level"
                            value={exercise.difficulty_level}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Wählen Sie eine Schwierigkeitsstufe</option>
                            <option value="beginner">Anfänger</option>
                            <option value="intermediate">Fortgeschritten</option>
                            <option value="advanced">Profi</option>
                        </select>
                    </div>

                    {/* Primary Muscle Group */}
                    <div>
                        <label htmlFor="primary_muscle_group" className="block text-sm font-medium text-gray-700 mb-1">
                            Primäre Muskelgruppe
                        </label>
                        <input
                            id="primary_muscle_group"
                            name="primary_muscle_group"
                            type="text"
                            value={exercise.primary_muscle_group}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Z.B. Brust, Rücken, Beine"
                        />
                    </div>

                    {/* Secondary Muscle Groups */}
                    <div>
                        <label htmlFor="secondary_muscle_groups" className="block text-sm font-medium text-gray-700 mb-1">
                            Sekundäre Muskelgruppen
                        </label>
                        <input
                            id="secondary_muscle_groups"
                            name="secondary_muscle_groups"
                            type="text"
                            value={exercise.secondary_muscle_groups.join(', ')}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Komma-getrennte Liste, z.B. Schultern, Trizeps"
                        />
                        <p className="text-xs text-gray-500 mt-1">Mehrere Muskelgruppen durch Komma trennen</p>
                    </div>

                    {/* Equipment Needed */}
                    <div>
                        <label htmlFor="equipment_needed" className="block text-sm font-medium text-gray-700 mb-1">
                            Benötigte Ausrüstung
                        </label>
                        <input
                            id="equipment_needed"
                            name="equipment_needed"
                            type="text"
                            value={exercise.equipment_needed.join(', ')}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Komma-getrennte Liste, z.B. Hantel, Langhantel"
                        />
                        <p className="text-xs text-gray-500 mt-1">Mehrere Ausrüstungen durch Komma trennen</p>
                    </div>

                    {/* Is Compound Exercise */}
                    <div className="flex items-center">
                        <input
                            id="is_compound"
                            name="is_compound"
                            type="checkbox"
                            checked={exercise.is_compound}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_compound" className="ml-2 block text-sm text-gray-900">
                            Ist eine Verbundübung (Compound Exercise)
                        </label>
                    </div>

                    {/* Video URL */}
                    <div>
                        <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-1">
                            Video-URL
                        </label>
                        <input
                            id="video_url"
                            name="video_url"
                            type="url"
                            value={exercise.video_url}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="URL zum Übungsvideo"
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                            Bild-URL
                        </label>
                        <input
                            id="image_url"
                            name="image_url"
                            type="url"
                            value={exercise.image_url}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="URL zum Übungsbild"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Übung hinzufügen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddExerciseModal;