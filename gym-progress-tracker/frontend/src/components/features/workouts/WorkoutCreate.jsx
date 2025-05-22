import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { addExerciseToWorkout } from '@/services/workoutExercisesService';
import useExercises from '@/hooks/useExercises';
import useExerciseCategories from '@/hooks/useExerciseCategories';
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
  handleTabClick = null,
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
  }, [selectedCategoryId, selectCategory]);  /**
   * Fügt eine ausgewählte Übung zur Liste der Workout-Übungen hinzu
   */
  const handleAddExercise = () => {
    if (!selectedExerciseId) {
      return; // Keine Übung ausgewählt
    }

    console.log("Versuche Übung hinzuzufügen mit ID:", selectedExerciseId);
    console.log("Verfügbare Übungen:", exercises);

    // Versuch 1: Direkte ID-Übereinstimmung
    let exerciseToAdd = exercises.find(ex => String(ex.id) === String(selectedExerciseId));

    // Versuch 2: Falls es der Name statt der ID ist
    if (!exerciseToAdd) {
      exerciseToAdd = exercises.find(ex => ex.name === selectedExerciseId);
    }

    // Versuch 3: Nimm die Übung aus dem Select-Element
    if (!exerciseToAdd) {
      const selectedOption = document.querySelector(`select[name="exercise"] option:checked`);
      if (selectedOption) {
        const optionText = selectedOption.textContent;
        console.log("Ausgewählter Option-Text:", optionText);
        exerciseToAdd = exercises.find(ex => ex.name === optionText);
      }
    }
    
    if (!exerciseToAdd) {
      console.error("Übung nicht gefunden. Manuelle Erstellung mit Name:", selectedExerciseId);
      // Als letzte Möglichkeit: Manuell Übungsdaten erstellen
      exerciseToAdd = {
        id: Date.now(), // Verwende Timestamp als Ersatz-ID
        name: typeof selectedExerciseId === 'string' ? selectedExerciseId : 'Unbekannte Übung',
        description: ""
      };
    }

    const newExercise = {
      exercise_id: exerciseToAdd.exercise_id ?? exerciseToAdd.id,
      name: exerciseToAdd.name,
      description: exerciseToAdd.description || "",
      sets: exerciseSets,
      reps: exerciseReps,
      rest_seconds: restSeconds,
      position: selectedExercises.length + 1
    };
    
    console.log("Hinzugefügte Übung:", newExercise);
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
    // Speichere die ID der ausgewählten Übung, nicht den Namen
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
                Kategorie              </label>              <select
                id="category"
                name="category"
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >                <option value="">Kategorie wählen</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="exercise" className="block text-sm font-medium text-gray-700 mb-1">
                Übung
              </label>              <select
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
        </div>        {selectedExercises.length > 0 && (
          <div className="border-t pt-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Ausgewählte Übungen</h3>
            <ul className="space-y-3">
              {selectedExercises.map((exercise, index) => (
                <li 
                  key={`exercise-${exercise.exercise_id || 'unknown'}-${index}`}
                  className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full px-2 py-1">
                        #{exercise.position}
                      </span>
                      <h4 className="font-medium text-lg">{exercise.name}</h4>
                    </div>                    <div className="mt-2 flex flex-wrap gap-4">
                      <span key={`set-${index}`} className="inline-flex items-center text-sm">
                        <span className="font-medium mr-1">Sätze:</span> {exercise.sets}
                      </span>
                      <span key={`rep-${index}`} className="inline-flex items-center text-sm">
                        <span className="font-medium mr-1">Wiederholungen:</span> {exercise.reps}
                      </span>
                      <span key={`rest-${index}`} className="inline-flex items-center text-sm">
                        <span className="font-medium mr-1">Pause:</span> {exercise.rest_seconds}s
                      </span>
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(index)}
                      className="bg-red-50 text-red-600 px-3 py-1 rounded-md hover:bg-red-100 transition-colors text-sm"
                    >
                      Entfernen
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Workout erstellen
          </button>
          {handleTabClick && (
            <button
              type="button"
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition-colors"
              onClick={() => handleTabClick('view')}
            >
              Abbrechen
            </button>
          )}
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
