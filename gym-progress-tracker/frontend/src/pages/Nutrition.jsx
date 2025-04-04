import React, { useState, useEffect } from 'react';
import { getNutritionLogs, addNutritionLog } from '@/services/nutritionLogsService';
import HeroSection from '@/components/layout/HeroSection';

const Nutrition = () => {
  // Default to today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [formData, setFormData] = useState({
    meal_type: '',
    calories: '',
    protein_grams: '',
    carbs_grams: '',
    fat_grams: '',
    notes: '',
    log_date: today,
  });

  // Extract fetchLogs so it can be reused
  const fetchLogs = async () => {
    try {
      const data = await getNutritionLogs();
      const normalizedLogs = data.map((log) => {
        const d = new Date(log.log_date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return { ...log, log_date: `${year}-${month}-${day}` };
      });
      setLogs(normalizedLogs);
    } catch (error) {
      console.error('Error fetching nutrition logs:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add the new log
      await addNutritionLog(formData);
      // Re-fetch logs after a successful add to update the UI immediately
      fetchLogs();
      // Reset the form fields (keep log_date set to today)
      setFormData({
        meal_type: '',
        calories: '',
        protein_grams: '',
        carbs_grams: '',
        fat_grams: '',
        notes: '',
        log_date: today,
      });
    } catch (error) {
      console.error('Error adding nutrition log:', error);
    }
  };

  // Update the selected date based on the date picker
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Filter logs for the selected date
  const filteredLogs = logs.filter((log) => log.log_date === selectedDate);

  // Calculate aggregated totals for the selected day
  const totals = filteredLogs.reduce(
    (acc, log) => {
      acc.calories += Number(log.calories) || 0;
      acc.protein_grams += Number(log.protein_grams) || 0;
      acc.carbs_grams += Number(log.carbs_grams) || 0;
      acc.fat_grams += Number(log.fat_grams) || 0;
      return acc;
    },
    { calories: 0, protein_grams: 0, carbs_grams: 0, fat_grams: 0 }
  );

  return (
    <>
      <HeroSection title="Ernährung" subtitle="Tracke deine Ernährung" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT SIDE: Form to add new logs */}
          <div className="md:w-1/2 bg-white shadow-lg rounded-lg px-8 pt-6 pb-8">
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold mb-6">Neuen Eintrag hinzufügen</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="meal_type"
                  placeholder="Meal Type"
                  value={formData.meal_type}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  name="calories"
                  placeholder="Calories"
                  value={formData.calories}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  name="protein_grams"
                  placeholder="Protein (g)"
                  value={formData.protein_grams}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  name="carbs_grams"
                  placeholder="Carbs (g)"
                  value={formData.carbs_grams}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  name="fat_grams"
                  placeholder="Fat (g)"
                  value={formData.fat_grams}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                {/* Date input for log_date */}
                <input
                  type="date"
                  name="log_date"
                  value={formData.log_date}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 mt-4 w-full focus:outline-none focus:border-blue-500"
                rows="3"
              />
              <button
                type="submit"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Add Log
              </button>
            </form>
          </div>
          {/* RIGHT SIDE: Date selector, totals, and logs */}
          <div className="md:w-1/2 flex flex-col">
            <div className="mb-4">
              <label htmlFor="date" className="block text-lg font-medium mb-2">
                Wähle ein Datum:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="bg-white shadow-lg rounded-lg px-4 py-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Totals for {selectedDate}</h3>
              <p className="mb-1">Calories: {totals.calories} kcal</p>
              <p className="mb-1">Protein: {totals.protein_grams} g</p>
              <p className="mb-1">Carbs: {totals.carbs_grams} g</p>
              <p className="mb-1">Fat: {totals.fat_grams} g</p>
            </div>
            {/* Scrollable logs container */}
            <div className="bg-white shadow-lg rounded-lg px-4 py-6 h-96 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Nutrition Logs for {selectedDate}</h2>
              {filteredLogs.length === 0 ? (
                <p className="text-gray-500">No nutrition logs for this day.</p>
              ) : (
                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.nutrition_log_id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow transition-shadow"
                    >
                      <p className="font-semibold">Meal Type: {log.meal_type}</p>
                      <p>Calories: {log.calories} kcal</p>
                      <p>Protein: {log.protein_grams} g</p>
                      <p>Carbs: {log.carbs_grams} g</p>
                      <p>Fat: {log.fat_grams} g</p>
                      <p className="italic text-gray-600">Notes: {log.notes}</p>
                      <p className="text-gray-500 text-sm">Log Date: {log.log_date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nutrition;




