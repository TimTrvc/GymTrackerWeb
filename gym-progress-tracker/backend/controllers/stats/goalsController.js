const getGoals = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;

    try {
        const result = await pool.query(
            `SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Fehler beim Abrufen der Ziele:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Ziele' });
    }
};

const addGoal = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const {
        exercise_id,
        goal_type,
        current_value,
        target_value,
        deadline
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO goals (user_id, exercise_id, goal_type, current_value, target_value, deadline)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [userId, exercise_id, goal_type, current_value, target_value, deadline]
        );

        res.status(201).json({
            message: 'Ziel erfolgreich hinzugefügt',
            goal: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Hinzufügen des Ziels:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Hinzufügen des Ziels' });
    }
};

const updateGoal = async (req, res) => {
    const pool = req.app.get('db');
    const { goal_id } = req.params;
    const {
        current_value,
        achieved_at,
        is_achieved
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE goals
             SET current_value = $1, achieved_at = $2, is_achieved = $3
             WHERE goal_id = $4
             RETURNING *`,
            [current_value, achieved_at, is_achieved, goal_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ziel nicht gefunden' });
        }

        res.status(200).json({
            message: 'Ziel erfolgreich aktualisiert',
            goal: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Aktualisieren des Ziels:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Aktualisieren des Ziels' });
    }
};

const deleteGoal = async (req, res) => {
    const pool = req.app.get('db');
    const { goal_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM goals WHERE goal_id = $1 RETURNING goal_id`,
            [goal_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ziel nicht gefunden' });
        }

        res.status(200).json({
            message: 'Ziel erfolgreich gelöscht',
            goal_id: result.rows[0].goal_id
        });
    } catch (err) {
        console.error('Fehler beim Löschen des Ziels:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Löschen des Ziels' });
    }
};

module.exports = { getGoals, addGoal, updateGoal, deleteGoal };