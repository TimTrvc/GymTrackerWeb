import {useEffect, useState} from "react";
import {getExerciseCategories} from "@/services/exerciseCategoriesService.js";

/**
 * Custom Hook zum Abrufen und Verwalten von Übungskategorien.
 * @returns {{categories: Array, isLoading: boolean, error: Error|null}}
 */
const useExerciseCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCategories = async () => {
            setIsLoading(true);
            setError(null); // Reset error state on new fetch
            try {
                const data = await getExerciseCategories();
                setCategories(data || []);
            } catch (err) {
                console.error('Fehler beim Laden der Übungskategorien:', err);
                setError(err); // Set error state
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, []); // Empty dependency array means this runs once on mount

    return { categories, isLoading, error };
}

export default useExerciseCategories;