const getEmails = async (req, res) => {
  const pool = req.app.get('db');

  try {
    const result = await pool.query(`SELECT email FROM emails ORDER BY email ASC`); // Use "emails"
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Fehler beim Abrufen der E-Mail-Adressen:', err);
    res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der E-Mail-Adressen' });
  }
};

const addEmail = async (req, res) => {
  const pool = req.app.get('db');
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'E-Mail-Adresse ist erforderlich.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO emails (email) VALUES ($1) RETURNING email`, // Use "emails"
      [email]
    );

    res.status(201).json({
      message: 'E-Mail-Adresse erfolgreich hinzugefügt.',
      email: result.rows[0].email
    });
  } catch (err) {
    console.error('Fehler beim Hinzufügen der E-Mail-Adresse:', err);

    // Handle unique constraint violation
    if (err.code === '23505') {
      return res.status(409).json({ error: 'E-Mail-Adresse existiert bereits.' });
    }

    res.status(500).json({ error: 'Serverseiten-Fehler beim Hinzufügen der E-Mail-Adresse.' });
  }
};

const deleteEmail = async (req, res) => {
  const pool = req.app.get('db');
  const { email } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM emails WHERE email = $1 RETURNING email`, // Use "emails"
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'E-Mail-Adresse nicht gefunden.' });
    }

    res.status(200).json({
      message: 'E-Mail-Adresse erfolgreich gelöscht.',
      email: result.rows[0].email
    });
  } catch (err) {
    console.error('Fehler beim Löschen der E-Mail-Adresse:', err);
    res.status(500).json({ error: 'Serverseiten-Fehler beim Löschen der E-Mail-Adresse.' });
  }
};

module.exports = { getEmails, addEmail, deleteEmail };