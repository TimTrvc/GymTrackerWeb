import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Hoverer from "../../animation/Hoverer.jsx";
import { getWorkoutExercises } from "@/services/workoutExercisesService";
import exercisesService from "@/services/exercisesService";
import XpRewardNotification from "@/components/features/avatar/XpRewardNotification";
import useActivityTracker from "@/hooks/useActivityTracker";


import WorkoutSession from "./WorkoutSession.jsx";
import { addTrainingSession } from '@/services/trainingSessionsService';
import { addExercisePerformance } from '@/services/exercisePerformanceService';

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
  onDelete = () => {},
  handleTabClick = () => {}
}) => {
  // State zum Speichern der Übungen für jedes Workout
  const [workoutExercises, setWorkoutExercises] = useState({});
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [exerciseDetails, setExerciseDetails] = useState({});
  // Workout-Session State
  const [activeSession, setActiveSession] = useState(null); // {workout, exercises}
    // Activity tracking and XP rewards
  const { xpReward, trackWorkoutCompletion, clearXpReward } = useActivityTracker();
  const [completedWorkouts, setCompletedWorkouts] = useState([]);

  const startWorkoutSession = async (workout) => {
    // Übungen laden (falls noch nicht geladen)
    let exercises = workoutExercises[workout.workout_id];
    if (!exercises) {
      try {
        exercises = await getWorkoutExercises(workout.workout_id);
        setWorkoutExercises(prev => ({ ...prev, [workout.workout_id]: exercises }));
      } catch (e) {
        alert('Fehler beim Laden der Übungen für das Workout.');
        return;
      }
    }
    setActiveSession({ workout, exercises });
  };

  // Workout-Session beenden und Ergebnisse speichern
  const finishWorkoutSession = async (sessionData) => {
    if (!activeSession) return;
    const { workout, exercises } = activeSession;
    setActiveSession(null);

    try {
      // 1. Trainingssession speichern
      const sessionPayload = {
        workout_id: workout.workout_id,
        session_date: new Date().toISOString(),
        duration_minutes: workout.duration_minutes || null,
        calories_burned: null,
        mood_rating: null,
        effort_level: null,
        notes: '',
        location: ''
      };
      const sessionRes = await addTrainingSession(sessionPayload);
      const sessionId = sessionRes?.trainingSession?.session_id;
      if (!sessionId) throw new Error('Session konnte nicht gespeichert werden.');

      // 2. Alle Übungsleistungen speichern
      // sessionData: { [exercise_id]: [{weight, reps}, ...] }
      console.log('sessionData keys:', Object.keys(sessionData));
      console.log('exercises array:', exercises);
      for (const [exerciseId, setsArr] of Object.entries(sessionData)) {
        // Versuche, die exercise_id flexibel zu finden (exercise_id oder id)
        const exercise = exercises.find(e => String(e.exercise_id ?? e.id) === String(exerciseId));
        if (!exercise) {
          console.warn('Exercise not found for id:', exerciseId, exercises);
          continue;
        }
        for (let setIdx = 0; setIdx < setsArr.length; setIdx++) {
          const set = setsArr[setIdx];
          if (!set.weight && !set.reps) continue; // Leere Sätze überspringen
          const perfPayload = {
            session_id: sessionId,
            exercise_id: exercise.exercise_id ?? exercise.id,
            set_number: setIdx + 1,
            reps: set.reps,
            weight: set.weight,
            is_warmup: false,
            is_dropset: false,
            is_failure: false,
            rpe: null,
            notes: ''
          };
          console.log('Sending performance:', perfPayload);
          await addExercisePerformance(perfPayload);
        }
      }
      alert('Workout abgeschlossen und gespeichert!');
    } catch (err) {
      alert('Fehler beim Speichern der Session: ' + (err.message || err));
    }
  };
  
  // Funktion zum Laden der Übungen für ein Workout
  const loadExercisesForWorkout = async (workoutId) => {
  // Workout-Session starten

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
    // Funktion zum Markieren eines Workouts als abgeschlossen und XP erhalten
  const markWorkoutCompleted = async (workout) => {
    if (completedWorkouts.includes(workout.workout_id)) return;
    
    try {
      // Anzahl der Übungen im Workout ermitteln
      const exercises = workoutExercises[workout.workout_id] || [];
      const exerciseCount = exercises.length;
      
      // Workout-Abschluss tracken und XP erhalten über den Hook
      await trackWorkoutCompletion(workout, exerciseCount);
      
      // Workout als abgeschlossen markieren
      setCompletedWorkouts([...completedWorkouts, workout.workout_id]);
      
    } catch (error) {
      console.error('Fehler beim Tracken des Workouts:', error);
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
    <div className="mt-4 flex flex-wrap gap-2 justify-between">
      <button
        onClick={() => startWorkoutSession(workout)}
        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center"
        aria-label={`Workout "${workout.name}" starten`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        Starten
      </button>
      <button 
        onClick={() => markWorkoutCompleted(workout)}
        className={`px-3 py-1 ${
          completedWorkouts.includes(workout.workout_id) 
            ? 'bg-green-200 text-green-800' 
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        } rounded transition-colors flex items-center`}
        disabled={completedWorkouts.includes(workout.workout_id)}
        aria-label={`Workout "${workout.name}" abschließen`}
      >
        {completedWorkouts.includes(workout.workout_id) ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Abgeschlossen
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Abschließen
          </>
        )}
      </button>
      <div className="flex space-x-2">
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

  // Wenn eine Workout-Session aktiv ist, zeige diese an
  if (activeSession) {
    return (
      <WorkoutSession
        workout={activeSession.workout}
        exercises={activeSession.exercises}
        onFinish={finishWorkoutSession}
      />
    );
  }
  // Wenn keine Workouts vorhanden sind, zeige den Leerzustand an
  if (workouts.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="max-w-3xl mx-auto relative">
      {xpReward && (
        <XpRewardNotification
          xpAmount={xpReward.amount}
          message={xpReward.message}
          isLevelUp={xpReward.isLevelUp}
          onAnimationComplete={clearXpReward}
        />
      )}
      <h2 className="text-2xl font-bold mb-6">Meine Workouts</h2>
      <div className="space-y-4">
        {workouts.map((workout) => (
          <WorkoutCard 
            key={workout.id || workout.template_id || Math.random().toString(36).substring(2, 9)} 
            workout={workout} 
          />
        ))}
      </div>
      {/* Floating Action Button für neues Workout */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-4xl transition-all"
        title="Neues Workout erstellen"
        aria-label="Neues Workout erstellen"
        onClick={() => handleTabClick('create')}
      >
        +
      </button>
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
