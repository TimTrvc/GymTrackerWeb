import React, { useState } from "react";
import { getWorkoutExercises, addExerciseToWorkout, removeExerciseFromWorkout } from '@/services/workoutExercisesService';
import exercisesService from '@/services/exercisesService';
import workoutService from '@/services/workoutService';
import useExercises from '@/hooks/useExercises';
import { TextField, TextArea, SelectField, CheckboxField } from '@/components/common/FormElements';

const WorkoutEdit = ({ workouts }) => {
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [formData, setFormData] = useState({});
  const [workoutExercises, setWorkoutExercises] = useState({});
  const [errors, setErrors] = useState({});
  
  // Übungsdaten über den useExercises Hook laden
  const { exercises, isLoading } = useExercises();

  if (workouts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Keine Workouts zum Bearbeiten verfügbar.</p>
      </div>
    );
  }
  const handleEditClick = async (workoutId) => {
    setEditingWorkoutId(workoutId);
    
    // Workout-Details für die Bearbeitung laden
    const workout = workouts.find(w => w.workout_id === workoutId);
    if (workout) {
      setFormData({
        name: workout.name,
        description: workout.description || '',
        difficulty_level: workout.difficulty_level || 'beginner',
        duration_minutes: workout.duration_minutes || 30,
        is_public: workout.is_public || false
      });
      
      // Übungen für das Workout laden
      try {
        const exercises = await getWorkoutExercises(workoutId);
        setWorkoutExercises({
          ...workoutExercises,
          [workoutId]: exercises
        });
      } catch (error) {
        console.error('Fehler beim Laden der Workout-Übungen:', error);
      }
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    // Fehler zurücksetzen
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleExerciseChange = (workoutId, exerciseIndex, field, value) => {
    const updatedExercises = [...workoutExercises[workoutId]];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      [field]: value
    };
    
    setWorkoutExercises({
      ...workoutExercises,
      [workoutId]: updatedExercises
    });
  };
  
  const handleAddExercise = (workoutId) => {
    const currentExercises = workoutExercises[workoutId] || [];
    const newExercise = {
      workout_id: workoutId,
      exercise_id: '',
      position: currentExercises.length + 1,
      sets: 3,
      reps: '8-12',
      rest_seconds: 60,
      notes: ''
    };
    
    setWorkoutExercises({
      ...workoutExercises,
      [workoutId]: [...currentExercises, newExercise]
    });
  };
  
  const handleRemoveExercise = (workoutId, exerciseIndex) => {
    const updatedExercises = [...workoutExercises[workoutId]];
    updatedExercises.splice(exerciseIndex, 1);
    
    // Positionen aktualisieren
    const reorderedExercises = updatedExercises.map((ex, idx) => ({
      ...ex,
      position: idx + 1
    }));
    
    setWorkoutExercises({
      ...workoutExercises,
      [workoutId]: reorderedExercises
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Grundlegende Validierung
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

  const handleUpdateWorkout = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // 1. Workout mit dem workoutService aktualisieren
      await workoutService.updateWorkout(editingWorkoutId, formData);
      
      // 2. Übungen aktualisieren
      const exercises = workoutExercises[editingWorkoutId] || [];
      
      // Vorhandene Übungen aus der Datenbank löschen
      const existingExercises = await getWorkoutExercises(editingWorkoutId);
      for (const exercise of existingExercises) {
        if (exercise.workout_exercise_id) {
          await removeExerciseFromWorkout(exercise.workout_exercise_id);
        }
      }
      
      // Neue Übungen zur Datenbank hinzufügen
      for (const exercise of exercises) {
        if (exercise.exercise_id) {
          await addExerciseToWorkout({
            workout_id: editingWorkoutId,
            exercise_id: exercise.exercise_id,
            position: exercise.position,
            sets: exercise.sets,
            reps: exercise.reps,
            rest_seconds: exercise.rest_seconds,
            notes: exercise.notes
          });
        }
      }
      
      alert('Workout erfolgreich aktualisiert');
      setEditingWorkoutId(null);
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error);
      alert('Fehler beim Aktualisieren des Workouts: ' + error.message);
    }
  };
  
  // Optionen für das Schwierigkeitsgrad-Dropdown
  const difficultyOptions = [
    { value: 'beginner', label: 'Anfänger' },
    { value: 'intermediate', label: 'Fortgeschritten' },
    { value: 'advanced', label: 'Profi' }
  ];
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Workouts bearbeiten</h2>

      {workouts.map((workout, index) => (
        <div key={workout.workout_id || index} className="bg-white rounded-lg shadow-md p-6 mb-4">
          {editingWorkoutId === workout.workout_id ? (
            <form onSubmit={handleUpdateWorkout}>
              <TextField 
                id="name"
                label="Name des Workouts"
                type="text"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
                error={errors.name}
              />

              <TextArea 
                id="description"
                label="Beschreibung"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={4}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <SelectField 
                  id="difficulty_level"
                  label="Schwierigkeitsgrad"
                  options={difficultyOptions}
                  value={formData.difficulty_level || 'beginner'}
                  onChange={handleInputChange}
                />
                
                <TextField 
                  id="duration_minutes"
                  label="Dauer (Minuten)"
                  type="number"
                  min="1"
                  value={formData.duration_minutes || ''}
                  onChange={handleInputChange}
                  required
                  error={errors.duration_minutes}
                />
              </div>
              
              <CheckboxField 
                id="is_public"
                label="Workout öffentlich machen"
                checked={formData.is_public || false}
                onChange={handleInputChange}
              />
              
              {/* Übungen-Sektion */}
              <div className="mt-8 mb-6 border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Übungen bearbeiten</h3>
                
                {(workoutExercises[workout.workout_id]?.length || 0) === 0 ? (
                  <div className="text-gray-500 mb-4 text-center py-4">
                    Keine Übungen hinzugefügt. Füge unten Übungen zu deinem Workout hinzu.
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {(workoutExercises[workout.workout_id] || []).map((exercise, exerciseIndex) => (
                      <div key={exercise.workout_exercise_id || exerciseIndex} className="p-4 border rounded-md bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">{`Übung ${exerciseIndex + 1}`}</h4>
                          <button 
                            type="button"
                            onClick={() => handleRemoveExercise(workout.workout_id, exerciseIndex)}
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
                              value={exercise.exercise_id || ''}
                              onChange={(e) => handleExerciseChange(workout.workout_id, exerciseIndex, 'exercise_id', e.target.value)}
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
                              value={exercise.position || ''}
                              onChange={(e) => handleExerciseChange(workout.workout_id, exerciseIndex, 'position', parseInt(e.target.value))}
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
                              value={exercise.sets || ''}
                              onChange={(e) => handleExerciseChange(workout.workout_id, exerciseIndex, 'sets', parseInt(e.target.value))}
                              min="1"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Wiederholungen</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              value={exercise.reps || ''}
                              onChange={(e) => handleExerciseChange(workout.workout_id, exerciseIndex, 'reps', e.target.value)}
                              placeholder="z.B. 8-12"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Pause (Sek.)</label>
                            <input
                              type="number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              value={exercise.rest_seconds || ''}
                              onChange={(e) => handleExerciseChange(workout.workout_id, exerciseIndex, 'rest_seconds', parseInt(e.target.value))}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">Notizen</label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={exercise.notes || ''}
                            onChange={(e) => handleExerciseChange(workout.workout_id, exerciseIndex, 'notes', e.target.value)}
                            rows="2"
                          />
                        </div>
                      </div>
                    ))}

                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => handleAddExercise(workout.workout_id)}
                  className="mb-6 px-4 py-2 border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Übung hinzufügen
                </button>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingWorkoutId(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Speichern
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-2">{workout.name}</h3>
              <div className="text-gray-500 mb-4">{workout.description}</div>
              <div className="text-sm mb-4">
                <span className="font-medium">Schwierigkeit:</span> {workout.difficulty_level || 'Nicht angegeben'} | 
                <span className="font-medium ml-2">Dauer:</span> {workout.duration_minutes || '?'} Minuten
              </div>
              <button
                onClick={() => handleEditClick(workout.workout_id)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Bearbeiten
              </button>
            </>
          )}
        </div>
      ))}

    </div>
  );
}

export default WorkoutEdit;
