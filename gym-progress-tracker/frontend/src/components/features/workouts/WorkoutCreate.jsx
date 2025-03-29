import React from "react";

const WorkoutCreate = ({ handleWorkoutSubmit }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Neues Workout erstellen</h2>

      <form onSubmit={handleWorkoutSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name des Workouts</label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Beschreibung</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="difficulty_level" className="block text-gray-700 font-medium mb-2">Schwierigkeitsgrad</label>
            <select
              id="difficulty_level"
              name="difficulty_level"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="beginner">Anfänger</option>
              <option value="intermediate">Fortgeschritten</option>
              <option value="advanced">Profi</option>
            </select>
          </div>

          <div>
            <label htmlFor="target_audience" className="block text-gray-700 font-medium mb-2">Zielgruppe</label>
            <select
              id="target_audience"
              name="target_audience"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Alle</option>
              <option value="beginners">Anfänger</option>
              <option value="weight_loss">Gewichtsabnahme</option>
              <option value="muscle_gain">Muskelaufbau</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="goal" className="block text-gray-700 font-medium mb-2">Ziel des Workouts</label>
            <select
              id="goal"
              name="goal"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="strength">Kraft</option>
              <option value="endurance">Ausdauer</option>
              <option value="flexibility">Flexibilität</option>
              <option value="weight_loss">Gewichtsabnahme</option>
              <option value="muscle_gain">Muskelaufbau</option>
            </select>
          </div>

          <div>
            <label htmlFor="estimated_duration_minutes" className="block text-gray-700 font-medium mb-2">Dauer (Minuten)</label>
            <input
              type="number"
              id="estimated_duration_minutes"
              name="estimated_duration_minutes"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-gray-700">Als Featured Workout markieren</span>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Workout erstellen
          </button>
        </div>
      </form>
    </div>
  );
}

export default WorkoutCreate;
