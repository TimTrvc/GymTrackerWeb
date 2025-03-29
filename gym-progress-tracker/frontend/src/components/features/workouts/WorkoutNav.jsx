import React from "react";

const WorkoutNav = ({ activeTab, handleTabClick }) => {
  return (
    <div className="max-w-3xl mx-auto mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => handleTabClick('create')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 ${
              activeTab === 'create'
                ? 'border-indigo-500 font-medium text-indigo-600'
                : 'border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Workout erstellen
          </button>
          <button
            onClick={() => handleTabClick('view')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 ${
              activeTab === 'view'
                ? 'border-indigo-500 font-medium text-indigo-600'
                : 'border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Meine Workouts
          </button>
          <button
            onClick={() => handleTabClick('edit')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 ${
              activeTab === 'edit'
                ? 'border-indigo-500 font-medium text-indigo-600'
                : 'border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Workout bearbeiten
          </button>
        </nav>
      </div>
    </div>
  )
}

export default WorkoutNav;
