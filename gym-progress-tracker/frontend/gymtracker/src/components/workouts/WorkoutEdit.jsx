import React, { useState } from "react";

const WorkoutEdit = ({ workouts }) => {
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);

  if (workouts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Keine Workouts zum Bearbeiten verfügbar.</p>
      </div>
    );
  }

  const handleEditClick = (workoutId) => {
    setEditingWorkoutId(workoutId);
  };

  const handleUpdateWorkout = (e) => {
    e.preventDefault();
    // Implementiere die Update-Logik hier
    alert("Update-Funktion noch nicht implementiert");
    setEditingWorkoutId(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Workouts bearbeiten</h2>

      {workouts.map((workout, index) => (
        <div key={workout.id || index} className="bg-white rounded-lg shadow-md p-6 mb-4">
          {editingWorkoutId === workout.id ? (
            <form onSubmit={handleUpdateWorkout}>
              <div className="mb-4">
                <label htmlFor="edit-name" className="block text-gray-700 font-medium mb-2">Name des Workouts</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  defaultValue={workout.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="edit-description" className="block text-gray-700 font-medium mb-2">Beschreibung</label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows="4"
                  defaultValue={workout.description}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingWorkoutId(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Speichern
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-2">{workout.name}</h3>
              <div className="text-gray-500 mb-4">{workout.description}</div>
              <button
                onClick={() => handleEditClick(workout.id)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Bearbeiten
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default WorkoutEdit;
