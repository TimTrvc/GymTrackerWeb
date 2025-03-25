import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getWorkouts, addWorkout } from '../services/workoutService';
import HeroSection from "../components/layout/HeroSection.jsx";
import WorkoutNav from "../components/workouts/WorkoutNav.jsx";
import WorkoutCreate from "../components/workouts/WorkoutCreate.jsx";
import WorkoutView from "../components/workouts/WorkoutView.jsx";
import WorkoutEdit from "../components/workouts/WorkoutEdit.jsx";

const Workout = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [workouts, setWorkouts] = useState([]);
  const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Prüfen, ob der Benutzer authentifiziert ist
    const token = localStorage.getItem('token');

    // Falls kein Token vorhanden ist, zur Login-Seite umleiten
    if (!token) {
      window.location.href = '/login';
      return;
    }
  }, []);

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

  const loadWorkouts = async () => {
    try {
      const data = await getWorkouts();
      setWorkouts(data.workouts.rows || []);
    } catch (error) {
      console.error('Fehler beim Laden der Workouts:', error);
    }
  };

  const loadWorkoutsForEdit = async () => {
    // Hier können Sie die Logik für das Laden der Workouts zum Bearbeiten implementieren
    await loadWorkouts();
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
