/**
 * Retrieves all exercises for a given workout.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
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
        console.error('Error retrieving workout exercises:', err);
        res.status(500).json({ error: 'Server error while retrieving workout exercises.' });
    }
};

/**
 * Adds a new exercise to a workout.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
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
            message: 'Workout exercise added successfully',
            workoutExercise: result.rows[0]
        });
    } catch (err) {
        console.error('Error adding workout exercise:', err);
        res.status(500).json({ error: 'Server error while adding workout exercise.' });
    }
};

/**
 * Deletes an exercise from a workout by its ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const deleteWorkoutExercise = async (req, res) => {
    const pool = req.app.get('db');
    const { workout_exercise_id } = req.params;
    try {
        const result = await pool.query(
            `DELETE FROM workout_exercises WHERE workout_exercise_id = $1 RETURNING workout_exercise_id`,
            [workout_exercise_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Workout exercise not found' });
        }
        res.status(200).json({
            message: 'Workout exercise deleted successfully',
            workout_exercise_id: result.rows[0].workout_exercise_id
        });
    } catch (err) {
        console.error('Error deleting workout exercise:', err);
        res.status(500).json({ error: 'Server error while deleting workout exercise.' });
    }
};

module.exports = { getWorkoutExercises, addWorkoutExercise, deleteWorkoutExercise };