/**
 * Retrieves all personal records for the authenticated user.
 * @param {object} req - Express request object containing user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during personal record retrieval.
 */
const getPersonalRecords = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;

    try {
        const result = await pool.query(
            `SELECT * FROM personal_records WHERE user_id = $1 ORDER BY achieved_date DESC`,
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving personal records:', err);
        res.status(500).json({ error: 'Server error retrieving personal records' });
    }
};

/**
 * Adds a new personal record for the authenticated user.
 * @param {object} req - Express request object containing personal record details in body and user info.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during personal record creation.
 */
const addPersonalRecord = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const {
        exercise_id,
        record_type,
        value,
        performance_id,
        previous_record,
        notes
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO personal_records (user_id, exercise_id, record_type, value, performance_id, previous_record, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [userId, exercise_id, record_type, value, performance_id, previous_record, notes]
        );

        res.status(201).json({
            message: 'Personal record added successfully',
            personalRecord: result.rows[0]
        });
    } catch (err) {
        console.error('Error adding personal record:', err);
        res.status(500).json({ error: 'Server error adding personal record' });
    }
};

/**
 * Deletes a personal record by its ID.
 * @param {object} req - Express request object containing pr_id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If the personal record is not found or a server error occurs during deletion.
 */
const deletePersonalRecord = async (req, res) => {
    const pool = req.app.get('db');
    const { pr_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM personal_records WHERE pr_id = $1 RETURNING pr_id`,
            [pr_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Personal record not found' });
        }

        res.status(200).json({
            message: 'Personal record deleted successfully',
            pr_id: result.rows[0].pr_id
        });
    } catch (err) {
        console.error('Error deleting personal record:', err);
        res.status(500).json({ error: 'Server error deleting personal record' });
    }
};

/**
 * Exports personal record controller functions.
 */
module.exports = { getPersonalRecords, addPersonalRecord, deletePersonalRecord };