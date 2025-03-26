import { useState, useEffect } from 'react';
import HeroSection from '../components/layout/HeroSection';
import ExercisesCategories from '../components/exercises/ExercisesCategories.jsx';
import { getExerciseCategories } from "../services/exerciseCategoriesService.js";
import {getExerciseByCategory} from "../services/exercisesService.js";

const Exercises = () => {
    const [exerciseCategories, setExerciseCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);


  useEffect(() => {
        const loadExerciseCategories = async () => {
            try {
                const data = await getExerciseCategories();
                console.log('API Antwort:', data); // Wichtig zum Debuggen
                setExerciseCategories(data); // Direkt das gesamte data-Array setzen
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

      // Hier müsstest du eine API-Funktion aufrufen, die Übungen nach Kategorie lädt
      // z.B.: const exercisesData = await getExercisesByCategory(categoryId);
      // setExercises(exercisesData);

      // Beispiel-Mockdaten (durch tatsächlichen API-Aufruf ersetzen):
      await loadExercisesByCategory(categoryId);
      setExercises(mockExercises);
      setLoading(false);

    } catch (error) {
      console.error('Fehler beim Laden der Übungen:', error);
      setLoading(false);
    }
  };

  const loadExercisesByCategory = async (categoryId) => {
    return await getExerciseByCategory(categoryId);
  }

const renderExercises = () => {
  if (loading) {
    return <div className="text-center py-8">Übungen werden geladen...</div>;
  }

  if (!selectedCategory) {
    return null;
  }

  if (exercises.length === 0) {
    return <div className="text-center py-8">Keine Übungen in dieser Kategorie gefunden.</div>;
  }

  const categoryName = exerciseCategories.find(cat => cat.id === selectedCategory)?.name || '';

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Übungen: {categoryName}</h2>
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Zurück zu Kategorien
        </button>
      </div>

      <ul className="divide-y divide-gray-200">
        {exercises.map(exercise => (
          <li key={exercise.id} className="py-4">
            <h3 className="font-semibold">{exercise.name}</h3>
            <p className="text-gray-600 text-sm">{exercise.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};



return (
        <>
            <HeroSection title="Übungen" subtitle="Erstelle oder betrachte hier deine Übungen"/>
            <div className="max-w-5xl mx-auto">
                <ExercisesCategories categories={exerciseCategories} onCategoryClick={handleCategoryClick} />
            </div>
        </>
    );
}

export default Exercises;
