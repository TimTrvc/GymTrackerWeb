import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Form component for updating a single body part measurement
 */
const MeasurementForm = ({ 
  selectedPart, 
  onSubmit, 
  onCancel, 
  initialValue = '', 
  loading = false 
}) => {
  const [value, setValue] = useState(initialValue);
  const [measurementDate, setMeasurementDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  const bodyPartLabels = {
    chest: 'Brustumfang',
    waist: 'Taille',
    hips: 'Hüfte',
    neck: 'Nacken',
    biceps_left: 'Bizeps links',
    biceps_right: 'Bizeps rechts',
    thigh_left: 'Oberschenkel links',
    thigh_right: 'Oberschenkel rechts',
    calf_left: 'Wade links',
    calf_right: 'Wade rechts',
    body_fat_percentage: 'Körperfettanteil'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (value === '' || isNaN(value) || Number(value) <= 0) {
      return;
    }
    
    onSubmit({
      [selectedPart]: Number(value),
      measurement_date: measurementDate
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">
        {bodyPartLabels[selectedPart] || selectedPart} bearbeiten
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="measurement-date" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Datum
          </label>
          <input
              type="date"
              id="measurement-date"
              value={measurementDate}
              onChange={(e) => setMeasurementDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
          />
        </div>
        
        <div className="mb-4">
          <label 
            htmlFor="measurement-value" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {selectedPart === 'body_fat_percentage' ? 'Wert (%)' : 'Wert (cm)'}
          </label>
          <input
            type="number"
            id="measurement-value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            step="0.1"
            min="0"
            placeholder={selectedPart === 'body_fat_percentage' ? 'z.B. 15.5' : 'z.B. 40.5'}
            required
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading || value === '' || isNaN(value) || Number(value) <= 0}
          >
            {loading ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </form>
    </div>
  );
};

MeasurementForm.propTypes = {
  selectedPart: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.bool
};

export default MeasurementForm;