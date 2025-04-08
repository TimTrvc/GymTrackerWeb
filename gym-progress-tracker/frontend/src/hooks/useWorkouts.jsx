
import { useState } from 'react';
import { getWorkouts } from '@/services/workoutService';

export default function useWorkouts() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getWorkouts();
            setWorkouts(data.workouts.rows || []);
        } catch (error) {
            console.error("Fehler beim Laden der Workouts", error);
        } finally {
            setLoading(false);
        }
    };

    return { workouts, load, loading };
}
