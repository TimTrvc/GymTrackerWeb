import React from "react";
import Hoverer from "../animation/Hoverer.jsx";

const WorkoutView = ({ workouts }) => {
  if (workouts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Keine Workouts gefunden. Erstellen Sie ein neues Workout im "Erstellen"-Tab.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Meine Workouts</h2>
      <div className="space-y-4">
        {workouts.map((workout, index) => (
            <Hoverer key={index}>
              <div key={workout.id || index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{workout.name}</h3>
                <div className="text-gray-500 mb-4">{workout.description}</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Schwierigkeit:</span> {workout.difficulty_level}
                  </div>
                  <div>
                    <span className="font-medium">Ziel:</span> {workout.goal}
                  </div>
                  <div>
                    <span className="font-medium">Dauer:</span> {workout.estimated_duration_minutes} Minuten
                  </div>
                  <div>
                    <span className="font-medium">Zielgruppe:</span> {workout.target_audience}
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="view-workout-btn px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                          data-id="${workout.template_id}">Ansehen
                  </button>
                  <button className="edit-workout-btn px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                          data-id="${workout.template_id}">Bearbeiten
                  </button>
                  <button className="delete-workout-btn px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                          data-id="${workout.template_id}">Löschen
                  </button>
                </div>
                {workout.is_featured && (
                  <div
                    className="mt-4 inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    Featured
                  </div>
                )}
              </div>
            </Hoverer>
        ))}
      </div>
    </div>
  );
}

export default WorkoutView;
