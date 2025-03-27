import React, { useState } from 'react';

const AddExerciseModal = ({
                              isOpen,
                              onClose,
                              exerciseCategories,
                              onAddExercise
                          }) => {
    const [exerciseName, setExerciseName] = useState('');
    const [exerciseDescription, setExerciseDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleSubmit = () => {
        if (!exerciseName || !selectedCategory) {
            alert('Bitte Name und Kategorie ausfüllen');
            return;
        }

        const newExercise = {
            name: exerciseName,
            description: exerciseDescription,
            category_id: selectedCategory
        };

        onAddExercise(newExercise);
        resetForm();
    };

    const resetForm = () => {
        setExerciseName('');
        setExerciseDescription('');
        setSelectedCategory('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Neue Übung hinzufügen</h2>
                    <p className="text-gray-500 text-sm">Erstellen Sie eine neue Übung für eine Kategorie</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Name der Übung"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Beschreibung
                        </label>
                        <textarea
                            id="description"
                            value={exerciseDescription}
                            onChange={(e) => setExerciseDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Beschreiben Sie die Übung"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Kategorie
                        </label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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