import React, { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router";
import { AuthContext } from '@/context/AuthContext';
import PropTypes from 'prop-types';

/**
 * Footer-Komponente für die gesamte Anwendung
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Komponenten in logische Abschnitte aufgeteilt
 * - Open/Closed: Erweiterbar für zusätzliche Abschnitte und Funktionen
 * 
 * KISS: Klare, fokussierte Komponenten mit expliziten Aufgaben
 * DRY: Wiederverwendbare UI-Komponenten und gemeinsame Styling-Logik
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.apiBaseUrl - API-Basis-URL für Newsletter-Anmeldungen
 */
const Footer = ({ apiBaseUrl = 'http://localhost:5000/api' }) => {
  // State-Verwaltung für Newsletter-Anmeldung
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' oder 'error'
  const { isAuthenticated, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  /**
   * Validiert eine E-Mail-Adresse
   * Extrahiert in eine separate Funktion (SRP - Single Responsibility)
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Behandelt die Newsletter-Anmeldung
   * Extrahiert in eine separate Funktion (SRP)
   */
  const handleSubscribe = async () => {
    // Validierung
    if (!email.trim() || !isValidEmail(email)) {
      setMessage('Bitte gib eine gültige E-Mail-Adresse ein.');
      setMessageType('error');
      return;
    }
  
    try {
      const response = await fetch(`${apiBaseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        setMessage('Erfolgreich abonniert! Vielen Dank für dein Interesse.');
        setMessageType('success');
        setEmail(''); // Eingabefeld leeren
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Fehler beim Abonnieren.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Fehler beim Abonnieren:', error);
      setMessage('Serverfehler. Bitte versuche es später erneut.');
      setMessageType('error');
    }
  };

  // Extrahierte Footer-Komponenten für bessere Lesbarkeit (SRP)
  
  /**
   * Info-Bereich des Footers
   */
  const InfoSection = () => (
    <div>
      <h4 className="text-xl font-bold mb-4">GymTrack</h4>
      <p className="text-gray-400">Dein persönlicher Fitness-Tracker für optimale Erfolge im Gym.</p>
    </div>
  );

  /**
   * Link-Bereich des Footers
   */
  const LinksSection = () => {
    // Datenstruktur für Links - erleichtert Erweiterungen (Open/Closed)
    const links = [
      { name: 'Home', to: '/' },
      { name: 'Features', to: '/features' },
      { name: 'Preise', to: '/prices' },
      { name: 'Kontakt', to: '/contact' },
      { name: 'Datenschutz', to: '/privacy' }
    ];

    return (
      <div>
        <h4 className="text-xl font-bold mb-4">Links</h4>
        <ul className="space-y-2">
          {links.map(link => (
            <li key={link.name}>
              <Link 
                to={link.to} 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={`Zu ${link.name} navigieren`}
              >
                {link.name}
              </Link>
            </li>
          ))}
          {isAuthenticated && (
            <li>
              <a 
                onClick={handleLogout} 
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Abmelden"
              >
                Logout
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  };

  /**
   * Newsletter-Anmeldung
   */
  const NewsletterSection = () => (
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
          aria-label="E-Mail-Adresse für Newsletter"
        />
        <button
          onClick={handleSubscribe}
          className="bg-indigo-600 py-2 px-4 rounded-r hover:bg-indigo-700 transition-colors"
          aria-label="Newsletter abonnieren"
        >
          Abonnieren
        </button>
      </div>
      {message && (
        <p className={`text-sm ${messageType === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  );

  /**
   * Copyright-Bereich
   */
  const CopyrightSection = () => (
    <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
      <p>&copy; {new Date().getFullYear()} GymTrack. Alle Rechte vorbehalten.</p>
    </div>
  );

  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InfoSection />
          <LinksSection />
          <NewsletterSection />
        </div>
        <CopyrightSection />
      </div>
    </footer>
  );
};

// PropTypes für bessere Typsicherheit und Dokumentation
Footer.propTypes = {
  apiBaseUrl: PropTypes.string
};

export default Footer;