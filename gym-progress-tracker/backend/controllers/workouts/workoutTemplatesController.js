/**
 * Adds a new workout template to the database.
 * @param {object} req - Express request object containing workout details in body and user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during workout creation.
 */
const addWorkout = async (req, res) => {
    const pool = req.app.get('db');
    const { name, description, difficulty_level, target_audience, goal, estimated_duration_minutes, is_featured } = req.body;
    const created_by = req.users.id;

    try {
        const result = await pool.query(
            `INSERT INTO workout_templates (name, description, difficulty_level, target_audience, goal, 
      estimated_duration_minutes, created_by, is_featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING template_id, name, created_by`,
            [name, description, difficulty_level, target_audience, goal,
                estimated_duration_minutes, created_by, is_featured]
        );
        // Additional logic can be added here if needed
    } catch (err) {
        console.error('Error creating workout:', err);
        res.status(500).json({ error: 'Server error during workout creation' });
    }
};

/**
 * Retrieves all workout templates created by the authenticated user.
 * @param {object} req - Express request object containing user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during workout retrieval.
 */
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
        console.error('Error retrieving workouts:', err);
        return res.status(500).json({ error: 'Server error during workout retrieval' });
    }
}

/**
 * Retrieves a workout template by its ID if it belongs to the user or is featured.
 * @param {object} req - Express request object containing user info and workout_template_id param.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If the workout is not found or a server error occurs.
 */
const getWorkoutById = async (req, res) => {
    const pool = req.app.get('db');
    const user_id = req.users.id;
    const workout_id = req.params.workout_template_id;

    try {
        // Secure parameterized query: workout must belong to user or be featured
        const result = await pool.query(
            'SELECT * FROM workout_templates WHERE template_id = $1 AND (created_by = $2 OR is_featured = true)',
            [workout_id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Workout not found or you do not have permission to access it' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error retrieving workout:', err);
        return res.status(500).json({ error: 'Server error during workout retrieval' });
    }
};

/**
 * Updates an existing workout template in the database.
 * @param {object} req - Express request object containing workout details in body and user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during workout update.
 */
const editWorkout = async (req, res) => {
    const pool = req.app.get('db');
    const { workout_id, name, description, difficulty_level, target_audience, goal, estimated_duration_minutes, is_featured } = req.body;
    const modified_by = req.user.id;

    try {
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
            return res.status(404).json({ error: 'Workout not found' });
        }

        res.status(200).json({
            message: 'Workout updated successfully',
            workout: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating workout:', err);
        res.status(500).json({ error: 'Server error during workout update' });
    }
};

/**
 * Removes a workout template from the database by its ID.
 * @param {object} req - Express request object containing workout_id in query.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If the workout is not found or a server error occurs during deletion.
 */
const removeWorkout = async (req, res) => {
    const pool = req.app.get('db');
    const { workout_id } = req.query;

    try {
        const result = await pool.query(
            `DELETE FROM workout_templates 
             WHERE workout_id = $1
             RETURNING workout_id`,
            [workout_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        res.status(200).json({
            message: 'Workout deleted successfully',
            workout_id: result.rows[0].workout_id
        });
    } catch (err) {
        console.error('Error deleting workout:', err);
        res.status(500).json({ error: 'Server error during workout deletion' });
    }
};
/**
 * Exports workout template controller functions.
 */
module.exports = { addWorkout, getWorkouts, getWorkoutById, editWorkout, removeWorkout };
