import React, { useState } from "react";

/**
 * WorkoutSession-Komponente: Führt den Nutzer durch ein Workout.
 * Zeigt nacheinander die Übungen und ermöglicht die Eingabe von Gewicht und Wiederholungen pro Satz.
 * @param {Object} props
 * @param {Object} props.workout - Das Workout-Objekt
 * @param {Array} props.exercises - Die Übungen des Workouts
 * @param {Function} props.onFinish - Callback, wenn das Workout abgeschlossen ist
 */
const WorkoutSession = ({ workout, exercises, onFinish }) => {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [setInputs, setSetInputs] = useState({}); // { [exerciseIdx]: [{weight, reps}, ...] }

  if (!exercises || exercises.length === 0) {
    return <div>Keine Übungen für dieses Workout gefunden.</div>;
  }

  const currentExercise = exercises[currentExerciseIdx];
  const sets = currentExercise.sets || 1;

  // Initialisiere Sätze falls noch nicht vorhanden
  const currentSets = setInputs[currentExerciseIdx] || Array.from({ length: sets }, () => ({ weight: '', reps: '' }));

  const handleInputChange = (setIdx, field, value) => {
    setSetInputs(prev => {
      const updated = { ...prev };
      const setsArr = [...(updated[currentExerciseIdx] || currentSets)];
      setsArr[setIdx] = { ...setsArr[setIdx], [field]: value };
      updated[currentExerciseIdx] = setsArr;
      return updated;
    });
  };

  const handleNext = () => {
    if (currentExerciseIdx < exercises.length - 1) {
      setCurrentExerciseIdx(currentExerciseIdx + 1);
    } else {
      // Workout abgeschlossen
      if (onFinish) onFinish(setInputs);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-bold mb-2">{workout.name}</h2>
      <p className="mb-4 text-gray-600">Übung {currentExerciseIdx + 1} von {exercises.length}: <span className="font-semibold">{currentExercise.name}</span></p>
      <div className="mb-4">
        <ul className="space-y-2">
          {currentSets.map((set, setIdx) => (
            <li key={setIdx} className="flex items-center gap-4">
              <span className="font-medium">Satz {setIdx + 1}:</span>
              <input
                type="number"
                placeholder="Gewicht (kg)"
                className="w-24 px-2 py-1 border rounded"
                value={set.weight}
                onChange={e => handleInputChange(setIdx, 'weight', e.target.value)}
                min="0"
              />
              <input
                type="number"
                placeholder="Wdh."
                className="w-20 px-2 py-1 border rounded"
                value={set.reps}
                onChange={e => handleInputChange(setIdx, 'reps', e.target.value)}
                min="0"
              />
            </li>
          ))}
        </ul>
      </div>
      <button
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        onClick={handleNext}
      >
        {currentExerciseIdx < exercises.length - 1 ? 'Nächste Übung' : 'Workout abschließen'}
      </button>
    </div>
  );
};

export default WorkoutSession;
