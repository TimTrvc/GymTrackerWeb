import React, { useEffect, useState } from 'react';
import { getTrainingSessions } from '@/services/trainingSessionsService';
import { getExercisePerformances } from '@/services/exercisePerformanceService';

// Hilfsfunktion: summiert alle Gewichte einer Session
function sumSessionWeight(performances) {
  return performances.reduce((sum, perf) => sum + (Number(perf.weight) * Number(perf.reps || 1)), 0);
}

function minutesBetween(date1, date2) {
  return Math.abs((date2 - date1) / 60000);
}

const StatisticsOverview = () => {
  const [sessions, setSessions] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [count30d, setCount30d] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const allSessions = await getTrainingSessions();
      const now = new Date();
      const sessions30d = allSessions.filter(s => {
        const d = new Date(s.session_date);
        return (now - d) < 1000 * 60 * 60 * 24 * 30;
      });
      setCount30d(sessions30d.length);

      // Gesamtgewicht berechnen
      let weightSum = 0;
      let timeSum = 0;
      for (const session of sessions30d) {
        const perfs = await getExercisePerformances(session.session_id);
        weightSum += sumSessionWeight(perfs);
        // Zeit: falls duration_minutes nicht gesetzt, schätzen wir 45min pro Session
        timeSum += Number(session.duration_minutes) || 45;
      }
      setTotalWeight(weightSum);
      setTotalTime(timeSum);
      setSessions(sessions30d);
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Trainingsübersicht</h2>
      {loading ? (
        <div className="text-center text-gray-500">Lade...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-5 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Trainingseinheiten</h3>
            <p className="text-3xl font-bold text-indigo-600">{count30d}</p>
            <p className="text-sm text-gray-500">in den letzten 30 Tagen</p>
          </div>
          <div className="bg-green-50 p-5 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Gesamtgewicht</h3>
            <p className="text-3xl font-bold text-green-600">{totalWeight.toLocaleString()} kg</p>
            <p className="text-sm text-gray-500">in den letzten 30 Tagen</p>
          </div>
          <div className="bg-purple-50 p-5 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Trainingszeit</h3>
            <p className="text-3xl font-bold text-purple-600">{(totalTime/60).toFixed(1)} h</p>
            <p className="text-sm text-gray-500">in den letzten 30 Tagen</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsOverview;
