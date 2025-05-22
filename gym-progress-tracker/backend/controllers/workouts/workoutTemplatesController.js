const addWorkout = async (req, res) => {
    const pool = req.app.get('db');
    const { name, description, difficulty_level, target_audience, goal, estimated_duration_minutes, is_featured } = req.body;
    const created_by = req.users.id;  // Von der Auth-Middleware bereitgestellt

    try {
        // Workout in Datenbank einfügen
        const result = await pool.query(
            `INSERT INTO workout_templates (name, description, difficulty_level, target_audience, goal, 
      estimated_duration_minutes, created_by, is_featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING template_id, name, created_by`,
            [name, description, difficulty_level, target_audience, goal,
                estimated_duration_minutes, created_by, is_featured]
        );

        // Rest des Codes
    } catch (err) {
        console.error('Fehler bei der Workouterstellung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler bei der Workouterstellung' });
    }
};

const getWorkouts = async (req, res) => {
    const pool = req.app.get('db');
    const user_id = req.users.id;

    try {
        const result = await pool.query(
            'SELECT * FROM workout_templates WHERE created_by = $1', [user_id]
        );
        res.json({
            workouts: result.rows
        });
    } catch (err) {
        console.error('Fehler bei der Workoutabfrage:', err);
        return res.status(500).json({ error: 'Serverseiten-Fehler bei der Workoutabfrage' });
    }
}

const getWorkoutById = async (req, res) => {
    const pool = req.app.get('db');
    const user_id = req.users.id;
    const workout_id = req.params.workout_template_id; // Nehme die ID aus den URL-Parametern

    try {
        // Sichere Parameterized Query mit Bedingung:
        // Workout gehört dem angemeldeten Benutzer ODER ist featured
        const result = await pool.query(
            'SELECT * FROM workout_templates WHERE template_id = $1 AND (created_by = $2 OR is_featured = true)',
            [workout_id, user_id]
        );

        // Prüfen, ob ein Workout gefunden wurde
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Workout nicht gefunden oder Sie haben keine Berechtigung darauf zuzugreifen' });
        }

        // Nur das einzelne Workout zurückgeben (rows[0] statt des ganzen result-Objekts)
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Fehler bei der Workoutabfrage:', err);
        return res.status(500).json({ error: 'Serverseiten-Fehler bei der Workoutabfrage' });
    }
};

// Für workoutController.js
const editWorkout = async (req, res) => {
    const pool = req.app.get('db');
    const { workout_id, name, description, difficulty_level, target_audience, goal, estimated_duration_minutes, is_featured } = req.body;
    const modified_by = req.user.id;  // Von der Auth-Middleware bereitgestellt

    try {
        // Workout in Datenbank aktualisieren
        const result = await pool.query(
            `UPDATE workout_templates 
             SET name = $1, description = $2, difficulty_level = $3, 
                 target_audience = $4, goal = $5, estimated_duration_minutes = $6, 
                 is_featured = $7, modified_at = CURRENT_TIMESTAMP, modified_by = $8
             WHERE workout_id = $9
             RETURNING workout_id, name`,
            [name, description, difficulty_level, target_audience, goal,
                estimated_duration_minutes, is_featured, modified_by, workout_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Workout nicht gefunden' });
        }

        res.status(200).json({
            message: 'Workout erfolgreich aktualisiert',
            workout: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler bei der Workout-Aktualisierung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler bei der Workout-Aktualisierung' });
    }
};

const removeWorkout = async (req, res) => {
    const pool = req.app.get('db');
    const { workout_id } = req.query; // Bei GET-Anfragen kommen Parameter aus query
    // const { workout_id } = req.body; // Bei DELETE-Anfragen mit Body

    try {
        const result = await pool.query(
            `DELETE FROM workout_templates 
             WHERE workout_id = $1
             RETURNING workout_id`,
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
module.exports = { addWorkout, getWorkouts, getWorkoutById, editWorkout, removeWorkout };
