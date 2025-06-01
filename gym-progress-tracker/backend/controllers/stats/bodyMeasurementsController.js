/**
 * Retrieves all body measurements for the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getBodyMeasurements = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    try {
        const result = await pool.query(
            `SELECT * FROM body_measurements WHERE user_id = $1 ORDER BY measurement_date DESC`,
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching body measurements:', err);
        res.status(500).json({ error: 'Server error while fetching body measurements' });
    }
};

/**
 * Adds a new body measurement for the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const addBodyMeasurement = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const {
        measurement_date,
        chest,
        waist,
        hips,
        neck,
        biceps_left,
        biceps_right,
        thigh_left,
        thigh_right,
        calf_left,
        calf_right,
        body_fat_percentage,
        notes
    } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO body_measurements (user_id, measurement_date, chest, waist, hips, neck, biceps_left, biceps_right, thigh_left, thigh_right, calf_left, calf_right, body_fat_percentage, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
             RETURNING *`,
            [userId, measurement_date, chest, waist, hips, neck, biceps_left, biceps_right, thigh_left, thigh_right, calf_left, calf_right, body_fat_percentage, notes]
        );
        res.status(201).json({
            message: 'Body measurement added successfully',
            measurement: result.rows[0]
        });
    } catch (err) {
        console.error('Error adding body measurement:', err);
        res.status(500).json({ error: 'Server error while adding body measurement' });
    }
};

/**
 * Deletes a body measurement by its ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const deleteBodyMeasurement = async (req, res) => {
    const pool = req.app.get('db');
    const { measurement_id } = req.params;
    try {
        const result = await pool.query(
            `DELETE FROM body_measurements WHERE measurement_id = $1 RETURNING measurement_id`,
            [measurement_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Body measurement not found' });
        }
        res.status(200).json({
            message: 'Body measurement deleted successfully',
            measurement_id: result.rows[0].measurement_id
        });
    } catch (err) {
        console.error('Error deleting body measurement:', err);
        res.status(500).json({ error: 'Server error while deleting body measurement' });
    }
};

module.exports = { getBodyMeasurements, addBodyMeasurement, deleteBodyMeasurement };