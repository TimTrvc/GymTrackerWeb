/**
 * Retrieves all weight logs for the authenticated user.
 * @param {object} req - Express request object containing user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during weight log retrieval.
 */
const getUserWeightLogs = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;

    try {
        const result = await pool.query(
            `SELECT * FROM user_weight_logs WHERE user_id = $1 ORDER BY logged_date DESC`,
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving weight logs:', err);
        res.status(500).json({ error: 'Server error retrieving weight logs' });
    }
};

/**
 * Adds a new weight log for the authenticated user.
 * @param {object} req - Express request object containing weight log details in body and user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during weight log creation.
 */
const addUserWeightLog = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const { weight, logged_date, notes } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO user_weight_logs (user_id, weight, logged_date, notes)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, weight, logged_date, notes]
        );

        res.status(201).json({
            message: 'Weight log added successfully',
            weightLog: result.rows[0]
        });
    } catch (err) {
        console.error('Error adding weight log:', err);
        res.status(500).json({ error: 'Server error adding weight log' });
    }
};

/**
 * Deletes a weight log by its ID.
 * @param {object} req - Express request object containing weight_log_id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If the weight log is not found or a server error occurs during deletion.
 */
const deleteUserWeightLog = async (req, res) => {
    const pool = req.app.get('db');
    const { weight_log_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM user_weight_logs WHERE weight_log_id = $1 RETURNING weight_log_id`,
            [weight_log_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Weight log not found' });
        }

        res.status(200).json({
            message: 'Weight log deleted successfully',
            weight_log_id: result.rows[0].weight_log_id
        });
    } catch (err) {
        console.error('Error deleting weight log:', err);
        res.status(500).json({ error: 'Server error deleting weight log' });
    }
};

/**
 * Exports user weight log controller functions.
 */
module.exports = { getUserWeightLogs, addUserWeightLog, deleteUserWeightLog };