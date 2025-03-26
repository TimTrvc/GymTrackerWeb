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
        console.error('Fehler beim Abrufen der Ernährungstagebücher:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Ernährungstagebücher' });
    }
};

const addNutritionLog = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const {
        log_date,
        meal_type,
        calories,
        protein_grams,
        carbs_grams,
        fat_grams,
        notes,
        meal_photo
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO nutrition_logs (user_id, log_date, meal_type, calories, protein_grams, carbs_grams, fat_grams, notes, meal_photo)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [userId, log_date, meal_type, calories, protein_grams, carbs_grams, fat_grams, notes, meal_photo]
        );

        res.status(201).json({
            message: 'Ernährungseintrag erfolgreich hinzugefügt',
            nutritionLog: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Hinzufügen des Ernährungseintrags:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Hinzufügen des Ernährungseintrags' });
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