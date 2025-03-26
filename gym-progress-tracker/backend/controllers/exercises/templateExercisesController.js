const getTemplateExercises = async (req, res) => {
    const pool = req.app.get('db');
    const { template_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM template_exercises WHERE template_id = $1 ORDER BY position ASC`,
            [template_id]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Fehler beim Abrufen der Template-Übungen:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Template-Übungen' });
    }
};

const addTemplateExercise = async (req, res) => {
    const pool = req.app.get('db');
    const {
        template_id,
        exercise_id,
        position,
        sets,
        reps,
        rest_seconds,
        notes
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO template_exercises (template_id, exercise_id, position, sets, reps, rest_seconds, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [template_id, exercise_id, position, sets, reps, rest_seconds, notes]
        );

        res.status(201).json({
            message: 'Template-Übung erfolgreich hinzugefügt',
            templateExercise: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Hinzufügen der Template-Übung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Hinzufügen der Template-Übung' });
    }
};

const deleteTemplateExercise = async (req, res) => {
    const pool = req.app.get('db');
    const { template_exercise_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM template_exercises WHERE template_exercise_id = $1 RETURNING template_exercise_id`,
            [template_exercise_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Template-Übung nicht gefunden' });
        }

        res.status(200).json({
            message: 'Template-Übung erfolgreich gelöscht',
            template_exercise_id: result.rows[0].template_exercise_id
        });
    } catch (err) {
        console.error('Fehler beim Löschen der Template-Übung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Löschen der Template-Übung' });
    }
};

module.exports = { getTemplateExercises, addTemplateExercise, deleteTemplateExercise };