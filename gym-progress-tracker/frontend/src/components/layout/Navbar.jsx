import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { AuthContext } from '../../context/AuthContext';
import Dropdown from "@/components/layout/Dropdown.jsx";

// Icons importieren
import { FaDumbbell } from "react-icons/fa6";
import { MdSportsGymnastics } from "react-icons/md";
import { PiBowlFoodFill } from "react-icons/pi";
import { RiBodyScanFill } from "react-icons/ri";
import { UserCircleIcon } from '@heroicons/react/24/outline';

/**
 * Navigationsdaten - ausgelagert nach SOLID (Single Responsibility)
 * Erleichtert Erweiterungen/Änderungen ohne den Hauptkomponentencode zu ändern (Open/Closed)
 */
const NAVIGATION_DATA = {
  training: [
    { 
      name: 'Übungen', 
      description: 'Schaue dir hier die Übungen an und füge deine eigenen hinzu!', 
      href: '/exercises', 
      icon: FaDumbbell 
    },
    { 
      name: 'Workouts', 
      description: 'Schaue dir hier die Workouts an und füge deine eigenen hinzu!', 
      href: '/workouts', 
      icon: MdSportsGymnastics 
    },
  ],
  body: [
    { 
      name: 'Ernährung', 
      description: 'Tracke hier deine Ernährung für den maximalen Trainigserfolg!', 
      href: '/nutrition', 
      icon: PiBowlFoodFill 
    },
    { 
      name: 'Körpermaße', 
      description: 'Tracke hier deine Maße um deinen Erfolg zu verfolgen!', 
      href: '/body', 
      icon: RiBodyScanFill 
    },
  ]
};

/**
 * Navbar-Komponente für die Hauptnavigation der Anwendung
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Fokussiert nur auf Navigation
 * - Open/Closed: Erweiterbar für weitere Menüpunkte ohne Kernlogik-Änderungen
 * 
 * KISS: Klare, einfache Struktur mit ausgelagerten Unterkomponenten
 * DRY: Wiederverwendung von Komponenten für ähnliche UI-Elemente
 */
const Navbar = () => {
  const { isAuthenticated, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Event-Handler in eigenständige Funktion extrahiert (Single Responsibility)
  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  // UI-Komponenten nach Funktionalität getrennt (Single Responsibility)
  const Logo = () => (
    <Link to="/" className="text-2xl font-bold text-white flex items-center" aria-label="Zur Startseite">
      <span className="mr-2" role="img" aria-label="Muskel-Emoji">💪</span> GymTrack
    </Link>
  );

  // Authentizierten Bereich als eigene Komponente (Single Responsibility)
  const AuthenticatedNav = () => (
    <>
      <Dropdown dropdown_title="Training" dropdown_items={NAVIGATION_DATA.training} />
      <Dropdown dropdown_title="Körper" dropdown_items={NAVIGATION_DATA.body} />
      <Link 
        to="/avatar" 
        className="inline-flex items-center gap-x-1 text-m font-semibold text-white-900 focus:outline-none hover:text-gray-200 transition-colors"
        aria-label="Avatar anpassen"
      >
        Avatar
      </Link>
      <Link 
        to="/profile"
        className="inline-flex items-center text-white hover:text-gray-200 transition-colors"
        aria-label="Zum Profil"
      >
        <UserCircleIcon className="h-8 w-8" />
      </Link>
      <button
        onClick={handleLogout}
        className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
        aria-label="Abmelden"
      >
        Logout
      </button>
    </>
  );

  // Nicht authentifizierten Bereich als eigene Komponente (Single Responsibility)
  const UnauthenticatedNav = () => (
    <Link
      to="/login"
      className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
      aria-label="Zum Login"
    >
      Login
    </Link>
  );

  return (
    <nav className="bg-indigo-600 text-white shadow-lg overflow-visible" aria-label="Hauptnavigation">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
          <Logo />
        </div>

        {/* Right: Navigation Items */}
        <div className="flex items-center space-x-12">
          {isAuthenticated ? <AuthenticatedNav /> : <UnauthenticatedNav />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;