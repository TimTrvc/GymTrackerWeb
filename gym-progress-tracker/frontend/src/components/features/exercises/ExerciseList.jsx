import React from "react";
import LoadingDisplay from "@/components/common/LoadingDisplay.jsx";
import ErrorDisplay from "@/components/common/ErrorDisplay.jsx";

const ExerciseList = ({
                          exercises,
                          isLoading,
                          error,
                          categoryName,
                          onViewDetails,
                          onAddExerciseClick,
                          onBackToCategoriesClick
                      }) => {
    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <button
                        onClick={onBackToCategoriesClick}
                        className="mr-2 text-blue-500 hover:text-blue-700"
                    >
                        ← Zurück
                    </button>
                    <h1 className="text-2xl font-bold">{categoryName}</h1>
                </div>
                <button
                    onClick={onAddExerciseClick}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Übung hinzufügen
                </button>
            </div>

            {isLoading && <LoadingDisplay message="Übungen werden geladen..." />}

            {error && <ErrorDisplay message={error} />}

            {!isLoading && !error && (
                exercises.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exercises.map(exercise => (
                            <div
                                key={exercise.id}
                                onClick={() => onViewDetails(exercise.id)}
                                className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <h3 className="font-bold text-lg">{exercise.name}</h3>
                                <p className="text-gray-600 truncate">{exercise.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        Keine Übungen in dieser Kategorie gefunden.
                    </div>
                )
            )}
        </>
    );
};

export default ExerciseList;