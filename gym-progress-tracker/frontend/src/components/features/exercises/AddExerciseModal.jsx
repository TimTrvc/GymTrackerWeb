import React, { useState } from 'react';
import PropTypes from 'prop-types';
import exercisesService from '@/services/exercisesService';
import { TextField, TextArea, SelectField, CheckboxField, ArrayField } from '@/components/common/FormElements';

/**
 * AddExerciseModal - Komponente zum Hinzufügen einer neuen Übung
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Komponente aufgeteilt in kleinere, fokussierte Unterkomponenten
 * - Open/Closed: Erweiterbar für verschiedene Formularfelder ohne Kerncode zu ändern
 * 
 * KISS: Klare, verständliche Komponentenstruktur
 * DRY: Wiederverwendung von Formularelementen durch gemeinsame Komponenten
 * 
 * @param {Object} props - Komponenten-Props
 * @param {boolean} props.isOpen - Ist das Modal geöffnet?
 * @param {Function} props.onClose - Callback zum Schließen des Modals 
 * @param {Array} props.exerciseCategories - Liste der verfügbaren Übungskategorien
 * @param {Function} props.onAddExercise - Callback zum Hinzufügen der Übung
 */
const AddExerciseModal = ({
    isOpen,
    onClose,
    exerciseCategories,
    onAddExercise
}) => {
    // Anfangszustand als Konstante extrahiert (DRY-Prinzip)
    const INITIAL_EXERCISE_STATE = {
        name: '',
        description: '',
        category_id: '',
        instructions: '',
        difficulty_level: '',
        primary_muscle_group: '',
        secondary_muscle_groups: [],
        equipment_needed: [],
        is_compound: false,
        video_url: '',
        image_url: ''
    };

    const [exercise, setExercise] = useState(INITIAL_EXERCISE_STATE);
    const [validationErrors, setValidationErrors] = useState({});

    /**
     * Behandelt Änderungen an den Eingabefeldern
     * Extrahiert in eigene Funktion (Single Responsibility)
     */
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle different input types
        if (type === 'checkbox') {
            setExercise(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (name === 'secondary_muscle_groups' || name === 'equipment_needed') {
            // Split comma-separated values into array
            setExercise(prev => ({
                ...prev,
                [name]: value.split(',').map(item => item.trim()).filter(item => item !== '')
            }));
        } else {
            setExercise(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Lösche Validierungsfehler für dieses Feld bei Eingabe
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    /**
     * Validiert das Formular
     * Extrahiert in eigene Funktion (Single Responsibility)
     */
    const validateForm = () => {
        const errors = {};
        
        if (!exercise.name.trim()) {
            errors.name = 'Name ist erforderlich';
        }
        
        if (!exercise.category_id) {
            errors.category_id = 'Kategorie ist erforderlich';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /**
     * Behandelt das Absenden des Formulars
     * Extrahiert in eigene Funktion (Single Responsibility)
     */
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            // exercisesService verwenden, anstatt direkt den onAddExercise-Callback aufzurufen
            await exercisesService.create(exercise);
            
            // Informiere den Parent-Komponenten über den Erfolg
            onAddExercise(exercise);
            resetForm();
        } catch (error) {
            console.error("Fehler beim Erstellen der Übung:", error);
            setValidationErrors(prev => ({
                ...prev,
                form: 'Fehler beim Speichern der Übung. Bitte versuchen Sie es erneut.'
            }));
        }
    };

    /**
     * Setzt das Formular zurück
     * Extrahiert in eigene Funktion (Single Responsibility)
     */
    const resetForm = () => {
        setExercise(INITIAL_EXERCISE_STATE);
        setValidationErrors({});
        onClose();
    };

    // Frühes Return, wenn das Modal nicht geöffnet ist (KISS-Prinzip)
    if (!isOpen) return null;

    // Optionen für Dropdown-Listen
    const difficultyOptions = [
        { value: 'beginner', label: 'Anfänger' },
        { value: 'intermediate', label: 'Fortgeschritten' },
        { value: 'advanced', label: 'Profi' }
    ];

    const categoryOptions = exerciseCategories.map(category => ({
        value: category.category_id,
        label: category.name
    }));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Neue Übung hinzufügen</h2>
                    <p className="text-gray-500 text-sm">Erstellen Sie eine neue Übung für eine Kategorie</p>
                </div>

                {validationErrors.form && (
                    <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-500 text-sm">{validationErrors.form}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <TextField 
                        id="name"
                        label="Name"
                        type="text"
                        value={exercise.name}
                        onChange={handleInputChange}
                        placeholder="Name der Übung"
                        required
                        error={validationErrors.name}
                    />

                    <TextArea 
                        id="description"
                        label="Beschreibung"
                        value={exercise.description}
                        onChange={handleInputChange}
                        placeholder="Beschreiben Sie die Übung"
                        error={validationErrors.description}
                    />

                    <SelectField 
                        id="category_id"
                        label="Kategorie"
                        value={exercise.category_id}
                        onChange={handleInputChange}
                        options={categoryOptions}
                        required
                        error={validationErrors.category_id}
                    />

                    <TextArea 
                        id="instructions"
                        label="Anweisungen"
                        value={exercise.instructions}
                        onChange={handleInputChange}
                        placeholder="Detaillierte Ausführungsanweisungen"
                        error={validationErrors.instructions}
                    />

                    <SelectField 
                        id="difficulty_level"
                        label="Schwierigkeitsstufe"
                        value={exercise.difficulty_level}
                        onChange={handleInputChange}
                        options={difficultyOptions}
                        error={validationErrors.difficulty_level}
                    />

                    <TextField 
                        id="primary_muscle_group"
                        label="Primäre Muskelgruppe"
                        type="text"
                        value={exercise.primary_muscle_group}
                        onChange={handleInputChange}
                        placeholder="Z.B. Brust, Rücken, Beine"
                        error={validationErrors.primary_muscle_group}
                    />

                    <ArrayField 
                        id="secondary_muscle_groups"
                        label="Sekundäre Muskelgruppen"
                        type="text"
                        value={exercise.secondary_muscle_groups.join(', ')}
                        onChange={handleInputChange}
                        placeholder="Komma-getrennte Liste, z.B. Schultern, Trizeps"
                        helpText="Mehrere Muskelgruppen durch Komma trennen"
                    />

                    <ArrayField 
                        id="equipment_needed"
                        label="Benötigte Ausrüstung"
                        type="text"
                        value={exercise.equipment_needed.join(', ')}
                        onChange={handleInputChange}
                        placeholder="Komma-getrennte Liste, z.B. Hantel, Langhantel"
                        helpText="Mehrere Ausrüstungen durch Komma trennen"
                    />

                    <CheckboxField 
                        id="is_compound"
                        label="Ist eine Verbundübung (Compound Exercise)"
                        checked={exercise.is_compound}
                        onChange={handleInputChange}
                    />

                    <TextField 
                        id="video_url"
                        label="Video-URL"
                        type="url"
                        value={exercise.video_url}
                        onChange={handleInputChange}
                        placeholder="URL zum Übungsvideo"
                        error={validationErrors.video_url}
                    />

                    <TextField 
                        id="image_url"
                        label="Bild-URL"
                        type="url"
                        value={exercise.image_url}
                        onChange={handleInputChange}
                        placeholder="URL zum Übungsbild"
                        error={validationErrors.image_url}
                    />
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                        type="button"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        type="button"
                    >
                        Übung hinzufügen
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * PropTypes für bessere Entwicklerfreundlichkeit und Typsicherheit
 */
AddExerciseModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    exerciseCategories: PropTypes.arrayOf(
        PropTypes.shape({
            category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired,
    onAddExercise: PropTypes.func.isRequired
};

export default AddExerciseModal;