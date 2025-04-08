import React, { useEffect, useState } from 'react';
import { getWorkouts, addWorkout } from '@/services/workoutService';
import HeroSection from "@/components/layout/HeroSection.jsx";
import WorkoutNav from "@/components/features/workouts/WorkoutNav.jsx";
import WorkoutCreate from "@/components/features/workouts/WorkoutCreate.jsx";
import WorkoutView from "@/components/features/workouts/WorkoutView.jsx";
import WorkoutEdit from "@/components/features/workouts/WorkoutEdit.jsx";
import useAuthRedirect from "@/hooks/useAuthRedirect.jsx";
import useWorkouts from "@/hooks/useWorkouts.jsx";

const Workout = () => {
  const [activeTab, setActiveTab] = useState('create');
  const { workouts, load, loading } = useWorkouts();

  useAuthRedirect();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);

    // Bei Wechsel zum Anzeigen-Tab die Workouts laden
    if (tabId === 'view') {
      loadWorkouts();
    }

    // Bei Wechsel zum Bearbeiten-Tab die Workout-Liste laden
    if (tabId === 'edit') {
      loadWorkoutsForEdit();
    }
  };

  const handleWorkoutSubmit = async (e) => {
    e.preventDefault();

    // Formular-Daten sammeln
    const formData = {
      name: e.target.name.value,
      description: e.target.description.value,
      difficulty_level: e.target.difficulty_level.value,
      target_audience: e.target.target_audience.value,
      goal: e.target.goal.value,
      estimated_duration_minutes: parseInt(e.target.estimated_duration_minutes.value),
      is_featured: e.target.is_featured.checked
    };

    try {
      const isOK = await addWorkout(formData);

      if (isOK) {
        alert('Workout erfolgreich hinzugefügt!');
        e.target.reset(); // Formular zurücksetzen
      } else {
        // Fehlermeldung anzeigen
        alert('Ein Fehler ist aufgetreten');
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Workouts:', error);
      alert('Fehler beim Hinzufügen des Workouts. Bitte versuche es später erneut.');
    }
  };


  return (
    <>
      {/* Hero Section */}
      <HeroSection title="Workouts" subtitle="Erstelle oder Bearbeite hier deine Workouts" />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <WorkoutNav activeTab={activeTab} handleTabClick={handleTabClick} />

        {/* Tab Content */}
        {activeTab === 'create' && <WorkoutCreate handleWorkoutSubmit={handleWorkoutSubmit} />}
        {activeTab === 'view' && <WorkoutView workouts={workouts} />}
        {activeTab === 'edit' && <WorkoutEdit workouts={workouts} />}
      </div>
    </>
  );
};

export default Workout;
