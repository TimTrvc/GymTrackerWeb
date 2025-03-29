import { useState, useEffect } from 'react';
import HeroSection from '../components/layout/HeroSection';
import ExercisesCategories from '../components/exercises/ExercisesCategories.jsx';
import AddExerciseModal from '../components/exercises/AddExerciseModal.jsx';
import { getExerciseCategories } from "../services/exerciseCategoriesService.js";
import {getExerciseByCategory, createExercise, getExerciseById} from "../services/exercisesService.js";
import ExerciseDetailsModal from "../components/exercises/ExerciseDetailsModal.jsx";

const Exercises = () => {
    const [exerciseCategories, setExerciseCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);

    useEffect(() => {
        const loadExerciseCategories = async () => {
            try {
                const data = await getExerciseCategories();
                setExerciseCategories(data || []);
            } catch (error) {
                console.error('Fehler beim Laden der Workouts:', error);
            }
        };

        loadExerciseCategories();
    }, []);

    const handleCategoryClick = async (categoryId) => {
        try {
            setLoading(true);
            setSelectedCategory(categoryId);
            const exercisesLoaded = await loadExercisesByCategory(categoryId);
            setExercises(exercisesLoaded);
            setLoading(false);
        } catch (error) {
            console.error('Fehler beim Laden der Übungen:', error);
            setLoading(false);
        }
    };

    const loadExercisesByCategory = async (categoryId) => {
        return await getExerciseByCategory(categoryId);
    };

    const handleAddExercise = async (newExercise) => {
        try {
            const addedExercise = await createExercise(newExercise);

            // If the added exercise is in the currently selected category, update the list
            if (addedExercise.category_id === selectedCategory) {
                setExercises([...exercises, addedExercise]);
            }

            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Fehler beim Hinzufügen der Übung:', error);
            alert('Die Übung konnte nicht hinzugefügt werden.');
        }
    };

    const handleViewDetails = async (exerciseId) => {
        try {
            const exercise = await getExerciseById(exerciseId);
            setSelectedExercise(exercise);
        } catch (error) {
            console.error('Fehler beim Abrufen der Übung:', error);
            alert('Die Übung konnte nicht abgerufen werden!');
        }
    }

    const renderExercises = () => {
        if (loading) {
            return <div className="text-center py-8">Übungen werden geladen...</div>;
        }

        if (!selectedCategory) {
            return null;
        }

        if (exercises == undefined || exercises.length === 0) {
            return (
                <>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Übungen: {selectedCategory}</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="text-indigo-600 hover:text-indigo-800 mr-4"
                        >
                            Zurück zu Kategorien
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Übung hinzufügen
                        </button>
                    </div>
                </div>
                <div className="text-center py-8">
                    Keine Übungen in dieser Kategorie gefunden.
                </div>
                </>
            );
        }

        const categoryName = exerciseCategories.find(cat => cat.id === selectedCategory)?.name || '';

        return (
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Übungen: {categoryName}</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="text-indigo-600 hover:text-indigo-800 mr-4"
                        >
                            Zurück zu Kategorien
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Übung hinzufügen
                        </button>
                    </div>
                </div>

                <ul className="divide-y divide-gray-200">
                    {exercises.map(exercise => (
                        <li key={exercise.id} className="py-4 flex items-center justify-between">
                            <div className="flex-grow">
                                <h3 className="font-semibold">{exercise.name}</h3>
                                <p className="text-gray-600 text-sm">{exercise.description}</p>
                            </div>
                            <button
                                onClick={() => handleViewDetails(exercise.exercise_id)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4">
                                Details
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <>
            <HeroSection title="Übungen" subtitle="Erstelle oder betrachte hier deine Übungen" />
            <div className="max-w-5xl mx-auto p-4">
                {!selectedCategory && (
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Kategorien</h1>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Übung hinzufügen
                        </button>
                    </div>
                )}

                {!selectedCategory && (
                    <ExercisesCategories
                        categories={exerciseCategories}
                        onCategoryClick={handleCategoryClick}
                    />
                )}

                {renderExercises()}
            </div>

            <AddExerciseModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                exerciseCategories={exerciseCategories}
                onAddExercise={handleAddExercise}
            />

            {selectedExercise && (
                <ExerciseDetailsModal
                    exercise={selectedExercise}
                    onClose={() => setSelectedExercise(null)}
                />
            )}
        </>
    );
};

export default Exercises;