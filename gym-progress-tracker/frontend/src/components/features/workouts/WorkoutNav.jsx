import React from "react";
import PropTypes from 'prop-types';

/**
 * WorkoutNav-Komponente für die Navigation zwischen Workout-Ansichten
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Fokussiert nur auf Tab-Navigation
 * - Open/Closed: Erweiterbar für verschiedene Tab-Konfigurationen
 * 
 * KISS: Einfache, klare Implementierung
 * DRY: Wiederverwendung von Tab-Rendering-Logik
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.activeTab - Aktuell aktiver Tab
 * @param {Function} props.handleTabClick - Callback für Tab-Klicks
 * @param {Array} props.tabs - Optional: Benutzerdefinierte Tab-Konfiguration
 */
const WorkoutNav = ({ 
  activeTab, 
  handleTabClick,
  tabs = [
    { id: 'create', label: 'Workout erstellen' },
    { id: 'view', label: 'Meine Workouts' },
    { id: 'edit', label: 'Workout bearbeiten' }
  ]
}) => {
  // Hilfsfunktion zur Bestimmung der Tab-Klassen (DRY-Prinzip)
  const getTabClasses = (tabId) => {
    const baseClasses = "py-4 px-1 text-center border-b-2 font-medium";
    const activeClasses = "border-indigo-500 text-indigo-600";
    const inactiveClasses = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";
    
    return `${baseClasses} ${tabId === activeTab ? activeClasses : inactiveClasses}`;
  };

  // Berechnung der Tab-Breite basierend auf Anzahl (flexibler Ansatz)
  const tabWidth = tabs.length > 0 ? `w-1/${tabs.length}` : "w-full";

  return (
    <div className="max-w-3xl mx-auto mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Workout-Navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`${tabWidth} ${getTabClasses(tab.id)}`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

// PropTypes für bessere Typsicherheit und Dokumentation
WorkoutNav.propTypes = {
  activeTab: PropTypes.string.isRequired,
  handleTabClick: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  )
};

export default WorkoutNav;
