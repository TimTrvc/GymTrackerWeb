
/**
 * Retrieves all exercise categories.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during category retrieval.
 */
const getAllCategories = async (req, res) => {
    const pool = req.app.get('db');

    try {
        const result = await pool.query('SELECT * FROM exercise_categories');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving categories:', err);
        res.status(500).json({ error: 'Server error retrieving categories' });
    }
};

/**
 * Retrieves a single exercise category by its ID.
 * @param {object} req - Express request object containing category_id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If the category is not found or a server error occurs.
 */
const getCategoryById = async (req, res) => {
    const pool = req.app.get('db');
    const { category_id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM exercise_categories WHERE category_id = $1', [category_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error retrieving category:', err);
        res.status(500).json({ error: 'Server error retrieving category' });
    }
};

/**
 * Adds a new exercise category.
 * @param {object} req - Express request object containing category details in body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is a server-side error during category creation.
 */
const addCategory = async (req, res) => {
    const pool = req.app.get('db');
    const { name, description, icon } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO exercise_categories (name, description, icon) 
             VALUES ($1, $2, $3) RETURNING category_id, name`,
            [name, description, icon]
        );

        res.status(201).json({
            message: 'Category added successfully',
            category: result.rows[0]
        });
    } catch (err) {
        console.error('Error adding category:', err);
        res.status(500).json({ error: 'Server error adding category' });
    }
};

/**
 * Updates an existing exercise category by its ID.
 * @param {object} req - Express request object containing category_id in params and update details in body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If the category is not found or a server error occurs during update.
 */
const updateCategory = async (req, res) => {
    const pool = req.app.get('db');
    const { category_id } = req.params;
    const { name, description, icon } = req.body;

    try {
        const result = await pool.query(
            `UPDATE exercise_categories 
             SET name = $1, description = $2, icon = $3 
             WHERE category_id = $4 
             RETURNING category_id, name`,
            [name, description, icon, category_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category updated successfully',
            category: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: 'Server error updating category' });
    }
};

/**
 * Deletes an exercise category by its ID.
 * @param {object} req - Express request object containing category_id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If the category is not found or a server error occurs during deletion.
 */
const deleteCategory = async (req, res) => {
    const pool = req.app.get('db');
    const { category_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM exercise_categories 
             WHERE category_id = $1 
             RETURNING category_id`,
            [category_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category deleted successfully',
            category_id: result.rows[0].category_id
        });
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ error: 'Server error deleting category' });
    }
};

/**
 * Exports exercise category controller functions.
 */
module.exports = { getAllCategories, getCategoryById, addCategory, updateCategory, deleteCategory };