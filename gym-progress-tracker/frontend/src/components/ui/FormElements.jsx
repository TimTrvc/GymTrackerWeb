import React from 'react';

/**
 * Wiederverwendbare Formular-Komponenten
 * Folgt dem DRY-Prinzip durch Wiederverwendung gemeinsamer UI-Logik
 * und dem Single Responsibility Principle durch fokussierte Komponenten
 */

// Extrahierte gemeinsame Logik für Formular-Label (DRY-Prinzip)
const FormLabel = ({ htmlFor, children }) => {
  if (!children) return null;
  
  return (
    <label 
      htmlFor={htmlFor} 
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {children}
    </label>
  );
};

// Extrahierte gemeinsame Logik für Fehleranzeige (DRY-Prinzip)
const ErrorMessage = ({ error }) => {
  if (!error) return null;
  
  return <p className="mt-1 text-sm text-red-600">{error}</p>;
};

// Gemeinsame Funktion zum Erstellen von Klassen für Formularelemente (DRY-Prinzip)
const getInputClassName = (showError) => `w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm 
  ${showError 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
  }`;

/**
 * Textfeld-Komponente mit integrierter Fehleranzeige
 */
export const FormInput = ({ 
  label, 
  name, 
  error, 
  touched, 
  type = 'text', 
  ...props 
}) => {
  const showError = error && touched;
  
  return (
    <div className="mb-4">
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <input
        id={name}
        name={name}
        type={type}
        className={getInputClassName(showError)}
        {...props}
      />
      <ErrorMessage error={showError ? error : null} />
    </div>
  );
};

/**
 * Textarea-Komponente mit integrierter Fehleranzeige
 */
export const FormTextarea = ({ 
  label, 
  name, 
  error, 
  touched, 
  rows = 4, 
  ...props 
}) => {
  const showError = error && touched;
  
  return (
    <div className="mb-4">
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={getInputClassName(showError)}
        {...props}
      />
      <ErrorMessage error={showError ? error : null} />
    </div>
  );
};

/**
 * Select-Komponente mit integrierter Fehleranzeige
 */
export const FormSelect = ({ 
  label, 
  name, 
  error, 
  touched, 
  options = [], 
  ...props 
}) => {
  const showError = error && touched;
  
  return (
    <div className="mb-4">
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <select
        id={name}
        name={name}
        className={getInputClassName(showError)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ErrorMessage error={showError ? error : null} />
    </div>
  );
};

/**
 * Checkbox-Komponente mit integrierter Fehleranzeige
 */
export const FormCheckbox = ({ 
  label, 
  name, 
  error, 
  touched, 
  ...props 
}) => {
  const showError = error && touched;
  
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <input
          id={name}
          name={name}
          type="checkbox"
          className={`h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500
            ${showError ? 'border-red-500' : 'border-gray-300'}`}
          {...props}
        />
        {label && (
          <label 
            htmlFor={name} 
            className="ml-2 block text-sm text-gray-700"
          >
            {label}
          </label>
        )}
      </div>
      <ErrorMessage error={showError ? error : null} />
    </div>
  );
};

/**
 * Submit-Button-Komponente
 */
export const FormButton = ({ 
  children, 
  isSubmitting = false, 
  disabled = false, 
  variant = 'primary', 
  type = 'submit',
  ...props 
}) => {
  const baseClasses = "w-full rounded-md px-4 py-2 text-base font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // KISS: Vereinfachte Varianten-Klassen als Objekt statt umständlicher Logik
  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  
  // Extrahieren der Loading-Animation in eine eigene Komponente (SRP)
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Verarbeitung...
    </div>
  );
  
  return (
    <button
      type={type}
      disabled={isSubmitting || disabled}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${(isSubmitting || disabled) ? 'opacity-70 cursor-not-allowed' : ''}`}
      {...props}
    >
      {isSubmitting ? <LoadingSpinner /> : children}
    </button>
  );
};

/**
 * Formular-Statusmeldungen (Basis-Komponente)
 * Verwendet Open/Closed Principle - erweiterbar für verschiedene Typen
 */
export const FormMessage = ({ message, type = 'error' }) => {
  if (!message) return null;
  
  const styles = {
    error: "bg-red-50 border-red-200 text-red-600",
    success: "bg-green-50 border-green-200 text-green-600",
    info: "bg-blue-50 border-blue-200 text-blue-600",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-600"
  };
  
  return (
    <div className={`mb-4 p-3 border rounded-md ${styles[type]}`}>
      <p className="text-sm">{message}</p>
    </div>
  );
};

/**
 * Formular-Fehleranzeige - verwendet FormMessage mit vordefiniertem Typ
 */
export const FormError = ({ error }) => (
  <FormMessage message={error} type="error" />
);

/**
 * Formular-Erfolgsmeldung - verwendet FormMessage mit vordefiniertem Typ
 */
export const FormSuccess = ({ message }) => (
  <FormMessage message={message} type="success" />
);

// Einzelexporte für benannte Importe und Defaultexport als Objekt für Convenience
export default {
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormButton,
  FormError,
  FormSuccess,
  FormMessage
};
