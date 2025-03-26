const getUserConnections = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;

    try {
        const result = await pool.query(
            `SELECT * FROM user_connections WHERE user_id = $1 OR connected_user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Fehler beim Abrufen der Benutzerverbindungen:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Benutzerverbindungen' });
    }
};

const addUserConnection = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const { connected_user_id, connection_type } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO user_connections (user_id, connected_user_id, connection_type)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, connected_user_id, connection_type]
        );

        res.status(201).json({
            message: 'Benutzerverbindung erfolgreich hinzugefügt',
            connection: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Hinzufügen der Benutzerverbindung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Hinzufügen der Benutzerverbindung' });
    }
};

const updateUserConnectionStatus = async (req, res) => {
    const pool = req.app.get('db');
    const { connection_id } = req.params;
    const { status } = req.body;

    try {
        const result = await pool.query(
            `UPDATE user_connections
             SET status = $1
             WHERE connection_id = $2
             RETURNING *`,
            [status, connection_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Benutzerverbindung nicht gefunden' });
        }

        res.status(200).json({
            message: 'Status der Benutzerverbindung erfolgreich aktualisiert',
            connection: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Aktualisieren des Status der Benutzerverbindung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Aktualisieren des Status der Benutzerverbindung' });
    }
};

const deleteUserConnection = async (req, res) => {
    const pool = req.app.get('db');
    const { connection_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM user_connections WHERE connection_id = $1 RETURNING connection_id`,
            [connection_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Benutzerverbindung nicht gefunden' });
        }

        res.status(200).json({
            message: 'Benutzerverbindung erfolgreich gelöscht',
            connection_id: result.rows[0].connection_id
        });
    } catch (err) {
        console.error('Fehler beim Löschen der Benutzerverbindung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Löschen der Benutzerverbindung' });
    }
};

module.exports = { getUserConnections, addUserConnection, updateUserConnectionStatus, deleteUserConnection };