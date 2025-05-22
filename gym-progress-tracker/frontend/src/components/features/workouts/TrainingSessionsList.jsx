import React, { useEffect, useState } from 'react';
import { getTrainingSessions } from '@/services/trainingSessionsService';
import { getExercisePerformances } from '@/services/exercisePerformanceService';
import exercisesService from '@/services/exercisesService';
import workoutService from '@/services/workoutService';


const TrainingSessionsList = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exerciseMap, setExerciseMap] = useState({});
  const [workoutMap, setWorkoutMap] = useState({});
  

  // Lade alle Übungen einmalig für Mapping ID -> Name
  useEffect(() => {
    getTrainingSessions().then(data => {
      console.log('DEBUG: fetched sessions', data);
      setSessions(data);
    });
    // Übungen für Mapping laden
    exercisesService.get && exercisesService.get().then(allExercises => {
      console.log('DEBUG: fetched allExercises', allExercises);
      if (Array.isArray(allExercises)) {
        const map = {};
        allExercises.forEach(ex => {
          map[String(ex.exercise_id)] = ex.name;
        });
        setExerciseMap(map);
      }
    });
    // Workouts für Mapping laden
    workoutService.getAllWorkouts && workoutService.getAllWorkouts().then(allWorkouts => {
      // Falls API-Response ein Objekt mit workouts-Array ist, extrahiere das Array
      let workoutsArr = allWorkouts;
      if (allWorkouts && Array.isArray(allWorkouts.workouts)) {
        workoutsArr = allWorkouts.workouts;
      }
      console.log('DEBUG: normalized allWorkouts', workoutsArr);
      if (Array.isArray(workoutsArr)) {
        const map = {};
        workoutsArr.forEach(w => {
          map[String(w.workout_id)] = w.name;
        });
        setWorkoutMap(map);
      }
    });
  }, []);

  const handleSelectSession = async (session) => {
    setSelectedSession(session);
    setLoading(true);
    try {
      const perf = await getExercisePerformances(session.session_id);
      setPerformances(perf);
    } finally {
      setLoading(false);
    }
  };

  // Debug: Log loaded workouts and session ids
  useEffect(() => {
    if (Object.keys(workoutMap).length && sessions.length) {
      // Log all workout ids and names
      console.log('DEBUG: workoutMap', workoutMap);
      // Log all session workout_ids
      console.log('DEBUG: session workout_ids', sessions.map(s => s.workout_id));
    }
  }, [workoutMap, sessions]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Meine Trainingseinheiten</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <ul className="divide-y">
            {sessions.map(session => {
              // Versuche, auch mit template_id zu matchen, falls vorhanden
              let workoutName = workoutMap[String(session.workout_id)]
                || workoutMap[String(session.template_id)]
                || session.workout_id;
              return (
                <li key={session.session_id} className="py-3 cursor-pointer hover:bg-gray-50 rounded px-2"
                    onClick={() => handleSelectSession(session)}>
                  <div className="text-lg font-bold text-gray-900 leading-tight">{workoutName}</div>
                  <div className="text-xs text-gray-400 mb-1">{formatRelativeDate(session.session_date)}</div>
                  <div className="text-xs text-gray-400">Dauer: {session.duration_minutes || '-'} min</div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="md:w-1/2">
          {selectedSession && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Details zur Session</h3>
              {loading ? <p>Lade Übungsdaten...</p> : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-2">Übung</th>
                      <th className="text-left py-2 px-2">Satz</th>
                      <th className="text-left py-2 px-2">Gewicht (kg)</th>
                      <th className="text-left py-2 px-2">Wdh.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performances.map((perf, idx) => (
                      <tr key={idx}>
                        <td>{exerciseMap[String(perf.exercise_id)] || perf.exercise_id}</td>
                        <td>{perf.set_number}</td>
                        <td>{perf.weight}</td>
                        <td>{perf.reps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Hilfsfunktion für relative Datumsanzeige
function formatRelativeDate(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  // Setze Uhrzeit auf Mitternacht für beide
  now.setHours(0,0,0,0);
  date.setHours(0,0,0,0);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'heute';
  if (diffDays === 1) return 'vor 1 Tag';
  return `vor ${diffDays} Tagen`;
}

export default TrainingSessionsList;
  
  
