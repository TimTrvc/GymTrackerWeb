import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from "react-router";
import { AuthContext } from '@/context/AuthContext';
import { subscribeToNewsletter } from '@/services/emailService';
import PropTypes from 'prop-types';

/**
 * Footer-Komponente für die gesamte Anwendung
 */
const Footer = () => {
  // Nur für Statusmeldungen, nicht für das Input-Feld
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const { isAuthenticated, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  /**
   * Validiert eine E-Mail-Adresse
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Newsletter-Anmeldung
   */
  const NewsletterSection = () => {
    // Formular-Verarbeitung
    const handleSubmit = async (e) => {
      // Verhindert das Neuladen der Seite
      e.preventDefault();
      
      // Formulardaten abrufen
      const formData = new FormData(e.target);
      const formJson = Object.fromEntries(formData.entries());
      const email = formJson.email;
      
      // Validierung
      if (!email.trim() || !isValidEmail(email)) {
        setMessage('Bitte gib eine gültige E-Mail-Adresse ein.');
        setMessageType('error');
        return;
      }
      
      try {
        await subscribeToNewsletter(email);
        setMessage('Erfolgreich abonniert! Vielen Dank für dein Interesse.');
        setMessageType('success');
        // Formular zurücksetzen
        e.target.reset();
      } catch (error) {
        console.error('Fehler beim Abonnieren:', error);
        setMessage(error.message || 'Fehler beim Abonnieren. Bitte versuche es später erneut.');
        setMessageType('error');
      }
    };

    return (
      <div>
        <h4 className="text-xl font-bold mb-4">Newsletter</h4>
        <p className="text-gray-400 mb-4">Erhalte Fitness-Tipps und Updates.</p>
        <form onSubmit={handleSubmit} className="flex mb-2">
          <input
            type="email"
            name="email"
            placeholder="Deine Email"
            defaultValue=""
            className="py-2 px-4 rounded-l outline-none text-gray-800 flex-grow bg-white"
            aria-label="E-Mail-Adresse für Newsletter"
          />
          <button
            type="submit"
            className="bg-indigo-600 py-2 px-4 rounded-r hover:bg-indigo-700 transition-colors"
            aria-label="Newsletter abonnieren"
          >
            Abonnieren
          </button>
        </form>
        {message && (
          <p className={`text-sm ${messageType === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    );
  };

  // Extrahierte Footer-Komponenten für bessere Lesbarkeit (SRP)
  
  /**
   * Info-Bereich des Footers
   */
  const InfoSection = () => (
    <div>
      <h4 className="text-xl font-bold mb-4">MuscleQuest</h4>
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
   * Copyright-Bereich
   */
  const CopyrightSection = () => (
    <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
      <p>&copy; {new Date().getFullYear()} MuscleQuest. Alle Rechte vorbehalten.</p>
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