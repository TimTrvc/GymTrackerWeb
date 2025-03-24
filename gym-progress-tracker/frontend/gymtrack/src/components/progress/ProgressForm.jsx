import React, { useState } from 'react';

const exercises = [
  'Bankdrücken', 'Kniebeugen', 'Kreuzheben', 'Schulterdrücken',
  'Klimmzüge', 'Bizeps Curls', 'Trizeps Extensions', 'Beinpresse'
];

const ProgressForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    exercise: '',
    reps: '',
    weight: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const result = await onSubmit({
        date: formData.date,
        exercise: formData.exercise,
        reps: parseInt(formData.reps),
        weight: parseInt(formData.weight)
      });

      if (result.success) {
        setMessage({ text: 'Fortschritt erfolgreich hinzugefügt!', type: 'success' });
        setFormData({
          date: new Date().toISOString().split('T')[0],
          exercise: '',
          reps: '',
          weight: ''
        });
      } else {
        setMessage({ text: result.error || 'Fehler beim Hinzufügen des Fortschritts', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Ein unerwarteter Fehler ist aufgetreten', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-gray-700 mb-2">
            Datum:
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="exercise" className="block text-gray-700 mb-2">
            Übung:
          </label>
          <input
            type="text"
            id="exercise"
            list="exercise-list"
            value={formData.exercise}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <datalist id="exercise-list">
            {exercises.map((exercise, index) => (
              <option key={index} value={exercise} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="reps" className="block text-gray-700 mb-2">
            Wiederholungen:
          </label>
          <input
            type="number"
            id="reps"
            value={formData.reps}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="weight" className="block text-gray-700 mb-2">
            Gewicht (kg):
          </label>
          <input
            type="number"
            id="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className={`bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition w-full md:w-auto ${
              submitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Wird hinzugefügt...' : 'Fortschritt hinzufügen'}
          </button>
        </div>
      </form>
    </>
  );
};

export default ProgressForm;
