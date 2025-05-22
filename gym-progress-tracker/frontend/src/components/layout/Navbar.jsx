import React, { useContext, useState } from 'react';
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
import { FaChartLine } from "react-icons/fa";

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
    {
      name: 'Statistiken',
      description: 'Analysiere deinen Trainingsfortschritt und persönliche Rekorde!',
      href: '/statistics',
      icon: FaChartLine
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Hamburger button for mobile
  const HamburgerButton = () => (
    <button
      className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
      aria-label="Menü öffnen"
      onClick={() => setMobileMenuOpen((open) => !open)}
    >
      <span className={`block h-0.5 w-6 bg-white transition-all duration-300 mb-1 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
      <span className={`block h-0.5 w-6 bg-white transition-all duration-300 mb-1 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
      <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
    </button>
  );

  // Event-Handler in eigenständige Funktion extrahiert (Single Responsibility)
  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  // UI-Komponenten nach Funktionalität getrennt (Single Responsibility)
  const Logo = () => (
    <Link to="/" className="text-2xl font-bold text-white flex items-center" aria-label="Zur Startseite">
      <span className="mr-2" role="img" aria-label="Muskel-Emoji">💪</span> MuscleQuest
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

        {/* Hamburger for mobile */}
        <div className="flex md:hidden">
          <HamburgerButton />
        </div>

        {/* Right: Navigation Items (desktop) */}
        <div className="hidden md:flex items-center space-x-12">
          {isAuthenticated ? <AuthenticatedNav /> : <UnauthenticatedNav />}
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
      )}
      <div
        className={`md:hidden fixed top-0 right-0 z-50 w-3/4 max-w-xs h-full bg-indigo-700 shadow-lg transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ minWidth: '220px' }}
      >
        <div className="flex flex-col h-full p-6 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <Logo />
            <button
              className="text-white focus:outline-none text-2xl"
              aria-label="Menü schließen"
              onClick={() => setMobileMenuOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="flex flex-col space-y-6">
            {isAuthenticated ? <AuthenticatedNav /> : <UnauthenticatedNav />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;