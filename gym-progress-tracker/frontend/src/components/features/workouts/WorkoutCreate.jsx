import React, { useState } from "react";
import PropTypes from 'prop-types';
import { addExerciseToWorkout } from '@/services/workoutExercisesService';
import useExercises from '@/hooks/useExercises';
import LoadingDisplay from '@/components/common/LoadingDisplay';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { TextField, TextArea, SelectField, CheckboxField } from '@/components/common/FormElements';

/**
 * WorkoutCreate - Komponente zum Erstellen eines neuen Workouts
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Formularfelder in eigene Komponenten extrahiert
 * - Open/Closed: Erweiterbar für weitere Formularfelder
 * 
 * KISS: Klare, fokussierte Komponenten
 * DRY: Wiederverwendbare Formularkomponenten
 * 
 * @param {Object} props - Komponenten-Props
 * @param {Function} props.handleWorkoutSubmit - Callback für das Absenden des Formulars
 * @param {Object} props.initialValues - Optionale Anfangswerte für das Formular
 */
const WorkoutCreate = ({ 
  handleWorkoutSubmit,
  initialValues = {
    name: '',
    description: '',
    difficulty_level: 'beginner',
    duration_minutes: 30,
    is_public: false
  }
}) => {
  // Formular-State mit initialValues
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [selectedExercises, setSelectedExercises] = useState([]);
  
  // Übungen über den useExercises Hook laden
  const { exercises, isLoading, error } = useExercises();

  /**
   * Behandelt Änderungen an Formularfeldern
   * @param {Event} e - Das Event-Objekt
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Checkbox-Werte speziell behandeln
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    // Fehler für dieses Feld zurücksetzen
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Validiert das Formular vor dem Absenden
   * @returns {boolean} Gibt true zurück, wenn das Formular gültig ist
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Erforderliche Felder prüfen
    if (!formData.name?.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }
    
    if (!formData.duration_minutes) {
      newErrors.duration_minutes = 'Dauer ist erforderlich';
    } else if (formData.duration_minutes < 1) {
      newErrors.duration_minutes = 'Dauer muss mindestens 1 Minute betragen';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Behandelt das Absenden des Formulars
   * @param {Event} e - Das Event-Objekt
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    handleWorkoutSubmit(formData);
  };

  // Rendert ein Lade- oder Fehler-Display bei Bedarf
  if (isLoading) return <LoadingDisplay message="Übungsdaten werden geladen..." />;
  if (error) return <ErrorDisplay message={error} />;

  // Optionen für das Schwierigkeitsgrad-Dropdown
  const difficultyOptions = [
    { value: 'beginner', label: 'Anfänger' },
    { value: 'intermediate', label: 'Fortgeschritten' },
    { value: 'advanced', label: 'Profi' },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Neues Workout erstellen</h2>
      
      <form onSubmit={handleSubmit}>
        <TextField 
          id="name"
          label="Name des Workouts"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          required
          error={errors.name}
        />
        
        <TextArea 
          id="description"
          label="Beschreibung"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          error={errors.description}
        />
        
        <SelectField 
          id="difficulty_level"
          label="Schwierigkeitsgrad"
          options={difficultyOptions}
          value={formData.difficulty_level}
          onChange={handleInputChange}
          error={errors.difficulty_level}
        />
        
        <TextField 
          id="duration_minutes"
          label="Dauer (Minuten)"
          type="number"
          min="1"
          value={formData.duration_minutes}
          onChange={handleInputChange}
          required
          error={errors.duration_minutes}
        />
        
        <CheckboxField 
          id="is_public"
          label="Workout öffentlich machen"
          checked={formData.is_public}
          onChange={handleInputChange}
        />
        
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Workout erstellen
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * PropTypes für bessere Typsicherheit und Dokumentation
 */
WorkoutCreate.propTypes = {
  handleWorkoutSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    difficulty_level: PropTypes.string,
    target_audience: PropTypes.string,
    goal: PropTypes.string,
    estimated_duration_minutes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_featured: PropTypes.bool
  })
};

export default WorkoutCreate;
