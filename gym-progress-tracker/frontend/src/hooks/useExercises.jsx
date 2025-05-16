import { useState, useEffect, useCallback } from "react";
import { getExerciseByCategory } from "@/services/exercisesService.js";

const useExercises = () => {
    const [exercises, setExercises] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);    
    
    // Fetch exercises when category changes
    useEffect(() => {
        const fetchExercises = async () => {
            if (!selectedCategory) {
                setExercises([]);
                return;
            }

            setIsLoading(true);
            setError(null);            try {
                // Verwenden des Service, der jetzt die gesamte Logik zur 
                // Verarbeitung der Kategorie-ID/Name übernimmt
                const data = await getExerciseByCategory(selectedCategory);
                setExercises(data || []);
            } catch (err) {
                console.error("Fehler beim Laden der Übungen:", err);
                setError(`Die Übungen konnten nicht geladen werden: ${err.message || "Unbekannter Fehler"}`);
                setExercises([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExercises();
    }, [selectedCategory]);

    // Handler to select a category
    const selectCategory = useCallback((categoryId) => {
        setSelectedCategory(categoryId);
    }, []);

    // Handler to clear selected category (go back to categories view)
    const clearSelectedCategory = useCallback(() => {
        setSelectedCategory(null);
    }, []);

    // Handler to add a new exercise to the list (if it matches current category)
    const addExerciseToList = useCallback((newExercise) => {
        if (newExercise.categoryId === selectedCategory) {
            setExercises(prevExercises => [...prevExercises, newExercise]);
        }
    }, [selectedCategory]);

    return {
        exercises,
        selectedCategory,
        isLoading,
        error,
        selectCategory,
        clearSelectedCategory,
        addExerciseToList
    };
};

export default useExercises;