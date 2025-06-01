import { useState, useCallback } from 'react';

/**
 * React hook for managing form state and validation, encapsulating form logic for reuse.
 *
 * @param {Object} initialValues - Initial values for the form fields.
 * @param {Function} validateFn - Validation function that returns { isValid, errors }.
 * @param {Function} onSubmit - Callback function called on successful validation.
 * @returns {Object} Form state, helpers, and handlers.
 */
export const useForm = (initialValues = {}, validateFn = () => ({ isValid: true, errors: {} }), onSubmit = () => {}) => {
  // Form state
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Updates a single form field value.
   * @param {object} e - The input change event.
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
   * Updates multiple form field values at once.
   * @param {object} newValues - Object with new field values.
   */
  const setMultipleValues = useCallback((newValues) => {
    setValues((prevValues) => ({
      ...prevValues,
      ...newValues
    }));
  }, []);

  /**
   * Marks a field as touched and validates the form on blur.
   * @param {object} e - The blur event.
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true
    }));
    const validationResult = validateFn(values);
    setErrors(validationResult.errors || {});
  }, [values, validateFn]);

  /**
   * Handles form submission, validates, and calls onSubmit if valid.
   * @param {object} e - The submit event.
   */
  const handleSubmit = useCallback((e) => {
    e && e.preventDefault();
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    // Validate the form
    const validationResult = validateFn(values);
    setErrors(validationResult.errors || {});
    if (validationResult.isValid) {
      setIsSubmitting(true);
      Promise.resolve(onSubmit(values))
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [values, validateFn, onSubmit]);

  /**
   * Resets the form to its initial values and clears errors/touched state.
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
    /**
     * Checks if a field has an error and has been touched.
     * @param {string} fieldName - The field name to check.
     * @returns {boolean}
     */
    hasError: useCallback((fieldName) => !!(errors[fieldName] && touched[fieldName]), [errors, touched])
  };
};

export default useForm;
