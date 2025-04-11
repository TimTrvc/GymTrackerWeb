import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from '@headlessui/react';
import { Link } from "react-router";
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';

/**
 * Dropdown-Komponente für Navigationsmenüs
 * 
 * SOLID-Prinzipien:
 * - Single Responsibility: Fokussiert nur auf Dropdown-Funktionalität
 * - Open/Closed: Erweiterbar für verschiedene Arten von Dropdown-Inhalten
 * 
 * KISS: Klare, fokussierte Komponente
 * DRY: Wiederverwendbare Animationen und Layout-Strukturen
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.dropdown_title - Titel des Dropdown-Menüs
 * @param {Array} props.dropdown_items - Array von Dropdown-Elementen
 * @param {string} [props.position='bottom'] - Position des Dropdowns (bottom, left, right)
 */
const Dropdown = ({ dropdown_title, dropdown_items, position = 'bottom' }) => {
    // Animationsvarianten - extrahiert nach DRY-Prinzip
    const animations = {
        chevron: {
            initial: { rotate: 0 },
            open: { rotate: 180 },
            transition: { duration: 0.2 }
        },
        panel: {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            transition: { duration: 0.2 }
        },
        container: {
            initial: { scale: 0.95 },
            animate: { scale: 1 },
            exit: { scale: 0.95 },
            transition: { duration: 0.2 }
        },
        item: {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            // Der Delay wird dynamisch für jedes Element angepasst
        }
    };

    // Positionierungslogik - erleichtert die Erweiterung (Open/Closed Principle)
    const getPositionClasses = () => {
        const positions = {
            bottom: 'left-1/2 -translate-x-1/2 mt-5',
            left: 'right-full mr-5 top-0',
            right: 'left-full ml-5 top-0'
        };
        
        return positions[position] || positions.bottom;
    };

    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button className="inline-flex items-center gap-x-1 text-m font-semibold text-white-900 focus:outline-none hover:text-gray-200 transition-colors"
                                    aria-label={`${dropdown_title} Menü öffnen`}>
                        <span>{dropdown_title}</span>
                        <motion.div
                            animate={open ? { rotate: 180 } : { rotate: 0 }}
                            transition={animations.chevron.transition}
                        >
                            <ChevronDownIcon aria-hidden="true" className="size-5" />
                        </motion.div>
                    </Popover.Button>

                    <Popover.Panel>
                        {({ close }) => (
                            <motion.div
                                initial={animations.panel.initial}
                                animate={animations.panel.animate}
                                exit={animations.panel.exit}
                                transition={animations.panel.transition}
                                className={`absolute z-10 flex w-screen max-w-max px-4 ${getPositionClasses()}`}
                            >
                                <motion.div
                                    initial={animations.container.initial}
                                    animate={animations.container.animate}
                                    exit={animations.container.exit}
                                    transition={animations.container.transition}
                                    className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 ring-1 shadow-lg ring-gray-900/5"
                                >
                                    <div className="p-4">
                                        {dropdown_items.map((item, index) => (
                                            <DropdownItem 
                                                key={item.name || index}
                                                item={item}
                                                index={index}
                                                onSelect={close}
                                                animations={animations}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </Popover.Panel>
                </>
            )}
        </Popover>
    );
};

/**
 * Einzelnes Dropdown-Element
 * Extrahiert als separate Komponente (Single Responsibility)
 */
const DropdownItem = ({ item, index, onSelect, animations }) => (
    <motion.div
        initial={animations.item.initial}
        animate={animations.item.animate}
        transition={{ duration: 0.2, delay: index * 0.05 }}
        className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50"
        onClick={onSelect}
    >
        {item.icon && (
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white"
            >
                <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
            </motion.div>
        )}
        <div>
            <Link 
                to={item.href} 
                className="font-semibold text-gray-900"
                aria-label={`Zu ${item.name} navigieren`}
            >
                {item.name}
                <span className="absolute inset-0" />
            </Link>
            {item.description && (
                <p className="mt-1 text-gray-600">{item.description}</p>
            )}
        </div>
    </motion.div>
);

// PropTypes für bessere Typsicherheit und Entwicklerfreundlichkeit
Dropdown.propTypes = {
    dropdown_title: PropTypes.string.isRequired,
    dropdown_items: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
            href: PropTypes.string.isRequired,
            icon: PropTypes.elementType
        })
    ).isRequired,
    position: PropTypes.oneOf(['bottom', 'left', 'right'])
};

// PropTypes für die DropdownItem-Komponente
DropdownItem.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        href: PropTypes.string.isRequired,
        icon: PropTypes.elementType
    }).isRequired,
    index: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    animations: PropTypes.object.isRequired
};

export default Dropdown;