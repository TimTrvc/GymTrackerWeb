import React, { useEffect, useState } from 'react';
import { getWorkouts, addWorkout } from '@/services/workoutService';
import HeroSection from "@/components/layout/HeroSection.jsx";
import WorkoutNav from "@/components/features/workouts/WorkoutNav.jsx";
import WorkoutCreate from "@/components/features/workouts/WorkoutCreate.jsx";
import WorkoutView from "@/components/features/workouts/WorkoutView.jsx";
import WorkoutEdit from "@/components/features/workouts/WorkoutEdit.jsx";
import { useNavigate } from 'react-router';

// Constants
const PAGE_TITLE = "Workouts";
const PAGE_SUBTITLE = "Erstelle oder Bearbeite hier deine Workouts";
const SUCCESS_MESSAGE = "Workout erfolgreich hinzugefügt!";
const ERROR_MESSAGE = "Fehler beim Hinzufügen des Workouts. Bitte versuche es später erneut.";

// Layout component for consistent structure
const WorkoutLayout = ({ children }) => (
  <>
    <HeroSection title={PAGE_TITLE} subtitle={PAGE_SUBTITLE} />
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  </>
);

// Tab content component to handle conditional rendering
const TabContent = ({ activeTab, workouts, handleWorkoutSubmit }) => {
  switch (activeTab) {
    case 'create':
      return <WorkoutCreate handleWorkoutSubmit={handleWorkoutSubmit} />;
    case 'view':
      return <WorkoutView workouts={workouts} />;
    case 'edit':
      return <WorkoutEdit workouts={workouts} />;
    default:
      return null;
  }
};

// Custom hook for authentication check
const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
};

// Custom hook for workout data management
const useWorkoutData = () => {
  const [workouts, setWorkouts] = useState([]);

  const loadWorkouts = async () => {
    try {
      const data = await getWorkouts();
      setWorkouts(data.workouts || []);
    } catch (error) {
      console.error('Fehler beim Laden der Workouts:', error);
    }
  };  const handleWorkoutSubmit = async (formData) => {
    // Formdata wird jetzt direkt als Objekt übergeben
    // Anpassung der benötigten Felder
    const workoutData = {
      name: formData.name,
      description: formData.description,
      difficulty_level: formData.difficulty_level,
      duration_minutes: formData.duration_minutes,
      is_public: formData.is_public
    };
    
    try {
      const isOK = await addWorkout(workoutData);

      if (isOK) {
        alert(SUCCESS_MESSAGE);
        // Formular zurücksetzen oder zu View-Tab wechseln könnte hier ergänzt werden
      } else {
        alert(ERROR_MESSAGE);
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Workouts:', error);
      alert(ERROR_MESSAGE);
    }
  };

  return { workouts, loadWorkouts, handleWorkoutSubmit };
};

const Workout = () => {
  const [activeTab, setActiveTab] = useState('create');
  
  // Use custom hooks
  useAuthCheck();
  const { workouts, loadWorkouts, handleWorkoutSubmit } = useWorkoutData();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);

    // Load workouts when switching to view or edit tabs
    if (tabId === 'view' || tabId === 'edit') {
      loadWorkouts();
    }
  };

  return (
    <WorkoutLayout>
      {/* Tab Navigation */}
      <WorkoutNav activeTab={activeTab} handleTabClick={handleTabClick} />

      {/* Tab Content */}
      <TabContent 
        activeTab={activeTab} 
        workouts={workouts} 
        handleWorkoutSubmit={handleWorkoutSubmit} 
      />
    </WorkoutLayout>
  );
};

export default Workout;
