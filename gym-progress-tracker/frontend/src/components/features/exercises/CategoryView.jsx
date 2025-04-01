import React from "react";
import ExercisesCategories from "./ExercisesCategories.jsx";

const CategoryView = ({ categories, onCategoryClick, onAddExerciseClick }) => {
    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Kategorien</h1>
                <button
                    onClick={onAddExerciseClick}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Übung hinzufügen
                </button>
            </div>

            {categories.length > 0 ? (
                <ExercisesCategories
                    categories={categories}
                    onCategoryClick={onCategoryClick}
                />
            ) : (
                <div className="text-center py-8">Keine Kategorien gefunden.</div>
            )}
        </>
    );
};

export default CategoryView;