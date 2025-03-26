const getWorkoutExercises = async (req, res) => {
    const pool = req.app.get('db');
    const { workout_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM workout_exercises WHERE workout_id = $1 ORDER BY position ASC`,
            [workout_id]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Fehler beim Abrufen der Workout-Übungen:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Workout-Übungen' });
    }
};

const addWorkoutExercise = async (req, res) => {
    const pool = req.app.get('db');
    const {
        workout_id,
        exercise_id,
        position,
        sets,
        reps,
        rest_seconds,
        notes
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO workout_exercises (workout_id, exercise_id, position, sets, reps, rest_seconds, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [workout_id, exercise_id, position, sets, reps, rest_seconds, notes]
        );

        res.status(201).json({
            message: 'Workout-Übung erfolgreich hinzugefügt',
            workoutExercise: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Hinzufügen der Workout-Übung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Hinzufügen der Workout-Übung' });
    }
};

const deleteWorkoutExercise = async (req, res) => {
    const pool = req.app.get('db');
    const { workout_exercise_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM workout_exercises WHERE workout_exercise_id = $1 RETURNING workout_exercise_id`,
            [workout_exercise_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Workout-Übung nicht gefunden' });
        }

        res.status(200).json({
            message: 'Workout-Übung erfolgreich gelöscht',
            workout_exercise_id: result.rows[0].workout_exercise_id
        });
    } catch (err) {
        console.error('Fehler beim Löschen der Workout-Übung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Löschen der Workout-Übung' });
    }
};

module.exports = { getWorkoutExercises, addWorkoutExercise, deleteWorkoutExercise };