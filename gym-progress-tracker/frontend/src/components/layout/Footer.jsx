import React, { useState } from 'react';
import { Link } from "react-router";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setMessage('Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        setMessage('Erfolgreich abonniert!');
        setEmail(''); // Clear the input field
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Fehler beim Abonnieren.');
      }
    } catch (error) {
      console.error('Fehler beim Abonnieren:', error);
      setMessage('Serverfehler. Bitte versuche es später erneut.');
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">GymTrack</h4>
            <p className="text-gray-400">Dein persönlicher Fitness-Tracker für optimale Erfolge im Gym.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Links</h4>
            <div><Link to="/" className="text-gray-400">Home</Link></div>
            <div><Link to="/features" className="text-gray-400">Features</Link></div>
            <div><Link to="/prices" className="text-gray-400">Preise</Link></div>
            <div><Link to="/contact" className="text-gray-400">Kontakt</Link></div>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Erhalte Fitness-Tipps und Updates.</p>
            <div className="flex mb-2">
              <input
                type="email"
                placeholder="Deine Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-2 px-4 rounded-l outline-none text-gray-800 flex-grow bg-white"
              />
              <button
                onClick={handleSubscribe}
                className="bg-indigo-600 py-2 px-4 rounded-r hover:bg-indigo-700"
              >
                Abonnieren
              </button>
            </div>
            {message && <p className="text-sm text-gray-400">{message}</p>}
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 GymTrack. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;