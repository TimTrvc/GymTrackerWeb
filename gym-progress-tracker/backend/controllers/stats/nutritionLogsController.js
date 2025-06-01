/**
 * Retrieves all nutrition logs for the authenticated user.
 * @param {object} req - Express request object containing user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during nutrition log retrieval.
 */
const getNutritionLogs = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;

    try {
        const result = await pool.query(
            `SELECT * FROM nutrition_logs WHERE user_id = $1 ORDER BY log_date DESC`,
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving nutrition logs:', err);
        res.status(500).json({ error: 'Server error retrieving nutrition logs' });
    }
};

/**
 * Adds a new nutrition log for the authenticated user.
 * @param {object} req - Express request object containing nutrition log details in body and user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during nutrition log creation.
 */
const addNutritionLog = async (req, res) => {
    const pool = req.app.get('db');
    const user_id = req.users.id;

    try {
        const {
            meal_type,
            calories,
            protein_grams,
            carbs_grams,
            fat_grams,
            notes,
            log_date,
        } = req.body;

        const logDate = log_date || new Date().toISOString().split('T')[0];

        const newLog = await pool.query(
            `INSERT INTO nutrition_logs (user_id, log_date, meal_type, calories, protein_grams, carbs_grams, fat_grams, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [user_id, logDate, meal_type, calories, protein_grams, carbs_grams, fat_grams, notes]
        );

        res.status(201).json(newLog.rows[0]);
    } catch (error) {
        console.error('Error adding nutrition log:', error);
        res.status(500).json({ error: 'Failed to add nutrition log' });
    }
};

/**
 * Deletes a nutrition log by its ID.
 * @param {object} req - Express request object containing nutrition_log_id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If the nutrition log is not found or a server error occurs during deletion.
 */
const deleteNutritionLog = async (req, res) => {
    const pool = req.app.get('db');
    const { nutrition_log_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM nutrition_logs WHERE nutrition_log_id = $1 RETURNING nutrition_log_id`,
            [nutrition_log_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nutrition log not found' });
        }

        res.status(200).json({
            message: 'Nutrition log deleted successfully',
            nutrition_log_id: result.rows[0].nutrition_log_id
        });
    } catch (err) {
        console.error('Error deleting nutrition log:', err);
        res.status(500).json({ error: 'Server error deleting nutrition log' });
    }
};

/**
 * Exports nutrition log controller functions.
 */
module.exports = { getNutritionLogs, addNutritionLog, deleteNutritionLog };