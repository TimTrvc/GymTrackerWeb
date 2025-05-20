import React, { useEffect, useState } from 'react';
import { getTrainingSessions } from '@/services/trainingSessionsService';
import { getExercisePerformances } from '@/services/exercisePerformanceService';

const TrainingSessionsList = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTrainingSessions().then(setSessions);
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

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Meine Trainingseinheiten</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <ul className="divide-y">
            {sessions.map(session => (
              <li key={session.session_id} className="py-2 cursor-pointer hover:bg-gray-50 rounded px-2"
                  onClick={() => handleSelectSession(session)}>
                <div className="font-semibold">{new Date(session.session_date).toLocaleString()}</div>
                <div className="text-sm text-gray-500">Workout-ID: {session.workout_id}</div>
                <div className="text-xs text-gray-400">Dauer: {session.duration_minutes || '-'} min</div>
              </li>
            ))}
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
                        <td>{perf.exercise_id}</td>
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
};

export default TrainingSessionsList;
