/**
 * Retrieves all activity statistics for the authenticated user.
 * @param {object} req - Express request object containing user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during activity stats retrieval.
 */
const getActivityStats = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;

    try {
        const result = await pool.query(
            `SELECT * FROM activity_stats WHERE user_id = $1 ORDER BY stat_date DESC`,
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving activity stats:', err);
        res.status(500).json({ error: 'Server error retrieving activity stats' });
    }
};

/**
 * Adds a new activity statistic for the authenticated user.
 * @param {object} req - Express request object containing activity stats details in body and user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during activity stat creation.
 */
const addActivityStat = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const {
        stat_date,
        total_workouts,
        total_exercises,
        total_sets,
        total_reps,
        total_weight,
        total_duration_minutes
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO activity_stats (user_id, stat_date, total_workouts, total_exercises, total_sets, total_reps, total_weight, total_duration_minutes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [userId, stat_date, total_workouts, total_exercises, total_sets, total_reps, total_weight, total_duration_minutes]
        );

        res.status(201).json({
            message: 'Activity stat added successfully',
            stat: result.rows[0]
        });
    } catch (err) {
        console.error('Error adding activity stat:', err);
        res.status(500).json({ error: 'Server error adding activity stat' });
    }
};

/**
 * Deletes an activity statistic by its ID.
 * @param {object} req - Express request object containing stat_id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If the activity stat is not found or a server error occurs during deletion.
 */
const deleteActivityStat = async (req, res) => {
    const pool = req.app.get('db');
    const { stat_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM activity_stats WHERE stat_id = $1 RETURNING stat_id`,
            [stat_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Activity stat not found' });
        }

        res.status(200).json({
            message: 'Activity stat deleted successfully',
            stat_id: result.rows[0].stat_id
        });
    } catch (err) {
        console.error('Error deleting activity stat:', err);
        res.status(500).json({ error: 'Server error deleting activity stat' });
    }
};

/**
 * Exports activity stats controller functions.
 */
module.exports = { getActivityStats, addActivityStat, deleteActivityStat };