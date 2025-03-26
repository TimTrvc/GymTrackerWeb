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
        console.error('Fehler beim Abrufen der persönlichen Bestleistungen:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der persönlichen Bestleistungen' });
    }
};

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
            message: 'Persönliche Bestleistung erfolgreich hinzugefügt',
            personalRecord: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Hinzufügen der persönlichen Bestleistung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Hinzufügen der persönlichen Bestleistung' });
    }
};

const deletePersonalRecord = async (req, res) => {
    const pool = req.app.get('db');
    const { pr_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM personal_records WHERE pr_id = $1 RETURNING pr_id`,
            [pr_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Persönliche Bestleistung nicht gefunden' });
        }

        res.status(200).json({
            message: 'Persönliche Bestleistung erfolgreich gelöscht',
            pr_id: result.rows[0].pr_id
        });
    } catch (err) {
        console.error('Fehler beim Löschen der persönlichen Bestleistung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Löschen der persönlichen Bestleistung' });
    }
};

module.exports = { getPersonalRecords, addPersonalRecord, deletePersonalRecord };