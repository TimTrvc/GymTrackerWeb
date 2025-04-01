import React from "react";
import useExerciseCategories from "@/hooks/useExerciseCategories.jsx";
import useExercises from "@/hooks/useExercises.jsx";
import useExerciseModals from "@/hooks/useExerciseModal.jsx";
import HeroSection from "@/components/layout/HeroSection.jsx";
import CategoryView from "@/components/features/exercises/CategoryView.jsx";
import ExerciseList from "@/components/features/exercises/ExerciseList.jsx";
import ErrorDisplay from "@/components/common/ErrorDisplay.jsx";
import LoadingDisplay from "@/components/common/LoadingDisplay.jsx";

const Exercises = () => {
    // Custom Hooks for data fetching and management
    const {
        categories: exerciseCategories,
        isLoading: categoriesLoading,
        error: categoriesError
    } = useExerciseCategories();

    const {
        exercises,
        selectedCategory,
        isLoading: exercisesLoading,
        error: exercisesError,
        selectCategory: handleCategoryClick,
        addExerciseToList,
        clearSelectedCategory
    } = useExercises();

    const {
        addModal,
        detailsModal,
        handleOpenAddModal,
        handleAddExercise,
        handleViewDetails,
        handleCloseDetailsModal
    } = useExerciseModals({ addExerciseToList });

    // Find the name of the selected category
    const selectedCategoryName = React.useMemo(() => {
        if (!selectedCategory || !exerciseCategories) return '';
        return exerciseCategories.find(cat => cat.id === selectedCategory)?.name || '';
    }, [selectedCategory, exerciseCategories]);

    // Show appropriate loading or error states
    if (categoriesLoading) {
        return (
            <>
                <HeroSection title="Übungen" subtitle="Erstelle oder betrachte hier deine Übungen" />
                <LoadingDisplay message="Kategorien werden geladen..." />
            </>
        );
    }

    if (categoriesError) {
        return (
            <>
                <HeroSection title="Übungen" subtitle="Erstelle oder betrachte hier deine Übungen" />
                <ErrorDisplay message="Fehler beim Laden der Kategorien." />
            </>
        );
    }

    return (
        <>
            <HeroSection title="Übungen" subtitle="Erstelle oder betrachte hier deine Übungen" />
            <div className="max-w-5xl mx-auto p-4">
                {!selectedCategory ? (
                    <CategoryView
                        categories={exerciseCategories}
                        onCategoryClick={handleCategoryClick}
                        onAddExerciseClick={handleOpenAddModal}
                    />
                ) : (
                    <ExerciseList
                        exercises={exercises}
                        isLoading={exercisesLoading}
                        error={exercisesError}
                        categoryName={selectedCategoryName}
                        onViewDetails={handleViewDetails}
                        onAddExerciseClick={handleOpenAddModal}
                        onBackToCategoriesClick={clearSelectedCategory}
                    />
                )}
            </div>

            {/* Render modals using the modal state from our custom hook */}
            {addModal.render(exerciseCategories)}
            {detailsModal.render()}
        </>
    );
};

export default Exercises;