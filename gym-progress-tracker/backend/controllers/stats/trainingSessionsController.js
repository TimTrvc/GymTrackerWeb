/**
 * Retrieves all training sessions for the authenticated user.
 * @param {object} req - Express request object containing user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during training session retrieval.
 */
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
        console.error('Error retrieving training sessions:', err);
        res.status(500).json({ error: 'Server error retrieving training sessions' });
    }
};

/**
 * Adds a new training session for the authenticated user.
 * @param {object} req - Express request object containing training session details in body and user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during training session creation.
 */
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
            message: 'Training session added successfully',
            trainingSession: result.rows[0]
        });
    } catch (err) {
        console.error('Error adding training session:', err);
        res.status(500).json({ error: 'Server error adding training session' });
    }
};

/**
 * Deletes a training session by its ID.
 * @param {object} req - Express request object containing session_id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If the training session is not found or a server error occurs during deletion.
 */
const deleteTrainingSession = async (req, res) => {
    const pool = req.app.get('db');
    const { session_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM training_sessions WHERE session_id = $1 RETURNING session_id`,
            [session_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Training session not found' });
        }

        res.status(200).json({
            message: 'Training session deleted successfully',
            session_id: result.rows[0].session_id
        });
    } catch (err) {
        console.error('Error deleting training session:', err);
        res.status(500).json({ error: 'Server error deleting training session' });
    }
};

/**
 * Exports training session controller functions.
 */
module.exports = { getTrainingSessions, addTrainingSession, deleteTrainingSession };