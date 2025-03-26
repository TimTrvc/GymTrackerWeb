const getWorkouts = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;

    try {
        const result = await pool.query(
            `SELECT * FROM workouts WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Fehler beim Abrufen der Workouts:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Workouts' });
    }
};

const addWorkout = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const {
        name,
        description,
        duration_minutes,
        difficulty_level,
        is_public
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO workouts (user_id, name, description, duration_minutes, difficulty_level, is_public)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [userId, name, description, duration_minutes, difficulty_level, is_public]
        );

        res.status(201).json({
            message: 'Workout erfolgreich hinzugefügt',
            workout: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Hinzufügen des Workouts:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Hinzufügen des Workouts' });
    }
};

const updateWorkout = async (req, res) => {
    const pool = req.app.get('db');
    const { workout_id } = req.params;
    const {
        name,
        description,
        duration_minutes,
        difficulty_level,
        is_public
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE workouts
             SET name = $1, description = $2, duration_minutes = $3, difficulty_level = $4, is_public = $5
             WHERE workout_id = $6
             RETURNING *`,
            [name, description, duration_minutes, difficulty_level, is_public, workout_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Workout nicht gefunden' });
        }

        res.status(200).json({
            message: 'Workout erfolgreich aktualisiert',
            workout: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Aktualisieren des Workouts:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Aktualisieren des Workouts' });
    }
};

const deleteWorkout = async (req, res) => {
    const pool = req.app.get('db');
    const { workout_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM workouts WHERE workout_id = $1 RETURNING workout_id`,
            [workout_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Workout nicht gefunden' });
        }

        res.status(200).json({
            message: 'Workout erfolgreich gelöscht',
            workout_id: result.rows[0].workout_id
        });
    } catch (err) {
        console.error('Fehler beim Löschen des Workouts:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Löschen des Workouts' });
    }
};

module.exports = { getWorkouts, addWorkout, updateWorkout, deleteWorkout };