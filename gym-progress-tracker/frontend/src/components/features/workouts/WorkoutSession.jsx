
import React, { useState, useEffect } from "react";
import exercisesService from "@/services/exercisesService";

/**
 * WorkoutSession-Komponente: Führt den Nutzer durch ein Workout.
 * Zeigt nacheinander die Übungen und ermöglicht die Eingabe von Gewicht und Wiederholungen pro Satz.
 * @param {Object} props
 * @param {Object} props.workout - Das Workout-Objekt
 * @param {Array} props.exercises - Die Übungen des Workouts
 * @param {Function} props.onFinish - Callback, wenn das Workout abgeschlossen ist
 */


const WorkoutSession = ({ workout, exercises, onFinish }) => {
  // Initialisiere für jede Übung die Sätze
  const [setInputs, setSetInputs] = useState(() => {
    const obj = {};
    exercises.forEach(ex => {
      obj[ex.exercise_id] = Array.from({ length: ex.sets || 1 }, () => ({ weight: '', reps: '' }));
    });
    return obj;
  });

  // State für Übungsdetails
  const [exerciseDetails, setExerciseDetails] = useState({});

  // Aktueller Fortschritt: aktueller Index Übung und Satz
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentSetIdx, setCurrentSetIdx] = useState(0);

  // Übungen aus Backend laden
  useEffect(() => {
    const fetchDetails = async () => {
      const details = {};
      await Promise.all(exercises.map(async (ex) => {
        try {
          const data = await exercisesService.getById(ex.exercise_id);
          details[ex.exercise_id] = data;
        } catch (e) {
          details[ex.exercise_id] = null;
        }
      }));
      setExerciseDetails(details);
    };
    fetchDetails();
  }, [exercises]);

  if (!exercises || exercises.length === 0) {
    return <div>Keine Übungen für dieses Workout gefunden.</div>;
  }

  // Gesamtanzahl Sätze
  const totalSets = exercises.reduce((sum, ex) => sum + (ex.sets || 1), 0);
  // Anzahl abgeschlossener Sätze
  const completedSets = exercises.reduce((sum, ex, idx) => {
    const sets = setInputs[ex.exercise_id] || [];
    if (idx < currentExerciseIdx) {
      // Alle Sätze dieser Übung abgeschlossen
      return sum + sets.length;
    } else if (idx === currentExerciseIdx) {
      return sum + currentSetIdx;
    }
    return sum;
  }, 0);

  // Aktuelle Übung und Satz
  const currentExercise = exercises[currentExerciseIdx];
  const currentSets = setInputs[currentExercise.exercise_id] || [];
  const details = exerciseDetails[currentExercise.exercise_id];

  // Eingabehandler für aktuellen Satz
  const handleInputChange = (field, value) => {
    setSetInputs(prev => {
      const updated = { ...prev };
      const setsArr = [...(updated[currentExercise.exercise_id] || [])];
      setsArr[currentSetIdx] = { ...setsArr[currentSetIdx], [field]: value };
      updated[currentExercise.exercise_id] = setsArr;
      return updated;
    });
  };


  // Satz abschließen
  const handleSetComplete = () => {
    if (currentSetIdx < currentSets.length - 1) {
      setCurrentSetIdx(currentSetIdx + 1);
    } else if (currentExerciseIdx < exercises.length - 1) {
      setCurrentExerciseIdx(currentExerciseIdx + 1);
      setCurrentSetIdx(0);
    }
    // Sonst: Workout abschließen-Button wird angezeigt
  };

  // Übung vorzeitig abschließen
  const handleSkipExercise = () => {
    if (currentExerciseIdx < exercises.length - 1) {
      setCurrentExerciseIdx(currentExerciseIdx + 1);
      setCurrentSetIdx(0);
    } else {
      // Wenn letzte Übung: Workout abschließen
      handleFinish();
    }
  };

  // Workout abschließen
  const handleFinish = () => {
    if (onFinish) onFinish(setInputs);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">{workout.name}</h2>
      <div className="mb-6 flex items-center justify-between">
        <span className="text-gray-600">Fortschritt: <span className="font-semibold">{completedSets} / {totalSets} Sätze abgeschlossen</span></span>
        <div className="w-1/2 bg-gray-200 rounded-full h-2 ml-4">
          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${(completedSets / totalSets) * 100}%` }}></div>
        </div>
      </div>

      <div className="space-y-6">
        <div className={`border rounded-lg p-4 shadow-sm bg-gray-50`}> 
          <div className="flex items-center mb-2">
            <span className="text-lg font-semibold mr-2">{currentExerciseIdx + 1}. {details?.name || currentExercise.name || 'Übung'}</span>
            {details?.primary_muscle_group && (
              <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{details.primary_muscle_group}</span>
            )}
          </div>
          {details?.description && <div className="text-gray-500 text-sm mb-2">{details.description}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-600">
                  <th className="px-2 py-1 text-left">Satz</th>
                  <th className="px-2 py-1 text-left">Gewicht (kg)</th>
                  <th className="px-2 py-1 text-left">Wdh.</th>
                  <th className="px-2 py-1 text-left">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {currentSets.map((set, setIdx) => (
                  <tr key={setIdx} className={setIdx === currentSetIdx ? '' : 'opacity-50'}>
                    <td className="px-2 py-1 font-medium">{setIdx + 1}</td>
                    <td className="px-2 py-1">
                      {setIdx === currentSetIdx ? (
                        <input
                          type="number"
                          placeholder="Gewicht"
                          className="w-24 px-2 py-1 border rounded"
                          value={set.weight}
                          onChange={e => handleInputChange('weight', e.target.value)}
                          min="0"
                        />
                      ) : (
                        <span>{set.weight || '-'}</span>
                      )}
                    </td>
                    <td className="px-2 py-1">
                      {setIdx === currentSetIdx ? (
                        <input
                          type="number"
                          placeholder="Wdh."
                          className="w-20 px-2 py-1 border rounded"
                          value={set.reps}
                          onChange={e => handleInputChange('reps', e.target.value)}
                          min="0"
                        />
                      ) : (
                        <span>{set.reps || '-'}</span>
                      )}
                    </td>
                    <td className="px-2 py-1">
                      {setIdx === currentSetIdx ? (
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                            onClick={handleSetComplete}
                            disabled={!set.weight && !set.reps}
                          >
                            Satz abschließen
                          </button>
                          <button
                            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                            onClick={handleSkipExercise}
                          >
                            Übung überspringen
                          </button>
                        </div>
                      ) : (
                        <span className="text-green-600">{set.weight || set.reps ? '✓' : ''}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Workout abschließen nur am Ende */}
      {currentExerciseIdx === exercises.length - 1 && currentSetIdx === currentSets.length - 1 && (setInputs[currentExercise.exercise_id][currentSetIdx].weight || setInputs[currentExercise.exercise_id][currentSetIdx].reps) && (
        <div className="mt-8 flex justify-center">
          <button
            className="px-8 py-3 rounded text-white font-semibold transition-all bg-indigo-600 hover:bg-indigo-700"
            onClick={handleFinish}
          >
            Workout abschließen
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutSession;
