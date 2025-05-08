import React, { useState, useEffect } from 'react';
import { getBodyMeasurements, addBodyMeasurement } from '@/services/bodyMeasurementsService';
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

  // Handle body part selection from 3D model
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
      setSuccess(`${selectedBodyPart} measurement added successfully!`);
      
      // Return to timeline view
      setViewMode('timeline');
    } catch (error) {
      console.error('Error adding body measurement:', error);
      setError('Failed to add measurement. Please try again later.');
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
                  <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2z" clipRule="evenodd" />
                </svg>
              </>
            ) : (
              <>
                <span>Modell Ansicht</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Display success/error messages */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">{success}</div>}

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
                  <BodyModel3D 
                    gender={gender} 
                    onBodyPartSelect={handleBodyPartSelect}
                  />
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
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Zurück zum Modell
                  </button>
                  <h2 className="text-xl font-bold flex-1">Messungsverlauf</h2>
                  <button
                    onClick={handleAddMeasurementForPart}
                    className="text-blue-500 hover:text-blue-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Neue Messung hinzufügen
                  </button>
                </div>
                
                <MeasurementTimeline 
                  measurements={measurements} 
                  selectedPart={selectedBodyPart} 
                  onClose={handleBackToModel}
                />
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
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Zurück zur Zeitleiste
                  </button>
                  <h2 className="text-xl font-bold flex-1">Neue Messung hinzufügen</h2>
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
            {/* Traditional Form View */}
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6">
              <h2 className="text-xl font-bold mb-4">Körpermaße hinzufügen</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="measurement_date"
                  value={formData.measurement_date}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  name="chest"
                  placeholder="Brustumfang (cm)"
                  value={formData.chest}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  name="waist"
                  placeholder="Taille (cm)"
                  value={formData.waist}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  name="hips"
                  placeholder="Hüfte (cm)"
                  value={formData.hips}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  name="neck"
                  placeholder="Nacken (cm)"
                  value={formData.neck}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  name="biceps_left"
                  placeholder="Bizeps links (cm)"
                  value={formData.biceps_left}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  name="biceps_right"
                  placeholder="Bizeps rechts (cm)"
                  value={formData.biceps_right}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  name="thigh_left"
                  placeholder="Oberschenkel links (cm)"
                  value={formData.thigh_left}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  name="thigh_right"
                  placeholder="Oberschenkel rechts (cm)"
                  value={formData.thigh_right}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  name="calf_left"
                  placeholder="Wade links (cm)"
                  value={formData.calf_left}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  name="calf_right"
                  placeholder="Wade rechts (cm)"
                  value={formData.calf_right}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  name="body_fat_percentage"
                  placeholder="Körperfettanteil (%)"
                  value={formData.body_fat_percentage}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <textarea
                name="notes"
                placeholder="Notizen"
                value={formData.notes}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 w-full mt-4"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Measurement'}
              </button>
            </form>

            {/* Measurements List */}
            <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8">
              <h2 className="text-xl font-bold mb-4">Vorherige Messungen</h2>
              {loading ? (
                <p>Lade...</p>
              ) : (
                <ul>
                  {measurements.map((measurement) => (
                    <li key={measurement.measurement_id} className="mb-4">
                      <p>Datum: {new Date(measurement.measurement_date).toLocaleDateString('de-DE')}</p>
                      <p>Brustumfang: {measurement.chest} cm</p>
                      <p>Taille: {measurement.waist} cm</p>
                      <p>Hüfte: {measurement.hips} cm</p>
                      <p>Körperfettanteil: {measurement.body_fat_percentage} %</p>
                      <p>Notizen: {measurement.notes}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Body;