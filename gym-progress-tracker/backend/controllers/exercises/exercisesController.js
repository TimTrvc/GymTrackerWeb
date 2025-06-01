/**
 * Retrieves all exercises from the database.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {void}
 */
const getAllExercises = async (req, res) => {
    const pool = req.app.get('db');
    try {
        const result = await pool.query('SELECT * FROM exercises');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving exercises:', err);
        res.status(500).json({ error: 'Server error while retrieving exercises' });
    }
};

/**
 * Retrieves a single exercise by its ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {void}
 */
const getExerciseById = async (req, res) => {
    const pool = req.app.get('db');
    const { exercise_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM exercises WHERE exercise_id = $1', [exercise_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Exercise not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error retrieving exercise:', err);
        res.status(500).json({ error: 'Server error while retrieving exercise' });
    }
};

/**
 * Retrieves all exercises for a given category ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {void}
 */
const getExerciseByCategoryId = async (req, res) => {
    const pool = req.app.get('db');
    const { category_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM exercises WHERE category_id = $1', [category_id]);
        // Return an empty array instead of a 404 error when no exercises are found
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving exercises:', err);
        res.status(500).json({ error: 'Server error while retrieving exercises' });
    }
};

/**
 * Adds a new exercise to the database.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {void}
 */
const addExercise = async (req, res) => {
    const pool = req.app.get('db');
    const {
        category_id,
        name,
        description,
        instructions,
        difficulty_level,
        primary_muscle_group,
        secondary_muscle_groups,
        equipment_needed,
        is_compound,
        video_url,
        image_url,
        is_public
    } = req.body;
    const created_by = req.user?.id || null; // Optional: Auth middleware
    try {
        const result = await pool.query(
            `INSERT INTO exercises (category_id, name, description, instructions, difficulty_level, 
             primary_muscle_group, secondary_muscle_groups, equipment_needed, is_compound, video_url, 
             image_url, created_by, is_public) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
             RETURNING exercise_id, name`,
            [
                category_id,
                name,
                description,
                instructions,
                difficulty_level,
                primary_muscle_group,
                secondary_muscle_groups,
                equipment_needed,
                is_compound,
                video_url,
                image_url,
                created_by,
                is_public
            ]
        );
        res.status(201).json({
            message: 'Exercise added successfully',
            exercise: result.rows[0]
        });
    } catch (err) {
        console.error('Error adding exercise:', err);
        res.status(500).json({ error: 'Server error while adding exercise' });
    }
};

/**
 * Updates an existing exercise by its ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {void}
 */
const updateExercise = async (req, res) => {
    const pool = req.app.get('db');
    const { exercise_id } = req.params;
    const {
        category_id,
        name,
        description,
        instructions,
        difficulty_level,
        primary_muscle_group,
        secondary_muscle_groups,
        equipment_needed,
        is_compound,
        video_url,
        image_url,
        is_public
    } = req.body;
    try {
        const result = await pool.query(
            `UPDATE exercises 
             SET category_id = $1, name = $2, description = $3, instructions = $4, difficulty_level = $5, 
                 primary_muscle_group = $6, secondary_muscle_groups = $7, equipment_needed = $8, 
                 is_compound = $9, video_url = $10, image_url = $11, is_public = $12 
             WHERE exercise_id = $13 
             RETURNING exercise_id, name`,
            [
                category_id,
                name,
                description,
                instructions,
                difficulty_level,
                primary_muscle_group,
                secondary_muscle_groups,
                equipment_needed,
                is_compound,
                video_url,
                image_url,
                is_public,
                exercise_id
            ]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Exercise not found' });
        }
        res.status(200).json({
            message: 'Exercise updated successfully',
            exercise: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating exercise:', err);
        res.status(500).json({ error: 'Server error while updating exercise' });
    }
};

/**
 * Deletes an exercise by its ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {void}
 */
const deleteExercise = async (req, res) => {
    const pool = req.app.get('db');
    const { exercise_id } = req.params;
    try {
        const result = await pool.query(
            `DELETE FROM exercises 
             WHERE exercise_id = $1 
             RETURNING exercise_id`,
            [exercise_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Exercise not found' });
        }
        res.status(200).json({
            message: 'Exercise deleted successfully',
            exercise_id: result.rows[0].exercise_id
        });
    } catch (err) {
        console.error('Error deleting exercise:', err);
        res.status(500).json({ error: 'Server error while deleting exercise' });
    }
};

/**
 * Exports exercise controller functions.
 */
module.exports = { getAllExercises, getExerciseById, getExerciseByCategoryId, addExercise, updateExercise, deleteExercise };