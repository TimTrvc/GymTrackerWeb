import React from 'react';

/**
 * Wiederverwendbare Formular-Komponenten
 * Folgt dem DRY-Prinzip durch Wiederverwendung gemeinsamer UI-Logik
 */

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
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className={`w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm 
          ${showError 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
        {...props}
      />
      {showError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
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
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={`w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm 
          ${showError 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
        {...props}
      />
      {showError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
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
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        className={`w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm 
          ${showError 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {showError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
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
      {showError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
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
  
  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  
  return (
    <button
      type={type}
      disabled={isSubmitting || disabled}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${(isSubmitting || disabled) ? 'opacity-70 cursor-not-allowed' : ''}`}
      {...props}
    >
      {isSubmitting ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verarbeitung...
        </div>
      ) : children}
    </button>
  );
};

/**
 * Formular-Fehleranzeige
 */
export const FormError = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
      <p className="text-sm text-red-600">{error}</p>
    </div>
  );
};

/**
 * Formular-Erfolgsmeldung
 */
export const FormSuccess = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
      <p className="text-sm text-green-600">{message}</p>
    </div>
  );
};

export default {
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormButton,
  FormError,
  FormSuccess
};
