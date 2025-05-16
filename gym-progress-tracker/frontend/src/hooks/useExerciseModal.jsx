import React, { useState } from "react";
import { createExercise } from "@/services/exercisesService.js";
import AddExerciseModal from "@/components/features/exercises/AddExerciseModal.jsx";

const useExerciseModals = ({ addExerciseToList }) => {
    // Add Exercise Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addExerciseError, setAddExerciseError] = useState(null);

    // Add Exercise Modal Handlers
    const handleOpenAddModal = () => {
        setAddExerciseError(null);
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setAddExerciseError(null);
    };

    const handleAddExercise = async (newExercise) => {
        setAddExerciseError(null);
        try {
            const addedExercise = await createExercise(newExercise);
            addExerciseToList(addedExercise);
            handleCloseAddModal();
        } catch (error) {
            console.error('Fehler beim Hinzufügen der Übung:', error);
            setAddExerciseError('Die Übung konnte nicht hinzugefügt werden. Bitte versuchen Sie es erneut.');
        }
    };

    // Modal Render Function for AddExerciseModal only
    const renderAddModal = (categories) => (
        <AddExerciseModal
            isOpen={isAddModalOpen}
            onClose={handleCloseAddModal}
            exerciseCategories={categories}
            onAddExercise={handleAddExercise}
            errorMessage={addExerciseError}
        />
    );

    return {
        addModal: {
            isOpen: isAddModalOpen,
            error: addExerciseError,
            render: renderAddModal,
        },
        handleOpenAddModal,
        handleCloseAddModal,
        handleAddExercise,
    };
};

export default useExerciseModals;