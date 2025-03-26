const getTrainingSessions = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;

    try {
        const result = await pool.query(
            `SELECT * FROM training_sessions WHERE user_id = $1 ORDER BY session_date DESC`,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Fehler beim Abrufen der Trainingssessions:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Trainingssessions' });
    }
};

const addTrainingSession = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const {
        workout_id,
        session_date,
        duration_minutes,
        calories_burned,
        mood_rating,
        effort_level,
        notes,
        location
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO training_sessions (user_id, workout_id, session_date, duration_minutes, calories_burned, mood_rating, effort_level, notes, location)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [userId, workout_id, session_date, duration_minutes, calories_burned, mood_rating, effort_level, notes, location]
        );

        res.status(201).json({
            message: 'Trainingssession erfolgreich hinzugefügt',
            trainingSession: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Hinzufügen der Trainingssession:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Hinzufügen der Trainingssession' });
    }
};

const deleteTrainingSession = async (req, res) => {
    const pool = req.app.get('db');
    const { session_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM training_sessions WHERE session_id = $1 RETURNING session_id`,
            [session_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Trainingssession nicht gefunden' });
        }

        res.status(200).json({
            message: 'Trainingssession erfolgreich gelöscht',
            session_id: result.rows[0].session_id
        });
    } catch (err) {
        console.error('Fehler beim Löschen der Trainingssession:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Löschen der Trainingssession' });
    }
};

module.exports = { getTrainingSessions, addTrainingSession, deleteTrainingSession };