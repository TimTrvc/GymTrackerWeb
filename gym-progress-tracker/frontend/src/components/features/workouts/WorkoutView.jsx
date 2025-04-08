import React from "react";
import PropTypes from 'prop-types';
import Hoverer from "../../animation/Hoverer.jsx";

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
      <DetailField label="Ziel" value={workout.goal} />
      <DetailField label="Dauer" value={`${workout.estimated_duration_minutes} Minuten`} />
      <DetailField label="Zielgruppe" value={workout.target_audience} />
    </div>
  );

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
  const WorkoutCard = ({ workout }) => (
    <Hoverer>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-2">{workout.name}</h3>
        <div className="text-gray-500 mb-4">{workout.description}</div>
        
        <WorkoutDetails workout={workout} />
        <ActionButtons workout={workout} />
        
        {workout.is_featured && <Badge type="featured" text="Featured" />}
      </div>
    </Hoverer>
  );

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
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      template_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      difficulty_level: PropTypes.string,
      goal: PropTypes.string,
      estimated_duration_minutes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      target_audience: PropTypes.string,
      is_featured: PropTypes.bool
    })
  ),
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default WorkoutView;
