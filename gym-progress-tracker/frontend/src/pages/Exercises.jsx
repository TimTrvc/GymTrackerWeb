import { useState, useEffect } from 'react';
import HeroSection from '../components/layout/HeroSection';
import ExercisesCategories from '../components/exercises/ExercisesCategories.jsx';
import { getExerciseCategories } from "../services/exerciseCategoriesService.js";

const Exercises = () => {
    const [exerciseCategories, setExerciseCategories] = useState([]);

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

    return (
        <>
            <HeroSection title="Übungen" subtitle="Erstelle oder betrachte hier deine Übungen"/>
            <div className="max-w-5xl mx-auto">
                <ExercisesCategories categories={exerciseCategories}/>
            </div>
        </>
    );
}

export default Exercises;