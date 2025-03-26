const getUserWeightLogs = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;

    try {
        const result = await pool.query(
            `SELECT * FROM user_weight_logs WHERE user_id = $1 ORDER BY logged_date DESC`,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Fehler beim Abrufen der Gewichtseinträge:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Gewichtseinträge' });
    }
};

const addUserWeightLog = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const { weight, logged_date, notes } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO user_weight_logs (user_id, weight, logged_date, notes)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, weight, logged_date, notes]
        );

        res.status(201).json({
            message: 'Gewichtseintrag erfolgreich hinzugefügt',
            weightLog: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Hinzufügen des Gewichtseintrags:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Hinzufügen des Gewichtseintrags' });
    }
};

const deleteUserWeightLog = async (req, res) => {
    const pool = req.app.get('db');
    const { weight_log_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM user_weight_logs WHERE weight_log_id = $1 RETURNING weight_log_id`,
            [weight_log_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Gewichtseintrag nicht gefunden' });
        }

        res.status(200).json({
            message: 'Gewichtseintrag erfolgreich gelöscht',
            weight_log_id: result.rows[0].weight_log_id
        });
    } catch (err) {
        console.error('Fehler beim Löschen des Gewichtseintrags:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Löschen des Gewichtseintrags' });
    }
};

module.exports = { getUserWeightLogs, addUserWeightLog, deleteUserWeightLog };