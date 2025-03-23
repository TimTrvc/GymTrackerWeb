const addWorkout = async (req, res) => {
    const pool = req.app.get('db');
    const { name, description, difficulty_level, target_audience, goal, estimated_duration_minutes, is_featured } = req.body;
    const created_by = req.user.id;  // Von der Auth-Middleware bereitgestellt

    try {
        // Workout in Datenbank einfügen
        const result = await pool.query(
            `INSERT INTO workouts (name, description, difficulty_level, target_audience, goal, 
      estimated_duration_minutes, created_by, is_featured, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP) 
      RETURNING workout_id, name, created_by`,
            [name, description, difficulty_level, target_audience, goal,
                estimated_duration_minutes, created_by, is_featured]
        );

        // Rest des Codes
    } catch (err) {
        console.error('Fehler bei der Workouterstellung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler bei der Workouterstellung' });
    }
};

const editWorkout = async (req, res) => {

}

const removeWorkout = async (req, res) => {

}