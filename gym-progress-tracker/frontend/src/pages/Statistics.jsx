import React from 'react';
import HeroSection from '@/components/layout/HeroSection';
import TrainingSessionsList from '@/components/features/workouts/TrainingSessionsList.jsx';
import StatisticsOverview from './StatisticsOverview.jsx';
import PersonalRecordsTable from './PersonalRecordsTable.jsx';

/**
 * Statistics page component
 * Shows user progress and training statistics
 */
const Statistics = () => {
  return (
    <>
      <HeroSection 
        title="Deine Statistiken" 
        subtitle="Verfolge deinen Fortschritt und analysiere deine Leistung" 
      />
      <div className="container mx-auto px-4 py-8">
        <StatisticsOverview />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Trainingshäufigkeit</h2>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">Diagramm wird geladen...</p>
              {/* Hier würde ein echtes Diagramm eingebunden werden */}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Fortschritte pro Übung</h2>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">Diagramm wird geladen...</p>
              {/* Hier würde ein echtes Diagramm eingebunden werden */}
            </div>
          </div>
        </div>
        
        <PersonalRecordsTable />
      </div>
      {/* Eigene Training Sessions Übersicht */}
      <TrainingSessionsList />
    </>
  );
};

export default Statistics;
