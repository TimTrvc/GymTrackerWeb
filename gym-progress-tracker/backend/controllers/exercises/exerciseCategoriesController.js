const getAllCategories = async (req, res) => {
    const pool = req.app.get('db');

    try {
        const result = await pool.query('SELECT * FROM exercise_categories');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Fehler beim Abrufen der Kategorien:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Kategorien' });
    }
};

const getCategoryById = async (req, res) => {
    const pool = req.app.get('db');
    const { category_id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM exercise_categories WHERE category_id = $1', [category_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Kategorie nicht gefunden' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Fehler beim Abrufen der Kategorie:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Kategorie' });
    }
};

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
            message: 'Kategorie erfolgreich hinzugefügt',
            category: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Hinzufügen der Kategorie:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Hinzufügen der Kategorie' });
    }
};

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
            return res.status(404).json({ error: 'Kategorie nicht gefunden' });
        }

        res.status(200).json({
            message: 'Kategorie erfolgreich aktualisiert',
            category: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Aktualisieren der Kategorie:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Aktualisieren der Kategorie' });
    }
};

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
            return res.status(404).json({ error: 'Kategorie nicht gefunden' });
        }

        res.status(200).json({
            message: 'Kategorie erfolgreich gelöscht',
            category_id: result.rows[0].category_id
        });
    } catch (err) {
        console.error('Fehler beim Löschen der Kategorie:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Löschen der Kategorie' });
    }
};

module.exports = { getAllCategories, getCategoryById, addCategory, updateCategory, deleteCategory };