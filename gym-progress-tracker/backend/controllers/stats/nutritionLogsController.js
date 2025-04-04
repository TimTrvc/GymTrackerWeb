const getNutritionLogs = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id; // Get the user ID from the authenticated user

    try {
        const result = await pool.query(
            `SELECT * FROM nutrition_logs WHERE user_id = $1 ORDER BY log_date DESC`,
            [userId] // Use the user ID to filter logs
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Fehler beim Abrufen der Ernährungstagebücher:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Ernährungstagebücher' });
    }
};

const addNutritionLog = async (req, res) => {
    const pool = req.app.get('db'); // Ensure you're using the correct database pool
    const user_id = req.users.id; // Get the user ID from the authenticated user

    try {
        const {
            meal_type,
            calories,
            protein_grams,
            carbs_grams,
            fat_grams,
            notes,
            log_date, // Accept log_date from the request body
        } = req.body;

        // Assign default value to log_date if it's not provided
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

const deleteNutritionLog = async (req, res) => {
    const pool = req.app.get('db');
    const { nutrition_log_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM nutrition_logs WHERE nutrition_log_id = $1 RETURNING nutrition_log_id`,
            [nutrition_log_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ernährungseintrag nicht gefunden' });
        }

        res.status(200).json({
            message: 'Ernährungseintrag erfolgreich gelöscht',
            nutrition_log_id: result.rows[0].nutrition_log_id
        });
    } catch (err) {
        console.error('Fehler beim Löschen des Ernährungseintrags:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Löschen des Ernährungseintrags' });
    }
};

module.exports = { getNutritionLogs, addNutritionLog, deleteNutritionLog };