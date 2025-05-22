
import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Modernes Chart-UI für Trainingshäufigkeit und Fortschritt pro Übung
 * @param {Object} props
 * @param {Array} props.frequencyData - Array mit {label, value} für Trainingshäufigkeit
 * @param {Array} props.progressData - Array mit {label, values: [y1, y2, ...], color} für Fortschritt pro Übung
 */
const StatisticsCharts = ({ frequencyData = [], progressData = [] }) => {
  // Trainingshäufigkeit (Bar)
  const freqLabels = frequencyData.map((d) => d.label);
  const freqValues = frequencyData.map((d) => d.value);
  const freqChartData = {
    labels: freqLabels,
    datasets: [
      {
        label: "Workouts",
        data: freqValues,
        backgroundColor: "#6366f1",
        borderRadius: 8,
        maxBarThickness: 32,
      },
    ],
  };

  // Fortschritt pro Übung (Line)
  const progLabels = progressData.length > 0 ? progressData[0].values.map((_, i) => `Woche ${i + 1}`) : [];
  const progDatasets = progressData.map((ex, i) => ({
    label: ex.label,
    data: ex.values,
    borderColor: ex.color || `hsl(${i * 60}, 70%, 50%)`,
    backgroundColor: ex.color || `hsl(${i * 60}, 70%, 80%)`,
    tension: 0.3,
    pointRadius: 4,
    pointHoverRadius: 6,
    fill: false,
  }));
  const progChartData = {
    labels: progLabels,
    datasets: progDatasets,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
          Trainingshäufigkeit
        </h2>
        <div className="flex-1 flex items-center justify-center">
          <Bar
            data={freqChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
              },
              scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
              },
            }}
            height={220}
          />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          Fortschritt pro Übung
        </h2>
        <div className="flex-1 flex items-center justify-center">
          <Line
            data={progChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
                title: { display: false },
              },
              scales: {
                x: { grid: { color: '#f3f4f6' } },
                y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
              },
            }}
            height={220}
          />
        </div>
      </div>
    </div>
  );
};

export default StatisticsCharts;
