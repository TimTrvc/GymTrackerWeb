import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/layout/HeroSection';
import TrainingSessionsList from '@/components/features/workouts/TrainingSessionsList.jsx';
import StatisticsOverview from './StatisticsOverview.jsx';
import PersonalRecordsTable from './PersonalRecordsTable.jsx';
import StatisticsCharts from '@/components/features/statistics/StatisticsCharts';
import { getTrainingSessions } from '@/services/trainingSessionsService';
import { getExercisePerformances } from '@/services/exercisePerformanceService';
import exercisesService from '@/services/exercisesService';

/**
 * Statistics page component
 * Shows user progress and training statistics
 */
const Statistics = () => {
  const [frequencyData, setFrequencyData] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Hilfsfunktion: ISO Woche berechnen
      function getISOWeekString(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        // Donnerstag in dieser Woche finden
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        // 1. Januar der Woche
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        // Kalenderwoche berechnen
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
        return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2,'0')}`;
      }

      const sessions = await getTrainingSessions();
      const weekMap = {};
      const now = new Date();
      for (let i = 7; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i * 7);
        const week = getISOWeekString(d);
        weekMap[week] = 0;
      }
      sessions.forEach(s => {
        const d = new Date(s.session_date);
        const week = getISOWeekString(d);
        if (weekMap[week] !== undefined) weekMap[week]++;
      });
      setFrequencyData(Object.entries(weekMap).map(([label, value]) => ({ label, value })));

      // Fortschritt pro Übung: z.B. max Gewicht pro Woche für Top-3 Übungen
      const allPerfs = [];
      for (const session of sessions) {
        const perfs = await getExercisePerformances(session.session_id);
        allPerfs.push(...perfs);
      }
      // Top 3 meistgenutzte Übungen
      const exerciseCount = {};
      allPerfs.forEach(p => { if (p.exercise_id) exerciseCount[p.exercise_id] = (exerciseCount[p.exercise_id] || 0) + 1; });
      const topExercises = Object.entries(exerciseCount).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([id])=>id);
      // Namen laden
      let exerciseMap = {};
      try {
        const allExercises = await exercisesService.get();
        if (Array.isArray(allExercises)) {
          exerciseMap = Object.fromEntries(allExercises.map(ex => [String(ex.exercise_id), ex.name]));
        }
      } catch {}
      // Für jede Top-Übung: durchschnittliches Gewicht pro Woche (statt max)
      const weekLabels = Object.keys(weekMap);
      const progressArr = topExercises.map((exId, idx) => {
        const values = weekLabels.map(week => {
          // alle Sätze dieser Übung in dieser Woche
          const perfs = allPerfs.filter(p => {
            if (String(p.exercise_id) !== String(exId)) return false;
            // Fallback: robustes Datum
            let dateStr = p.performed_at || p.created_at || p.updated_at || p.session_date;
            if (!dateStr) return false;
            const d = new Date(dateStr);
            if (isNaN(d)) return false;
            const w = getISOWeekString(d);
            return w === week;
          });
          if (!perfs.length) return 0;
          // Maximales Gewicht aller Sätze dieser Woche
          return Math.max(...perfs.map(p => Number(p.weight) || 0));
        });
        return {
          label: exerciseMap[exId] || exId,
          values,
          color: `hsl(${idx*60},70%,50%)`
        };
      });
      setProgressData(progressArr);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <HeroSection 
        title="Deine Statistiken" 
        subtitle="Verfolge deinen Fortschritt und analysiere deine Leistung" 
      />
      <div className="container mx-auto px-4 py-8">
        <StatisticsOverview />
        <div className="mb-8">
          {loading ? (
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded text-gray-500">Diagramme werden geladen...</div>
          ) : (
            <StatisticsCharts frequencyData={frequencyData} progressData={progressData} />
          )}
        </div>
        <PersonalRecordsTable />
      </div>
      {/* Eigene Training Sessions Übersicht */}
      <TrainingSessionsList />
    </>
  );
};

export default Statistics;
