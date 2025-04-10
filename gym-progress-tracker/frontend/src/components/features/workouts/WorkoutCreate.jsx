import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { addExerciseToWorkout } from '@/services/workoutExercisesService';
import useExercises from '@/hooks/useExercises';
import useExerciseCategories from '@/hooks/useExerciseCategories';
import LoadingDisplay from '@/components/common/LoadingDisplay';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { TextField, TextArea, SelectField, CheckboxField } from '@/components/common/FormElements';
import { getExerciseByCategory } from '@/services/exercisesService';

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
}) => {  // Formular-State mit initialValues
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [selectedExercises, setSelectedExercises] = useState([]);
  // Neue States für Übungen und Kategorien
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [exerciseReps, setExerciseReps] = useState(10);
  const [exerciseSets, setExerciseSets] = useState(3);
  const [restSeconds, setRestSeconds] = useState(60);
    // Übungskategorien abrufen
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useExerciseCategories();
  
  // Übungen über den useExercises Hook laden
  const { 
    exercises, 
    isLoading: exercisesLoading, 
    error: exercisesError,
    selectCategory,
    selectedCategory,
    clearSelectedCategory 
  } = useExercises();
  
  // Übungen für ausgewählte Kategorie laden
  useEffect(() => {
    if (selectedCategoryId) {
      selectCategory(selectedCategoryId);
    }
  }, [selectedCategoryId, selectCategory]);

  /**
   * Fügt eine ausgewählte Übung zur Liste der Workout-Übungen hinzu
   */
  const handleAddExercise = () => {
    if (!selectedExerciseId) {
      return; // Keine Übung ausgewählt
    }

    const exerciseToAdd = exercises.find(ex => ex.id === parseInt(selectedExerciseId));
    
    if (!exerciseToAdd) {
      return; // Übung nicht gefunden
    }

    const newExercise = {
      exercise_id: exerciseToAdd.id,
      name: exerciseToAdd.name,
      description: exerciseToAdd.description,
      sets: exerciseSets,
      reps: exerciseReps,
      rest_seconds: restSeconds,
      position: selectedExercises.length + 1
    };

    setSelectedExercises(prev => [...prev, newExercise]);
    
    // Formularfelder zurücksetzen
    setExerciseSets(3);
    setExerciseReps(10);
    setRestSeconds(60);
    setSelectedExerciseId('');
  };

  /**
   * Entfernt eine Übung aus der Liste der ausgewählten Übungen
   * @param {number} index - Index der zu entfernenden Übung
   */
  const handleRemoveExercise = (index) => {
    setSelectedExercises(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      // Positionen aktualisieren
      return updated.map((ex, idx) => ({
        ...ex,
        position: idx + 1
      }));
    });
  };

  /**
   * Aktualisiert das Formular bei Änderungen der Übungsparameter
   */
  const handleExerciseParamChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'exerciseSets':
        setExerciseSets(parseInt(value) || 0);
        break;
      case 'exerciseReps':
        setExerciseReps(parseInt(value) || 0);
        break;
      case 'restSeconds':
        setRestSeconds(parseInt(value) || 0);
        break;
      default:
        break;
    }
  };

  /**
   * Behandelt Änderungen der Kategorie-Auswahl
   */
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    setSelectedExerciseId(''); // Übungsauswahl zurücksetzen
  };

  /**
   * Behandelt Änderungen der Übungsauswahl
   */
  const handleExerciseChange = (e) => {
    setSelectedExerciseId(e.target.value);
  };

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Workout-Daten mit ausgewählten Übungen zusammenführen
    const completeFormData = {
      ...formData,
      exercises: selectedExercises
    };
    
    handleWorkoutSubmit(completeFormData);
  };
  // Rendert ein Lade- oder Fehler-Display bei Bedarf
  if (categoriesLoading || exercisesLoading) return <LoadingDisplay message="Übungsdaten werden geladen..." />;
  if (categoriesError) return <ErrorDisplay message={categoriesError} />;
  if (exercisesError) return <ErrorDisplay message={exercisesError} />;

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
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Workout-Details</h3>
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
        </div>

        <div className="border-t pt-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Übungen hinzufügen</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Kategorie
              </label>
              <select
                id="category"
                name="category"
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Kategorie wählen</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="exercise" className="block text-sm font-medium text-gray-700 mb-1">
                Übung
              </label>
              <select
                id="exercise"
                name="exercise"
                value={selectedExerciseId}
                onChange={handleExerciseChange}
                disabled={!selectedCategoryId || exercises.length === 0}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Übung wählen</option>
                {exercises.map(exercise => (
                  <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="exerciseSets" className="block text-sm font-medium text-gray-700 mb-1">
                Sätze
              </label>
              <input
                id="exerciseSets"
                name="exerciseSets"
                type="number"
                min="1"
                value={exerciseSets}
                onChange={handleExerciseParamChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="exerciseReps" className="block text-sm font-medium text-gray-700 mb-1">
                Wiederholungen
              </label>
              <input
                id="exerciseReps"
                name="exerciseReps"
                type="number"
                min="1"
                value={exerciseReps}
                onChange={handleExerciseParamChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="restSeconds" className="block text-sm font-medium text-gray-700 mb-1">
                Pause (Sekunden)
              </label>
              <input
                id="restSeconds"
                name="restSeconds"
                type="number"
                min="0"
                value={restSeconds}
                onChange={handleExerciseParamChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <button
              type="button"
              onClick={handleAddExercise}
              disabled={!selectedExerciseId}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Übung hinzufügen
            </button>
          </div>
        </div>

        {selectedExercises.length > 0 && (
          <div className="border-t pt-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Ausgewählte Übungen</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sätze</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wiederholungen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pause (s)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktionen</th>
                  </tr>
                </thead>                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedExercises.map((exercise, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{exercise.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{exercise.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{exercise.sets}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{exercise.reps}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{exercise.rest_seconds}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Entfernen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
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
