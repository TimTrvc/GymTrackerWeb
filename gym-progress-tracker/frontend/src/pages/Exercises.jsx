import React from "react";
import useExerciseCategories from "@/hooks/useExerciseCategories.jsx";
import useExercises from "@/hooks/useExercises.jsx";
import useExerciseModals from "@/hooks/useExerciseModal.jsx";
import HeroSection from "@/components/layout/HeroSection.jsx";
import CategoryView from "@/components/features/exercises/CategoryView.jsx";
import ExerciseList from "@/components/features/exercises/ExerciseList.jsx";
import ErrorDisplay from "@/components/common/ErrorDisplay.jsx";
import LoadingDisplay from "@/components/common/LoadingDisplay.jsx";

// Constants
const PAGE_TITLE = "Übungen";
const PAGE_SUBTITLE = "Erstelle oder betrachte hier deine Übungen";
const LOADING_MESSAGE = "Kategorien werden geladen...";
const ERROR_MESSAGE = "Fehler beim Laden der Kategorien.";

// Component for consistent layout structure
const ExercisesLayout = ({ children }) => (
  <>
    <HeroSection title={PAGE_TITLE} subtitle={PAGE_SUBTITLE} />
    <div className="max-w-5xl mx-auto p-4">
      {children}
    </div>
  </>
);

// Component to handle the content loading/error states
const ContentStateHandler = ({ isLoading, error, children }) => {
  if (isLoading) return <LoadingDisplay message={LOADING_MESSAGE} />;
  if (error) return <ErrorDisplay message={ERROR_MESSAGE} />;
  return children;
};

// Component to render the content based on selected category
const ExerciseContent = ({ 
  selectedCategory, 
  exerciseCategories, 
  exercises, 
  exercisesLoading, 
  exercisesError,
  selectedCategoryName,
  handleCategoryClick,
  handleOpenAddModal,
  handleViewDetails,
  clearSelectedCategory 
}) => {
  if (!selectedCategory) {
    return (
      <CategoryView
        categories={exerciseCategories}
        onCategoryClick={handleCategoryClick}
        onAddExerciseClick={handleOpenAddModal}
      />
    );
  }
  
  return (
    <ExerciseList
      exercises={exercises}
      isLoading={exercisesLoading}
      error={exercisesError}
      categoryName={selectedCategoryName}
      onViewDetails={handleViewDetails}
      onAddExerciseClick={handleOpenAddModal}
      onBackToCategoriesClick={clearSelectedCategory}
    />
  );
};

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

  return (
    <ExercisesLayout>
      <ContentStateHandler 
        isLoading={categoriesLoading} 
        error={categoriesError}
      >
        <ExerciseContent 
          selectedCategory={selectedCategory}
          exerciseCategories={exerciseCategories}
          exercises={exercises}
          exercisesLoading={exercisesLoading}
          exercisesError={exercisesError}
          selectedCategoryName={selectedCategoryName}
          handleCategoryClick={handleCategoryClick}
          handleOpenAddModal={handleOpenAddModal}
          handleViewDetails={handleViewDetails}
          clearSelectedCategory={clearSelectedCategory}
        />
      </ContentStateHandler>

      {/* Render modals using the modal state from our custom hook */}
      {addModal.render(exerciseCategories)}
      {detailsModal.render()}
    </ExercisesLayout>
  );
};

export default Exercises;