/**
 * Retrieves all workouts for the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getWorkouts = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    try {
        const result = await pool.query(
            `SELECT * FROM workouts WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        res.status(200).json({ workouts: result.rows });
    } catch (err) {
        console.error('Error retrieving workouts:', err);
        res.status(500).json({ error: 'Server error while retrieving workouts.' });
    }
};

/**
 * Adds a new workout and its exercises for the authenticated user.
 * Uses a transaction to ensure atomicity.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const addWorkout = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const {
        name,
        description,
        duration_minutes,
        difficulty_level,
        is_public,
        exercises
    } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const workoutResult = await client.query(
            `INSERT INTO workouts (user_id, name, description, duration_minutes, difficulty_level, is_public)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [userId, name, description, duration_minutes, difficulty_level, is_public]
        );
        const newWorkout = workoutResult.rows[0];
        const workoutId = newWorkout.workout_id;
        if (exercises && exercises.length > 0) {
            for (const exercise of exercises) {
                await client.query(
                    `INSERT INTO workout_exercises (
                        workout_id, 
                        exercise_id, 
                        position, 
                        sets, 
                        reps, 
                        rest_seconds
                    ) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        workoutId,
                        exercise.exercise_id,
                        exercise.position,
                        exercise.sets,
                        exercise.reps,
                        exercise.rest_seconds
                    ]
                );
            }
        }
        await client.query('COMMIT');
        res.status(201).json({
            message: 'Workout added successfully',
            workout: newWorkout
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error adding workout:', err);
        res.status(500).json({ error: 'Server error while adding workout.' });
    } finally {
        client.release();
    }
};

/**
 * Updates an existing workout by its ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
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
            return res.status(404).json({ error: 'Workout not found' });
        }
        res.status(200).json({
            message: 'Workout updated successfully',
            workout: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating workout:', err);
        res.status(500).json({ error: 'Server error while updating workout.' });
    }
};

/**
 * Deletes a workout by its ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const deleteWorkout = async (req, res) => {
    const pool = req.app.get('db');
    const { workout_id } = req.params;
    try {
        const result = await pool.query(
            `DELETE FROM workouts WHERE workout_id = $1 RETURNING workout_id`,
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
        res.status(500).json({ error: 'Server error while deleting workout.' });
    }
};

module.exports = { getWorkouts, addWorkout, updateWorkout, deleteWorkout };