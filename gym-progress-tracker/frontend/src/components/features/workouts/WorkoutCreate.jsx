import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { addExerciseToWorkout } from '@/services/workoutExercisesService';

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
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  
  // Übungen laden
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/exercises');
        const data = await response.json();
        setExercises(data);
      } catch (error) {
        console.error('Fehler beim Laden der Übungen:', error);
      }
    };
    
    fetchExercises();
  }, []);

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
    
    if (!formData.estimated_duration_minutes) {
      newErrors.estimated_duration_minutes = 'Dauer ist erforderlich';
    } else if (formData.estimated_duration_minutes < 1) {
      newErrors.estimated_duration_minutes = 'Dauer muss mindestens 1 Minute betragen';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Behandelt das Absenden des Formulars
   * @param {Event} e - Das Event-Objekt
   */
  const onSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      handleWorkoutSubmit(formData);
    }
  };

  // Wiederverwendbare Formularkomponenten (DRY-Prinzip)

  /**
   * TextField-Komponente
   */
  const TextField = ({ id, label, required = false, ...rest }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={id}
        className={`w-full px-4 py-2 border ${errors[id] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        onChange={handleInputChange}
        value={formData[id] || ''}
        {...rest}
      />
      {errors[id] && <p className="mt-1 text-sm text-red-500">{errors[id]}</p>}
    </div>
  );

  /**
   * TextArea-Komponente
   */
  const TextArea = ({ id, label, rows = 4, ...rest }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        className={`w-full px-4 py-2 border ${errors[id] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        onChange={handleInputChange}
        value={formData[id] || ''}
        {...rest}
      ></textarea>
      {errors[id] && <p className="mt-1 text-sm text-red-500">{errors[id]}</p>}
    </div>
  );

  /**
   * Select-Komponente
   */
  const SelectField = ({ id, label, options, ...rest }) => (
    <div>
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
        {label}
      </label>
      <select
        id={id}
        name={id}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onChange={handleInputChange}
        value={formData[id] || ''}
        {...rest}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[id] && <p className="mt-1 text-sm text-red-500">{errors[id]}</p>}
    </div>
  );

  /**
   * Checkbox-Komponente
   */
  const CheckboxField = ({ id, label, ...rest }) => (
    <div className="mb-6">
      <label className="flex items-center">
        <input
          type="checkbox"
          id={id}
          name={id}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          onChange={handleInputChange}
          checked={formData[id] || false}
          {...rest}
        />
        <span className="ml-2 text-gray-700">{label}</span>
      </label>
    </div>
  );
  // Handler für das Hinzufügen einer Übung zum Workout
  const handleAddExercise = () => {
    const newExercise = {
      id: Date.now(), // temporäre ID für das Frontend
      exercise_id: '',
      sets: 3,
      reps: '8-12',
      rest_seconds: 60,
      position: selectedExercises.length + 1,
      notes: ''
    };
    
    setSelectedExercises([...selectedExercises, newExercise]);
  };
  
  // Handler zum Entfernen einer Übung aus dem Workout
  const handleRemoveExercise = (index) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises.splice(index, 1);
    // Positionen anpassen
    const reorderedExercises = updatedExercises.map((ex, idx) => ({
      ...ex,
      position: idx + 1
    }));
    setSelectedExercises(reorderedExercises);
  };
  
  // Handler für Änderungen an den Übungsdaten
  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    setSelectedExercises(updatedExercises);
  };
  
  // Modifizierter onSubmit Handler zum Verarbeiten des kompletten Workouts mit Übungen
  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // 1. Workout speichern
        const workoutResponse = await handleWorkoutSubmit(formData);
        const workoutId = workoutResponse.workout.workout_id;
        
        // 2. Für jede ausgewählte Übung einen Eintrag in workout_exercises erstellen
        if (workoutId) {
          const exercisePromises = selectedExercises.map(exercise => 
            addExerciseToWorkout({
              workout_id: workoutId,
              exercise_id: exercise.exercise_id,
              position: exercise.position,
              sets: exercise.sets,
              reps: exercise.reps,
              rest_seconds: exercise.rest_seconds,
              notes: exercise.notes
            })
          );
          
          await Promise.all(exercisePromises);
        }
        
        // Formular zurücksetzen
        setFormData(initialValues);
        setSelectedExercises([]);
      } catch (error) {
        console.error('Fehler beim Erstellen des Workouts:', error);
      }
    }
  };
  
  // Dropdown-Optionen
  const difficultyOptions = [
    { value: 'beginner', label: 'Anfänger' },
    { value: 'intermediate', label: 'Fortgeschritten' },
    { value: 'advanced', label: 'Profi' }
  ];
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Neues Workout erstellen</h2>

      <form onSubmit={onSubmit}>
        <TextField
          id="name"
          label="Name des Workouts"
          type="text"
          required
        />

        <TextArea
          id="description"
          label="Beschreibung"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <SelectField
            id="difficulty_level"
            label="Schwierigkeitsgrad"
            options={difficultyOptions}
          />

          <TextField
            id="duration_minutes"
            label="Dauer (Minuten)"
            type="number"
            min="1"
            required
          />
        </div>

        <CheckboxField
          id="is_public"
          label="Workout öffentlich machen"
        />
        
        {/* Übungen-Sektion */}
        <div className="mt-8 mb-6 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Übungen hinzufügen</h3>
          
          {selectedExercises.length === 0 ? (
            <div className="text-gray-500 mb-4 text-center py-4">
              Keine Übungen hinzugefügt. Füge unten Übungen zu deinem Workout hinzu.
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {selectedExercises.map((exercise, index) => (
                <div key={exercise.id} className="p-4 border rounded-md bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">{`Übung ${index + 1}`}</h4>
                    <button 
                      type="button"
                      onClick={() => handleRemoveExercise(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Entfernen
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Übung</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={exercise.exercise_id}
                        onChange={(e) => handleExerciseChange(index, 'exercise_id', e.target.value)}
                      >
                        <option value="">-- Übung auswählen --</option>
                        {exercises.map(ex => (
                          <option key={ex.exercise_id} value={ex.exercise_id}>
                            {ex.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Position</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={exercise.position}
                        onChange={(e) => handleExerciseChange(index, 'position', parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Anzahl Sätze</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Wiederholungen</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        placeholder="z.B. 8-12"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Pause (Sek.)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={exercise.rest_seconds}
                        onChange={(e) => handleExerciseChange(index, 'rest_seconds', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Notizen</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={exercise.notes || ''}
                      onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                      rows="2"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <button
            type="button"
            onClick={handleAddExercise}
            className="mb-6 px-4 py-2 border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Übung hinzufügen
          </button>
        </div>

        <div className="flex justify-end mt-6 pt-6 border-t">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Workout erstellen
          </button>
        </div>
      </form>
    </div>
  );
};

// PropTypes für bessere Typsicherheit und Dokumentation
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
