import React from "react";
import PropTypes from 'prop-types';
import { motion } from "motion/react";

/**
 * Hoverer-Komponente für Hover-Animationseffekte
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Fokussiert nur auf Hover-Animationen
 * - Open/Closed: Erweiterbar für verschiedene Animationstypen und -einstellungen
 * 
 * KISS: Einfache, klare Implementierung mit gezieltem Zweck
 * 
 * @param {Object} props - Komponenten-Props
 * @param {ReactNode} props.children - Kindelemente, die animiert werden sollen
 * @param {number} props.scaleTap - Skalierungswert beim Klicken (0-2)
 * @param {number} props.scaleHover - Skalierungswert beim Hovern (0-2)
 * @param {Object} props.customAnimations - Benutzerdefinierte Animationseinstellungen
 * @param {string} props.className - Zusätzliche CSS-Klassen
 */
const Hoverer = ({ 
    children, 
    scaleTap = 0.9, 
    scaleHover = 1.1,
    customAnimations = {},
    className = ""
}) => {
    // Grundlegende Animationseinstellungen
    const defaultAnimations = {
        whileHover: { scale: scaleHover },
        whileTap: { scale: scaleTap },
        transition: { type: "spring", stiffness: 400, damping: 10 }
    };

    // Kombinieren der Standard- und benutzerdefinierten Animationen
    const animations = {
        ...defaultAnimations,
        ...customAnimations,
        // Deep merge für verschachtelte Objekte
        whileHover: { ...defaultAnimations.whileHover, ...customAnimations.whileHover },
        whileTap: { ...defaultAnimations.whileTap, ...customAnimations.whileTap },
        transition: { ...defaultAnimations.transition, ...customAnimations.transition }
    };

    return (
        <motion.div
            className={className}
            whileHover={animations.whileHover}
            whileTap={animations.whileTap}
            transition={animations.transition}
            {...animations}
        >
            {children}
        </motion.div>
    );
};

// PropTypes für bessere Typsicherheit und Dokumentation
Hoverer.propTypes = {
    children: PropTypes.node.isRequired,
    scaleTap: PropTypes.number,
    scaleHover: PropTypes.number,
    customAnimations: PropTypes.object,
    className: PropTypes.string
};

export default Hoverer;