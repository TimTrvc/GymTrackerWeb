import React, { useState, useEffect } from 'react';
import { getBodyMeasurements, addBodyMeasurement } from '@/services/bodyMeasurementsService';
import HeroSection from '@/components/layout/HeroSection';

const Body = () => {
  const [measurements, setMeasurements] = useState([]);
  const [formData, setFormData] = useState({
    measurement_date: '',
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
      console.log('Response from server:', response);
      // Access the measurement from the response object
      const newMeasurement = response.measurement;
      setMeasurements([newMeasurement, ...measurements]); // Update the state with the correct data
      console.log('New measurement:', newMeasurement);
      setSuccess('Measurement added successfully!');
      setFormData({
        measurement_date: '',
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

  return (
    <>
      <HeroSection title="Körpermaße" subtitle="Verfolge deine Körpermaße und Fortschritte" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Körpermaße</h1>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6">
            <h2 className="text-xl font-bold mb-4">Körpermaße hinzufügen</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

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
      </div>
    </>
  );
};

export default Body;