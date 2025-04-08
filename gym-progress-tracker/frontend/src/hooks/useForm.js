import { useState, useCallback } from 'react';

/**
 * Custom Hook für die Verwaltung von Formularstatus und Validierung
 * Folgt dem SOLID Prinzip durch Kapselung der Formularlogik
 * 
 * @param {Object} initialValues - Anfangswerte des Formulars
 * @param {Function} validateFn - Validierungsfunktion
 * @param {Function} onSubmit - Funktion, die bei erfolgreicher Validierung aufgerufen wird
 * @returns {Object} Formularstatus, Hilfsfunktionen und Handler
 */
export const useForm = (initialValues = {}, validateFn = () => ({ isValid: true, errors: {} }), onSubmit = () => {}) => {
  // Formularstatus
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Aktualisiert einen einzelnen Formularwert
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues((prevValues) => ({
      ...prevValues,
      [name]: fieldValue
    }));
  }, []);
  
  /**
   * Aktualisiert mehrere Formularwerte auf einmal
   */
  const setMultipleValues = useCallback((newValues) => {
    setValues((prevValues) => ({
      ...prevValues,
      ...newValues
    }));
  }, []);
  
  /**
   * Markiert ein Feld als berührt, wenn der Fokus verloren geht
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true
    }));
    
    // Validiere das Feld, wenn es berührt wurde
    const validationResult = validateFn(values);
    setErrors(validationResult.errors || {});
  }, [values, validateFn]);
  
  /**
   * Behandelt die Formularabsendung
   */
  const handleSubmit = useCallback((e) => {
    e && e.preventDefault();
    
    // Markiere alle Felder als berührt
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    // Validiere das Formular
    const validationResult = validateFn(values);
    setErrors(validationResult.errors || {});
    
    if (validationResult.isValid) {
      setIsSubmitting(true);
      
      // Rufe die onSubmit-Funktion auf und setze isSubmitting zurück, wenn sie fertig ist
      Promise.resolve(onSubmit(values))
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [values, validateFn, onSubmit]);
  
  /**
   * Setzt das Formular auf seine Anfangswerte zurück
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setMultipleValues,
    resetForm,
    // Hilfsmethode, um zu prüfen, ob ein Feld Fehler hat und berührt wurde
    hasError: useCallback((fieldName) => !!(errors[fieldName] && touched[fieldName]), [errors, touched])
  };
};

export default useForm;
