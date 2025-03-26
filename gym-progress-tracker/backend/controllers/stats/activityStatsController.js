const getActivityStats = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;

    try {
        const result = await pool.query(
            `SELECT * FROM activity_stats WHERE user_id = $1 ORDER BY stat_date DESC`,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Fehler beim Abrufen der Aktivitätsstatistiken:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Aktivitätsstatistiken' });
    }
};

const addActivityStat = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const {
        stat_date,
        total_workouts,
        total_exercises,
        total_sets,
        total_reps,
        total_weight,
        total_duration_minutes
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO activity_stats (user_id, stat_date, total_workouts, total_exercises, total_sets, total_reps, total_weight, total_duration_minutes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [userId, stat_date, total_workouts, total_exercises, total_sets, total_reps, total_weight, total_duration_minutes]
        );

        res.status(201).json({
            message: 'Aktivitätsstatistik erfolgreich hinzugefügt',
            stat: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Hinzufügen der Aktivitätsstatistik:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Hinzufügen der Aktivitätsstatistik' });
    }
};

const deleteActivityStat = async (req, res) => {
    const pool = req.app.get('db');
    const { stat_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM activity_stats WHERE stat_id = $1 RETURNING stat_id`,
            [stat_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Aktivitätsstatistik nicht gefunden' });
        }

        res.status(200).json({
            message: 'Aktivitätsstatistik erfolgreich gelöscht',
            stat_id: result.rows[0].stat_id
        });
    } catch (err) {
        console.error('Fehler beim Löschen der Aktivitätsstatistik:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Löschen der Aktivitätsstatistik' });
    }
};

module.exports = { getActivityStats, addActivityStat, deleteActivityStat };