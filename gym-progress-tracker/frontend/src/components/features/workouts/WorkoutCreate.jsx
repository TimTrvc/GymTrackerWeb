import React, { useState } from "react";
import PropTypes from 'prop-types';

/**
 * WorkoutCreate - Komponente zum Erstellen eines neuen Workouts
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Formularfelder in eigene Komponenten extrahiert
 * - Open/Closed: Erweiterbar für weitere Formularfelder
 * 
 * KISS: Klare, fokussierte Komponenten
 * DRY: Wiederverwendbare Formularkomponenten
 * 
 * @param {Object} props - Komponenten-Props
 * @param {Function} props.handleWorkoutSubmit - Callback für das Absenden des Formulars
 * @param {Object} props.initialValues - Optionale Anfangswerte für das Formular
 */
const WorkoutCreate = ({ 
  handleWorkoutSubmit,
  initialValues = {
    name: '',
    description: '',
    difficulty_level: 'beginner',
    target_audience: 'all',
    goal: 'strength',
    estimated_duration_minutes: 30,
    is_featured: false
  }
}) => {
  // Formular-State mit initialValues
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  /**
   * Behandelt Änderungen an Formularfeldern
   * @param {Event} e - Das Event-Objekt
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Checkbox-Werte speziell behandeln
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    // Fehler für dieses Feld zurücksetzen
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Validiert das Formular vor dem Absenden
   * @returns {boolean} Gibt true zurück, wenn das Formular gültig ist
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Erforderliche Felder prüfen
    if (!formData.name?.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }
    
    if (!formData.estimated_duration_minutes) {
      newErrors.estimated_duration_minutes = 'Dauer ist erforderlich';
    } else if (formData.estimated_duration_minutes < 1) {
      newErrors.estimated_duration_minutes = 'Dauer muss mindestens 1 Minute betragen';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Behandelt das Absenden des Formulars
   * @param {Event} e - Das Event-Objekt
   */
  const onSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      handleWorkoutSubmit(formData);
    }
  };

  // Wiederverwendbare Formularkomponenten (DRY-Prinzip)

  /**
   * TextField-Komponente
   */
  const TextField = ({ id, label, required = false, ...rest }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={id}
        className={`w-full px-4 py-2 border ${errors[id] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        onChange={handleInputChange}
        value={formData[id] || ''}
        {...rest}
      />
      {errors[id] && <p className="mt-1 text-sm text-red-500">{errors[id]}</p>}
    </div>
  );

  /**
   * TextArea-Komponente
   */
  const TextArea = ({ id, label, rows = 4, ...rest }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        className={`w-full px-4 py-2 border ${errors[id] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        onChange={handleInputChange}
        value={formData[id] || ''}
        {...rest}
      ></textarea>
      {errors[id] && <p className="mt-1 text-sm text-red-500">{errors[id]}</p>}
    </div>
  );

  /**
   * Select-Komponente
   */
  const SelectField = ({ id, label, options, ...rest }) => (
    <div>
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
        {label}
      </label>
      <select
        id={id}
        name={id}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onChange={handleInputChange}
        value={formData[id] || ''}
        {...rest}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[id] && <p className="mt-1 text-sm text-red-500">{errors[id]}</p>}
    </div>
  );

  /**
   * Checkbox-Komponente
   */
  const CheckboxField = ({ id, label, ...rest }) => (
    <div className="mb-6">
      <label className="flex items-center">
        <input
          type="checkbox"
          id={id}
          name={id}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          onChange={handleInputChange}
          checked={formData[id] || false}
          {...rest}
        />
        <span className="ml-2 text-gray-700">{label}</span>
      </label>
    </div>
  );

  // Dropdown-Optionen (warten auf Änderungen außerhalb der Komponente)
  const difficultyOptions = [
    { value: 'beginner', label: 'Anfänger' },
    { value: 'intermediate', label: 'Fortgeschritten' },
    { value: 'advanced', label: 'Profi' }
  ];

  const targetAudienceOptions = [
    { value: 'all', label: 'Alle' },
    { value: 'beginners', label: 'Anfänger' },
    { value: 'weight_loss', label: 'Gewichtsabnahme' },
    { value: 'muscle_gain', label: 'Muskelaufbau' }
  ];

  const goalOptions = [
    { value: 'strength', label: 'Kraft' },
    { value: 'endurance', label: 'Ausdauer' },
    { value: 'flexibility', label: 'Flexibilität' },
    { value: 'weight_loss', label: 'Gewichtsabnahme' },
    { value: 'muscle_gain', label: 'Muskelaufbau' }
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Neues Workout erstellen</h2>

      <form onSubmit={onSubmit}>
        <TextField
          id="name"
          label="Name des Workouts"
          type="text"
          required
        />

        <TextArea
          id="description"
          label="Beschreibung"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <SelectField
            id="difficulty_level"
            label="Schwierigkeitsgrad"
            options={difficultyOptions}
          />

          <SelectField
            id="target_audience"
            label="Zielgruppe"
            options={targetAudienceOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <SelectField
            id="goal"
            label="Ziel des Workouts"
            options={goalOptions}
          />

          <TextField
            id="estimated_duration_minutes"
            label="Dauer (Minuten)"
            type="number"
            min="1"
            required
          />
        </div>

        <CheckboxField
          id="is_featured"
          label="Als Featured Workout markieren"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Workout erstellen
          </button>
        </div>
      </form>
    </div>
  );
};

// PropTypes für bessere Typsicherheit und Dokumentation
WorkoutCreate.propTypes = {
  handleWorkoutSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    difficulty_level: PropTypes.string,
    target_audience: PropTypes.string,
    goal: PropTypes.string,
    estimated_duration_minutes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_featured: PropTypes.bool
  })
};

export default WorkoutCreate;
