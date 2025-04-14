import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Hoverer from "../../animation/Hoverer.jsx";
import { getWorkoutExercises } from "@/services/workoutExercisesService";
import exercisesService from "@/services/exercisesService";

/**
 * WorkoutView-Komponente zur Anzeige von Workouts
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Fokussiert sich nur auf die Anzeige von Workouts
 * - Open/Closed: Erweiterbar für verschiedene Ansichtsmodi
 * 
 * KISS: Klare, verständliche Komponentenstruktur
 * DRY: Wiederverwendbare UI-Komponenten für Workout-Karten
 * 
 * @param {Object} props - Komponenten-Props
 * @param {Array} props.workouts - Liste der anzuzeigenden Workouts
 * @param {Function} props.onView - Callback für "Ansehen"-Aktion
 * @param {Function} props.onEdit - Callback für "Bearbeiten"-Aktion
 * @param {Function} props.onDelete - Callback für "Löschen"-Aktion
 */
const WorkoutView = ({ 
  workouts = [], 
  onView = () => {}, 
  onEdit = () => {}, 
  onDelete = () => {} 
}) => {
  // State zum Speichern der Übungen für jedes Workout
  const [workoutExercises, setWorkoutExercises] = useState({});
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [exerciseDetails, setExerciseDetails] = useState({});
  
  // Funktion zum Laden der Übungen für ein Workout
  const loadExercisesForWorkout = async (workoutId) => {
    try {
      const exercises = await getWorkoutExercises(workoutId);
      setWorkoutExercises(prev => ({
        ...prev,
        [workoutId]: exercises
      }));
      
      // Für jede Übung die Details laden mit exercisesService
      exercises.forEach(async (exercise) => {
        try {
          const exerciseData = await exercisesService.getById(exercise.exercise_id);
          setExerciseDetails(prev => ({
            ...prev,
            [exercise.exercise_id]: exerciseData
          }));
        } catch (error) {
          console.error('Fehler beim Laden der Übungsdetails:', error);
        }
      });
    } catch (error) {
      console.error('Fehler beim Laden der Übungen:', error);
    }
  };
  
  // Funktion zum Ein-/Ausklappen eines Workouts
  const toggleWorkoutExpand = (workoutId) => {
    if (expandedWorkout === workoutId) {
      setExpandedWorkout(null);
    } else {
      setExpandedWorkout(workoutId);
      loadExercisesForWorkout(workoutId);
    }
  };
  
  /**
   * Komponente für den Leerzustand (keine Workouts)
   * Extrahiert als separate Komponente (Single Responsibility)
   */
  const EmptyState = () => (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
      <p className="text-gray-500">Keine Workouts gefunden. Erstellen Sie ein neues Workout im &quot;Erstellen&quot;-Tab.</p>
    </div>
  );
  /**
   * Komponente für die Workout-Details
   * Zeigt die Metadaten eines Workouts an
   */
  const WorkoutDetails = ({ workout }) => (
    <div className="grid grid-cols-2 gap-4 text-sm">
      {/* Workout-Detail-Felder */}
      <DetailField label="Schwierigkeit" value={workout.difficulty_level} />
      <DetailField label="Dauer" value={`${workout.duration_minutes} Minuten`} />
      <DetailField label="Sichtbarkeit" value={workout.is_public ? 'Öffentlich' : 'Privat'} />
      <DetailField label="Letzte Ausführung" value={workout.last_performed ? new Date(workout.last_performed).toLocaleDateString() : 'Nie'} />
    </div>
  );
  
  /**
   * Komponente für die Übungsliste eines Workouts
   */
  const WorkoutExercises = ({ workoutId }) => {
    const exercises = workoutExercises[workoutId] || [];
    
    if (exercises.length === 0) {
      return <p className="text-gray-500 mt-4">Keine Übungen für dieses Workout gefunden.</p>;
    }
    
    return (
      <div className="mt-4 border-t pt-4">
        <h4 className="text-lg font-semibold mb-2">Übungen</h4>
        <ul className="space-y-2">
          {exercises.map((exercise, index) => {
            const exerciseInfo = exerciseDetails[exercise.exercise_id] || {};
            return (
              <li key={exercise.workout_exercise_id || index} className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between">
                  <span className="font-medium">{index + 1}. {exerciseInfo.name || 'Übung laden...'}</span>
                  <span className="text-sm">{exercise.sets} Sätze × {exercise.reps} Wiederholungen</span>
                </div>
                {exercise.notes && (
                  <p className="text-sm text-gray-600 mt-1">{exercise.notes}</p>
                )}
                {exerciseInfo.primary_muscle_group && (
                  <p className="text-xs text-gray-500 mt-1">Primäre Muskelgruppe: {exerciseInfo.primary_muscle_group}</p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  /**
   * Komponente für ein einzelnes Detailfeld
   * Verbessert die Konsistenz und folgt dem DRY-Prinzip
   */
  const DetailField = ({ label, value }) => (
    <div>
      <span className="font-medium">{label}:</span> {value || 'Nicht angegeben'}
    </div>
  );

  /**
   * Komponente für die Aktionsschaltflächen
   * Extrahiert als separate Komponente (Single Responsibility)
   */
  const ActionButtons = ({ workout }) => (
    <div className="mt-4 flex space-x-2">
      <button 
        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
        onClick={() => onView(workout)}
        aria-label={`Workout "${workout.name}" ansehen`}
      >
        Ansehen
      </button>
      <button 
        className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
        onClick={() => onEdit(workout)}
        aria-label={`Workout "${workout.name}" bearbeiten`}
      >
        Bearbeiten
      </button>
      <button 
        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        onClick={() => onDelete(workout)}
        aria-label={`Workout "${workout.name}" löschen`}
      >
        Löschen
      </button>
    </div>
  );

  /**
   * Komponente für ein Badge (z.B. "Featured")
   * Wiederverwendbar für verschiedene Badge-Typen
   */
  const Badge = ({ type, text }) => {
    const styles = {
      featured: "bg-yellow-100 text-yellow-800",
      new: "bg-green-100 text-green-800",
      popular: "bg-blue-100 text-blue-800"
    };
    
    return (
      <div className={`mt-4 inline-block ${styles[type] || styles.featured} text-xs font-semibold px-2.5 py-0.5 rounded`}>
        {text}
      </div>
    );
  };
  /**
   * Komponente für eine einzelne Workout-Karte
   * Extrahiert als separate Komponente (Single Responsibility)
   */
  const WorkoutCard = ({ workout }) => {
    const isExpanded = expandedWorkout === workout.workout_id;
    
    return (
      <Hoverer>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold">{workout.name}</h3>
            <button 
              onClick={() => toggleWorkoutExpand(workout.workout_id)}
              className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
              aria-label={isExpanded ? "Übungen ausblenden" : "Übungen anzeigen"}
            >
              {isExpanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          <div className="text-gray-500 mb-4">{workout.description}</div>
          
          <WorkoutDetails workout={workout} />
          <ActionButtons workout={workout} />
          
          {workout.is_public && <Badge type="featured" text="Öffentlich" />}
          {workout.times_performed > 0 && (
            <Badge type="popular" text={`${workout.times_performed}× durchgeführt`} />
          )}
          
          {isExpanded && <WorkoutExercises workoutId={workout.workout_id} />}
        </div>
      </Hoverer>
    );
  };

  // Wenn keine Workouts vorhanden sind, zeige den Leerzustand an
  if (workouts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Meine Workouts</h2>
      <div className="space-y-4">
        {workouts.map((workout) => (
          <WorkoutCard 
            key={workout.id || workout.template_id || Math.random().toString(36).substring(2, 9)} 
            workout={workout} 
          />
        ))}
      </div>
    </div>
  );
};

// PropTypes für bessere Typsicherheit und Dokumentation
WorkoutView.propTypes = {
  workouts: PropTypes.arrayOf(
    PropTypes.shape({
      workout_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      duration_minutes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      difficulty_level: PropTypes.string,
      is_public: PropTypes.bool,
      times_performed: PropTypes.number,
      created_at: PropTypes.string,
      last_performed: PropTypes.string
    })
  ),
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default WorkoutView;
