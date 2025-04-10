import React from 'react';
import PropTypes from 'prop-types';

/**
 * Wiederverwendbare Formular-Komponenten
 * 
 * SOLID:
 * - Single Responsibility: Jede Komponente ist für eine Art von Formularfeld verantwortlich
 * - Open/Closed: Komponenten sind durch Props erweiterbar ohne internen Code zu ändern
 * 
 * KISS: Einfache, klar verständliche Komponenten
 * DRY: Zentralisierte Form-Komponenten zur Wiederverwendung in der gesamten App
 */

/**
 * TextField - Einfaches Eingabefeld für Text und andere Eingabetypen
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.id - ID und name des Feldes
 * @param {string} props.label - Label-Text
 * @param {boolean} props.required - Ist das Feld erforderlich?
 * @param {string} props.error - Fehlermeldung (optional)
 */
export const TextField = ({ id, label, required = false, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            id={id}
            name={id}
            className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...props}
        />
        {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
    </div>
);

TextField.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    error: PropTypes.string
};

/**
 * TextArea - Mehrzeiliges Eingabefeld für längere Texte
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.id - ID und name des Feldes
 * @param {string} props.label - Label-Text
 * @param {number} props.rows - Anzahl der Zeilen (Standard: 3)
 * @param {string} props.error - Fehlermeldung (optional)
 */
export const TextArea = ({ id, label, rows = 3, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <textarea
            id={id}
            name={id}
            rows={rows}
            className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...props}
        />
        {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
    </div>
);

TextArea.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    rows: PropTypes.number,
    error: PropTypes.string
};

/**
 * SelectField - Auswahlfeld für Optionen
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.id - ID und name des Feldes
 * @param {string} props.label - Label-Text
 * @param {Array} props.options - Array von {value, label} Objekten
 * @param {boolean} props.required - Ist das Feld erforderlich?
 * @param {string} props.error - Fehlermeldung (optional)
 * @param {string} props.placeholder - Platzhaltertext für die erste Option (optional)
 */
export const SelectField = ({ id, label, options, required = false, error, placeholder, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            id={id}
            name={id}
            className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...props}
        >
            <option value="">{placeholder || `${label} wählen`}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
    </div>
);

SelectField.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired
        })
    ).isRequired,
    required: PropTypes.bool,
    error: PropTypes.string,
    placeholder: PropTypes.string
};

/**
 * CheckboxField - Checkbox für boolesche Werte
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.id - ID und name des Feldes
 * @param {string} props.label - Label-Text
 */
export const CheckboxField = ({ id, label, ...props }) => (
    <div className="flex items-center">
        <input
            id={id}
            name={id}
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            {...props}
        />
        <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
            {label}
        </label>
    </div>
);

CheckboxField.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
};

/**
 * ArrayField - Eingabefeld für Arrays mit kommagetrennten Werten
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.id - ID und name des Feldes
 * @param {string} props.label - Label-Text
 * @param {string} props.helpText - Hilfetext unterhalb des Feldes (optional)
 */
export const ArrayField = ({ id, label, helpText, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            id={id}
            name={id}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...props}
        />
        {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
);

ArrayField.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    helpText: PropTypes.string
};
