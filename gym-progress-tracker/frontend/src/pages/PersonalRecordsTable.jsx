import React, { useEffect, useState } from 'react';
import { getTrainingSessions } from '@/services/trainingSessionsService';
import { getExercisePerformances } from '@/services/exercisePerformanceService';
import exercisesService from '@/services/exercisesService';

// Zeigt für jede Übung das beste Gewicht (PR) an
const PersonalRecordsTable = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPRs() {
      setLoading(true);
      const sessions = await getTrainingSessions();
      const allPerfs = [];
      for (const session of sessions) {
        const perfs = await getExercisePerformances(session.session_id);
        allPerfs.push(...perfs);
      }
      // Alle Übungen einmalig laden (für Mapping ID->Name)
      let exerciseMap = {};
      try {
        const allExercises = await exercisesService.get();
        if (Array.isArray(allExercises)) {
          exerciseMap = Object.fromEntries(allExercises.map(ex => [String(ex.exercise_id), ex.name]));
        }
      } catch (e) {
        // Fallback: keine Namen
      }
      // PRs pro Übung bestimmen
      const prs = {};
      for (const perf of allPerfs) {
        if (!perf.exercise_id) continue;
        if (!prs[perf.exercise_id] || Number(perf.weight) > prs[perf.exercise_id].weight) {
          prs[perf.exercise_id] = {
            exercise_id: perf.exercise_id,
            exercise_name: exerciseMap[String(perf.exercise_id)] || perf.exercise_id,
            weight: Number(perf.weight),
            date: perf.created_at || '',
          };
        }
      }
      setRecords(Object.values(prs));
      setLoading(false);
    }
    fetchPRs();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Persönliche Rekorde</h2>
      {loading ? <div className="text-center text-gray-500">Lade...</div> : (
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 border-b">Übung</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 border-b">Gewicht</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 border-b">Datum</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, idx) => (
              <tr key={idx}>
                <td className="py-3 px-4 border-b">{rec.exercise_name}</td>
                <td className="py-3 px-4 border-b font-medium">{rec.weight} kg</td>
                <td className="py-3 px-4 border-b text-gray-500">{rec.date ? new Date(rec.date).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PersonalRecordsTable;
