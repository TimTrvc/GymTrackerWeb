/**
 * Retrieves all template exercises for a given template ID.
 * @param {object} req - Express request object containing template_id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during template exercise retrieval.
 */
const getTemplateExercises = async (req, res) => {
    const pool = req.app.get('db');
    const { template_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM template_exercises WHERE template_id = $1 ORDER BY position ASC`,
            [template_id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving template exercises:', err);
        res.status(500).json({ error: 'Server error retrieving template exercises' });
    }
};

/**
 * Adds a new template exercise to a workout template.
 * @param {object} req - Express request object containing template exercise details in body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during template exercise creation.
 */
const addTemplateExercise = async (req, res) => {
    const pool = req.app.get('db');
    const {
        template_id,
        exercise_id,
        position,
        sets,
        reps,
        rest_seconds,
        notes
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO template_exercises (template_id, exercise_id, position, sets, reps, rest_seconds, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [template_id, exercise_id, position, sets, reps, rest_seconds, notes]
        );

        res.status(201).json({
            message: 'Template exercise added successfully',
            templateExercise: result.rows[0]
        });
    } catch (err) {
        console.error('Error adding template exercise:', err);
        res.status(500).json({ error: 'Server error adding template exercise' });
    }
};

/**
 * Deletes a template exercise by its ID.
 * @param {object} req - Express request object containing template_exercise_id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If the template exercise is not found or a server error occurs during deletion.
 */
const deleteTemplateExercise = async (req, res) => {
    const pool = req.app.get('db');
    const { template_exercise_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM template_exercises WHERE template_exercise_id = $1 RETURNING template_exercise_id`,
            [template_exercise_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Template exercise not found' });
        }

        res.status(200).json({
            message: 'Template exercise deleted successfully',
            template_exercise_id: result.rows[0].template_exercise_id
        });
    } catch (err) {
        console.error('Error deleting template exercise:', err);
        res.status(500).json({ error: 'Server error deleting template exercise' });
    }
};

/**
 * Exports template exercise controller functions.
 */
module.exports = { getTemplateExercises, addTemplateExercise, deleteTemplateExercise };