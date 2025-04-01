import React, { useState } from "react";
import { createExercise, getExerciseById } from "@/services/exercisesService.js";
import AddExerciseModal from "@/components/features/exercises/AddExerciseModal.jsx";
import ExerciseDetailsModal from "@/components/features/exercises/ExerciseDetailsModal.jsx";

const useExerciseModals = ({ addExerciseToList }) => {
    // Add Exercise Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addExerciseError, setAddExerciseError] = useState(null);

    // Details Modal State
    const [selectedExerciseDetails, setSelectedExerciseDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState(null);

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

    // Details Modal Handlers
    const handleViewDetails = async (exerciseId) => {
        setDetailsLoading(true);
        setDetailsError(null);
        setSelectedExerciseDetails(null);
        try {
            const exercise = await getExerciseById(exerciseId);
            setSelectedExerciseDetails(exercise);
        } catch (error) {
            console.error('Fehler beim Abrufen der Übungsdetails:', error);
            setDetailsError('Details konnten nicht geladen werden.');
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleCloseDetailsModal = () => {
        setSelectedExerciseDetails(null);
        setDetailsError(null);
    };

    // Modal Render Functions
    const renderAddModal = (categories) => (
        <AddExerciseModal
            isOpen={isAddModalOpen}
            onClose={handleCloseAddModal}
            exerciseCategories={categories}
            onAddExercise={handleAddExercise}
            errorMessage={addExerciseError}
        />
    );

    const renderDetailsModal = () => {
        if (detailsLoading) {
            return (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <p className="text-white">Lade Details...</p>
                </div>
            );
        }

        if (detailsError) {
            return (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <p className="text-red-400">{detailsError}</p>
                    <button onClick={handleCloseDetailsModal} className="ml-4 text-white underline">
                        Schließen
                    </button>
                </div>
            );
        }

        if (selectedExerciseDetails) {
            return (
                <ExerciseDetailsModal
                    exercise={selectedExerciseDetails}
                    onClose={handleCloseDetailsModal}
                />
            );
        }

        return null;
    };

    return {
        addModal: {
            isOpen: isAddModalOpen,
            error: addExerciseError,
            render: renderAddModal,
        },
        detailsModal: {
            isLoading: detailsLoading,
            error: detailsError,
            exercise: selectedExerciseDetails,
            render: renderDetailsModal,
        },
        handleOpenAddModal,
        handleCloseAddModal,
        handleAddExercise,
        handleViewDetails,
        handleCloseDetailsModal,
    };
};

export default useExerciseModals;