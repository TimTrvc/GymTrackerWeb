import React from 'react';
import HeroSection from '@/components/layout/HeroSection';

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
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Trainingsübersicht</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Trainingseinheiten</h3>
              <p className="text-3xl font-bold text-indigo-600">24</p>
              <p className="text-sm text-gray-500">in den letzten 30 Tagen</p>
            </div>
            <div className="bg-green-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Gesamtgewicht</h3>
              <p className="text-3xl font-bold text-green-600">4250 kg</p>
              <p className="text-sm text-gray-500">in den letzten 30 Tagen</p>
            </div>
            <div className="bg-purple-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Trainingszeit</h3>
              <p className="text-3xl font-bold text-purple-600">16.5 h</p>
              <p className="text-sm text-gray-500">in den letzten 30 Tagen</p>
            </div>
          </div>
        </div>
        
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
        
        <div className="bg-white p-6 rounded-xl shadow-md mt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Persönliche Rekorde</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 border-b">Übung</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 border-b">Gewicht</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 border-b">Datum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-4 border-b">Bankdrücken</td>
                <td className="py-3 px-4 border-b font-medium">95 kg</td>
                <td className="py-3 px-4 border-b text-gray-500">15.04.2025</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border-b">Kniebeuge</td>
                <td className="py-3 px-4 border-b font-medium">120 kg</td>
                <td className="py-3 px-4 border-b text-gray-500">23.04.2025</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border-b">Kreuzheben</td>
                <td className="py-3 px-4 border-b font-medium">140 kg</td>
                <td className="py-3 px-4 border-b text-gray-500">05.05.2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Statistics;
