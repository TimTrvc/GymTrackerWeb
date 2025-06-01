/**
 * Retrieves all goals for the authenticated user.
 * @param {object} req - Express request object containing user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during goal retrieval.
 */
const getGoals = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;

    try {
        const result = await pool.query(
            `SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving goals:', err);
        res.status(500).json({ error: 'Server error retrieving goals' });
    }
};

/**
 * Adds a new goal for the authenticated user.
 * @param {object} req - Express request object containing goal details in body and user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during goal creation.
 */
const addGoal = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const {
        exercise_id,
        goal_type,
        current_value,
        target_value,
        deadline
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO goals (user_id, exercise_id, goal_type, current_value, target_value, deadline)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [userId, exercise_id, goal_type, current_value, target_value, deadline]
        );

        res.status(201).json({
            message: 'Goal added successfully',
            goal: result.rows[0]
        });
    } catch (err) {
        console.error('Error adding goal:', err);
        res.status(500).json({ error: 'Server error adding goal' });
    }
};

/**
 * Updates an existing goal by its ID.
 * @param {object} req - Express request object containing goal_id in params and update details in body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If the goal is not found or a server error occurs during update.
 */
const updateGoal = async (req, res) => {
    const pool = req.app.get('db');
    const { goal_id } = req.params;
    const {
        current_value,
        achieved_at,
        is_achieved
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE goals
             SET current_value = $1, achieved_at = $2, is_achieved = $3
             WHERE goal_id = $4
             RETURNING *`,
            [current_value, achieved_at, is_achieved, goal_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        res.status(200).json({
            message: 'Goal updated successfully',
            goal: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating goal:', err);
        res.status(500).json({ error: 'Server error updating goal' });
    }
};

/**
 * Deletes a goal by its ID.
 * @param {object} req - Express request object containing goal_id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If the goal is not found or a server error occurs during deletion.
 */
const deleteGoal = async (req, res) => {
    const pool = req.app.get('db');
    const { goal_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM goals WHERE goal_id = $1 RETURNING goal_id`,
            [goal_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        res.status(200).json({
            message: 'Goal deleted successfully',
            goal_id: result.rows[0].goal_id
        });
    } catch (err) {
        console.error('Error deleting goal:', err);
        res.status(500).json({ error: 'Server error deleting goal' });
    }
};

/**
 * Exports goal controller functions.
 */
module.exports = { getGoals, addGoal, updateGoal, deleteGoal };