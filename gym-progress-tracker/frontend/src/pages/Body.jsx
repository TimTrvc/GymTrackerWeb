import React, { useState, useEffect } from 'react';
import { getBodyMeasurements, addBodyMeasurement, deleteBodyMeasurement } from '@/services/bodyMeasurementsService';
import HeroSection from '@/components/layout/HeroSection';
import BodyModel3D from '@/components/features/body/BodyModel3D';
import MeasurementTimeline from '@/components/features/body/MeasurementTimeline';
import MeasurementForm from '@/components/features/body/MeasurementForm';
import useUserGender from '@/hooks/useUserGender';

const Body = () => {
  const [measurements, setMeasurements] = useState([]);
  const [showModelView, setShowModelView] = useState(true);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [viewMode, setViewMode] = useState('model'); // model, timeline, form
  const { gender, loading: genderLoading } = useUserGender();
  const [formData, setFormData] = useState({
    measurement_date: new Date().toISOString().split('T')[0],
    chest: '',
    waist: '',
    hips: '',
    neck: '',
    biceps_left: '',
    biceps_right: '',
    thigh_left: '',
    thigh_right: '',
    calf_left: '',
    calf_right: '',
    body_fat_percentage: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    body_fat_percentage: 'Körperfettanteil',
  };

  const bodyPartIcons = {
    chest: '👕',
    waist: '👖',
    hips: '🍑',
    neck: '👔',
    biceps_left: '💪',
    biceps_right: '💪',
    thigh_left: '🦵',
    thigh_right: '🦵',
    calf_left: '🦿',
    calf_right: '🦿',
    body_fat_percentage: '📊',
  };

  useEffect(() => {
    const fetchMeasurements = async () => {
      setLoading(true);
      try {
        const data = await getBodyMeasurements();
        setMeasurements(data);
      } catch (error) {
        console.error('Error fetching body measurements:', error);
        setError('Failed to fetch body measurements. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.measurement_date) return 'Measurement date is required.';
    if (!formData.chest || formData.chest <= 0) return 'Chest measurement must be a positive number.';
    return '';
  };

  const handleDeleteMeasurement = async (measurementId) => {
    setLoading(true);
    try {
      await deleteBodyMeasurement(measurementId);
      setMeasurements(measurements.filter((m) => m.measurement_id !== measurementId));
      setSuccess('Messung erfolgreich gelöscht');
    } catch (error) {
      console.error('Error deleting measurement:', error);
      setError('Fehler beim Löschen der Messung. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await addBodyMeasurement(formData);
      const newMeasurement = response.measurement;
      setMeasurements([newMeasurement, ...measurements]);
      setSuccess('Measurement added successfully!');
      setFormData({
        measurement_date: new Date().toISOString().split('T')[0],
        chest: '',
        waist: '',
        hips: '',
        neck: '',
        biceps_left: '',
        biceps_right: '',
        thigh_left: '',
        thigh_right: '',
        calf_left: '',
        calf_right: '',
        body_fat_percentage: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error adding body measurement:', error);
      setError('Failed to add measurement. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle body part selection from 3D model or simple view
  const handleBodyPartSelect = (partId) => {
    setSelectedBodyPart(partId);
    setViewMode('timeline');
  };

  // Handle adding a measurement for a specific body part
  const handleAddMeasurementForPart = () => {
    if (!selectedBodyPart) return;
    setViewMode('form');
  };

  // Submit a single body part measurement
  const handleSingleMeasurementSubmit = async (data) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Add the current date and preserve any notes
      const measurementData = {
        ...data,
        measurement_date: data.measurement_date || new Date().toISOString().split('T')[0],
      };

      const response = await addBodyMeasurement(measurementData);
      const newMeasurement = response.measurement;
      setMeasurements([newMeasurement, ...measurements]);
      const bodyPartName = bodyPartLabels[selectedBodyPart] || selectedBodyPart;
      setSuccess(`Wert für ${bodyPartName} erfolgreich hinzugefügt!`);
      // Return to timeline view
      setViewMode('timeline');
    } catch (error) {
      console.error('Error adding body measurement:', error);
      setError('Fehler beim Hinzufügen der Messung. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  // Return to model view
  const handleBackToModel = () => {
    setSelectedBodyPart(null);
    setViewMode('model');
  };

  // Toggle between model view and traditional form view
  const toggleView = () => {
    setShowModelView(!showModelView);
    setSelectedBodyPart(null);
    setViewMode('model');
  };

  // Filter measurements for a specific body part
  const getMeasurementsForPart = (partName) => {
    return measurements.filter((m) => m[partName] !== null && m[partName] !== undefined && m[partName] !== '');
  };

  // Check if there are any measurements for the selected body part
  const hasDataForSelectedPart = () => {
    if (!selectedBodyPart || !measurements.length) return false;
    return getMeasurementsForPart(selectedBodyPart).length > 0;
  };

  return (
    <>
      <HeroSection title="Körpermaße" subtitle="Verfolge deine Körpermaße und Fortschritte" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toggle button for view modes */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleView}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {showModelView ? (
              <>
                <span>Einfache Ansicht</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            ) : (
              <>
                <span>Modell Ansicht</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Display success/error messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            {success}
          </div>
        )}

        {showModelView ? (
          <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6">
            {/* Interactive Body Model View */}
            {viewMode === 'model' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Körpermodell</h2>
                <p className="text-gray-600">
                  Wählen Sie einen Körperteil aus, um Messungen anzuzeigen oder hinzuzufügen
                </p>

                {genderLoading ? (
                  <div className="flex items-center justify-center h-[500px]">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <BodyModel3D gender={gender} onBodyPartSelect={handleBodyPartSelect} />
                )}
              </div>
            )}

            {/* Timeline View for selected body part */}
            {viewMode === 'timeline' && selectedBodyPart && (
              <>
                <div className="mb-4 flex items-center">
                  <button
                    onClick={handleBackToModel}
                    className="mr-4 text-blue-500 hover:text-blue-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Zurück zum Modell
                  </button>
                  <h2 className="text-xl font-bold flex-1">{bodyPartLabels[selectedBodyPart]} Messungsverlauf</h2>
                  <button
                    onClick={handleAddMeasurementForPart}
                    className="text-blue-500 hover:text-blue-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Neue Messung hinzufügen
                  </button>
                </div>

                {hasDataForSelectedPart() ? (
                  <MeasurementTimeline
                    measurements={getMeasurementsForPart(selectedBodyPart)}
                    selectedPart={selectedBodyPart}
                    onClose={handleBackToModel}
                    onDelete={handleDeleteMeasurement}
                  />
                ) : (
                  <div className="text-center py-10">
                    <div className="text-6xl mb-4">{bodyPartIcons[selectedBodyPart] || '📏'}</div>
                    <h3 className="text-xl font-medium mb-2">Keine Messungen verfügbar</h3>
                    <p className="text-gray-600 mb-6">
                      Sie haben noch keine Messungen für {bodyPartLabels[selectedBodyPart]} hinzugefügt.
                    </p>
                    <button
                      onClick={handleAddMeasurementForPart}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Erste Messung hinzufügen
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Form for adding a measurement for selected body part */}
            {viewMode === 'form' && selectedBodyPart && (
              <>
                <div className="mb-4 flex items-center">
                  <button
                    onClick={() => setViewMode('timeline')}
                    className="mr-4 text-blue-500 hover:text-blue-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Zurück zur Zeitleiste
                  </button>
                  <h2 className="text-xl font-bold flex-1">Neue {bodyPartLabels[selectedBodyPart]} Messung hinzufügen</h2>
                </div>

                <MeasurementForm
                  selectedPart={selectedBodyPart}
                  onSubmit={handleSingleMeasurementSubmit}
                  onCancel={() => setViewMode('timeline')}
                  loading={loading}
                />
              </>
            )}
          </div>
        ) : (
          <>
            {/* Simple View with Body Part Buttons */}
            {viewMode === 'model' && (
              <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6">
                <h2 className="text-xl font-bold mb-6">Körpermaße auswählen</h2>
                <p className="text-gray-600 mb-6">
                  Wählen Sie einen Körperteil aus, um Messungen anzuzeigen oder hinzuzufügen
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Object.keys(bodyPartLabels).map((part) => (
                    <button
                      key={part}
                      onClick={() => handleBodyPartSelect(part)}
                      className="bg-white border border-gray-200 hover:bg-gray-50 shadow-sm rounded-lg p-4 flex flex-col items-center justify-center transition-colors"
                    >
                      <span className="text-3xl mb-2">{bodyPartIcons[part] || '📏'}</span>
                      <span className="text-center">{bodyPartLabels[part]}</span>
                      <span className="text-xs text-gray-500 mt-1">
                        {getMeasurementsForPart(part).length}{' '}
                        {getMeasurementsForPart(part).length === 1 ? 'Messung' : 'Messungen'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline View for selected body part - Same as in model view */}
            {viewMode === 'timeline' && selectedBodyPart && (
              <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6">
                <div className="mb-4 flex items-center">
                  <button
                    onClick={handleBackToModel}
                    className="mr-4 text-blue-500 hover:text-blue-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Zurück zur Übersicht
                  </button>
                  <h2 className="text-xl font-bold flex-1">{bodyPartLabels[selectedBodyPart]} Messungsverlauf</h2>
                  <button
                    onClick={handleAddMeasurementForPart}
                    className="text-blue-500 hover:text-blue-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Neue Messung hinzufügen
                  </button>
                </div>

                {hasDataForSelectedPart() ? (
                  <MeasurementTimeline
                    measurements={getMeasurementsForPart(selectedBodyPart)}
                    selectedPart={selectedBodyPart}
                    onClose={handleBackToModel}
                    onDelete={handleDeleteMeasurement}
                  />
                ) : (
                  <div className="text-center py-10">
                    <div className="text-6xl mb-4">{bodyPartIcons[selectedBodyPart] || '📏'}</div>
                    <h3 className="text-xl font-medium mb-2">Keine Messungen verfügbar</h3>
                    <p className="text-gray-600 mb-6">
                      Sie haben noch keine Messungen für {bodyPartLabels[selectedBodyPart]} hinzugefügt.
                    </p>
                    <button
                      onClick={handleAddMeasurementForPart}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Erste Messung hinzufügen
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Form for adding a measurement for selected body part - Same as in model view */}
            {viewMode === 'form' && selectedBodyPart && (
              <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6">
                <div className="mb-4 flex items-center">
                  <button
                    onClick={() => setViewMode('timeline')}
                    className="mr-4 text-blue-500 hover:text-blue-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Zurück zur Zeitleiste
                  </button>
                  <h2 className="text-xl font-bold flex-1">Neue {bodyPartLabels[selectedBodyPart]} Messung hinzufügen</h2>
                </div>

                <MeasurementForm
                  selectedPart={selectedBodyPart}
                  onSubmit={handleSingleMeasurementSubmit}
                  onCancel={() => setViewMode('timeline')}
                  loading={loading}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Body;