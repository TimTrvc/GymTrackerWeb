const getExercisePerformances = async (req, res) => {
    const pool = req.app.get('db');
    const { session_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM exercise_performances WHERE session_id = $1 ORDER BY set_number ASC`,
            [session_id]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Fehler beim Abrufen der Übungsleistungen:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Übungsleistungen' });
    }
};

const addExercisePerformance = async (req, res) => {
    const pool = req.app.get('db');
    const {
        session_id,
        exercise_id,
        set_number,
        reps,
        weight,
        is_warmup,
        is_dropset,
        is_failure,
        rpe,
        notes
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO exercise_performances (session_id, exercise_id, set_number, reps, weight, is_warmup, is_dropset, is_failure, rpe, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [session_id, exercise_id, set_number, reps, weight, is_warmup, is_dropset, is_failure, rpe, notes]
        );

        res.status(201).json({
            message: 'Übungsleistung erfolgreich hinzugefügt',
            performance: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Hinzufügen der Übungsleistung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Hinzufügen der Übungsleistung' });
    }
};

const deleteExercisePerformance = async (req, res) => {
    const pool = req.app.get('db');
    const { performance_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM exercise_performances WHERE performance_id = $1 RETURNING performance_id`,
            [performance_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Übungsleistung nicht gefunden' });
        }

        res.status(200).json({
            message: 'Übungsleistung erfolgreich gelöscht',
            performance_id: result.rows[0].performance_id
        });
    } catch (err) {
        console.error('Fehler beim Löschen der Übungsleistung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Löschen der Übungsleistung' });
    }
};

module.exports = { getExercisePerformances, addExercisePerformance, deleteExercisePerformance };