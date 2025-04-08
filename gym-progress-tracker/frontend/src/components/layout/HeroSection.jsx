import React from 'react';
import PropTypes from 'prop-types';

/**
 * HeroSection-Komponente für prominente Inhaltsabschnitte
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Fokussiert nur auf die Darstellung eines Hero-Bereichs
 * - Open/Closed: Erweiterbar durch verschiedene Props und Stiloptionen
 * 
 * KISS: Einfache, klare Komponente mit gezieltem Zweck
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.title - Haupttitel des Hero-Bereichs
 * @param {string} props.subtitle - Untertitel/Beschreibung des Hero-Bereichs
 * @param {ReactNode} props.button - Button-Element für Call-to-Action
 * @param {string} props.background - Hintergrundfarbe/-klasse (z.B. 'bg-indigo-700')
 * @param {string} props.textColor - Textfarbe (z.B. 'text-white')
 * @param {string} props.align - Textausrichtung ('left', 'center', 'right')
 * @param {string} props.size - Größe des Hero-Bereichs ('small', 'medium', 'large')
 */
const HeroSection = ({ 
    title, 
    subtitle, 
    button,
    background = 'bg-indigo-700',
    textColor = 'text-white',
    align = 'center',
    size = 'medium'
}) => {
  // Größenklassen basierend auf der size-Prop
  const sizeClasses = {
    small: 'py-8',
    medium: 'py-16',
    large: 'py-24'
  };

  // Ausrichtungsklassen basierend auf der align-Prop
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  // Dynamisches Styling basierend auf den Props
  const containerClasses = `${background} ${textColor} ${sizeClasses[size] || sizeClasses.medium}`;
  const contentClasses = `container mx-auto px-4 ${alignClasses[align] || alignClasses.center}`;

  return (
    <section className={containerClasses} aria-labelledby="hero-heading">
      <div className={contentClasses}>
        <h1 id="hero-heading" className="text-4xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-xl mb-8 max-w-3xl mx-auto">{subtitle}</p>}
        {button && <div className="mt-4">{button}</div>}
      </div>
    </section>
  );
};

// PropTypes für bessere Typsicherheit und Dokumentation
HeroSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  button: PropTypes.node,
  background: PropTypes.string,
  textColor: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default HeroSection;
