import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Displays a timeline of historical body measurements for a specific body part
 */
const MeasurementTimeline = ({ measurements, selectedPart, onClose }) => {
  const bodyPartLabels = {
    chest: 'Brustumfang',
    waist: 'Taille',
    hips: 'Hüfte',
    neck: 'Nacken',
    biceps_left: 'Bizeps links',
    biceps_right: 'Bizeps rechts',
    thigh_left: 'Oberschenkel links',
    thigh_right: 'Oberschenkel rechts',
    calf_left: 'Wade links',
    calf_right: 'Wade rechts',
    body_fat_percentage: 'Körperfettanteil'
  };

  // Filter and sort measurements for the selected body part
  const filteredMeasurements = measurements
    .filter(m => m[selectedPart] !== null && m[selectedPart] !== undefined)
    .sort((a, b) => new Date(a.measurement_date) - new Date(b.measurement_date));
  
  const data = {
    labels: filteredMeasurements.map(m => 
      new Date(m.measurement_date).toLocaleDateString('de-DE')
    ),
    datasets: [
      {
        label: bodyPartLabels[selectedPart] || selectedPart,
        data: filteredMeasurements.map(m => m[selectedPart]),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.7)',
        tension: 0.1
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Verlauf: ${bodyPartLabels[selectedPart] || selectedPart}`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">
          {bodyPartLabels[selectedPart] || selectedPart}
        </h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {filteredMeasurements.length > 0 ? (
        <>
          <div className="mb-6">
            <Line data={data} options={options} />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wert (cm)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMeasurements.map((measurement, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(measurement.measurement_date).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {selectedPart === 'body_fat_percentage' 
                        ? `${measurement[selectedPart]}%` 
                        : `${measurement[selectedPart]} cm`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Keine Messungen für {bodyPartLabels[selectedPart] || selectedPart} gefunden.
        </div>
      )}
    </div>
  );
};

MeasurementTimeline.propTypes = {
  measurements: PropTypes.array.isRequired,
  selectedPart: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default MeasurementTimeline;