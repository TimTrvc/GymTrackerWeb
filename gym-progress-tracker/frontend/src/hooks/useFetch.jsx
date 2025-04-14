import { useState, useEffect, useCallback } from 'react';

/**
 * Hook zur Verwendung von Services mit Statusmanagement
 * 
 * @param {Function} serviceFunction - Eine Funktion aus einem Service, die ein Promise zurückgibt
 * @param {Array} dependencies - Abhängigkeiten, die den Hook auslösen, wenn sie sich ändern
 * @param {Array} params - Parameter, die an die serviceFunction übergeben werden
 * 
 * @returns {Object} - Objekt mit Daten, Ladezustand, Fehler und Refresh-Funktion
 */
const useService = (serviceFunction, dependencies = [], params = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Funktion zum Abrufen der Daten, kann manuell aufgerufen werden
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Servicefunktion mit den übergebenen Parametern aufrufen
            const result = await serviceFunction(...params);
            setData(result);
            return result;
        } catch (err) {
            console.error('Error in useService:', err);
            setError(err.message || 'Ein Fehler ist aufgetreten');
            return null;
        } finally {
            setLoading(false);
        }
    }, [serviceFunction, ...params]);

    // Effekt zum automatischen Laden beim ersten Rendern oder wenn sich Abhängigkeiten ändern
    useEffect(() => {
        fetchData();
    }, [...dependencies]);

    return { data, loading, error, refetch: fetchData };
};

export default useService;