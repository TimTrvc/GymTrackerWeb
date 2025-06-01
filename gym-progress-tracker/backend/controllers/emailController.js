/**
 * Retrieves all emails from the database.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getEmails = async (req, res) => {
  const pool = req.app.get('db');
  try {
    const result = await pool.query(`SELECT email FROM emails ORDER BY email ASC`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error retrieving emails:', err);
    res.status(500).json({ error: 'Server error while retrieving emails.' });
  }
};

/**
 * Adds a new email to the database.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const addEmail = async (req, res) => {
  const pool = req.app.get('db');
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO emails (email) VALUES ($1) RETURNING email`,
      [email]
    );

    res.status(201).json({
      message: 'Email address added successfully.',
      email: result.rows[0].email
    });
  } catch (err) {
    console.error('Error adding email:', err);

    // Handle unique constraint violation
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email address already exists.' });
    }

    res.status(500).json({ error: 'Server error while adding email.' });
  }
};

/**
 * Deletes an email from the database.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const deleteEmail = async (req, res) => {
  const pool = req.app.get('db');
  const { email } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM emails WHERE email = $1 RETURNING email`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email address not found.' });
    }

    res.status(200).json({
      message: 'Email address deleted successfully.',
      email: result.rows[0].email
    });
  } catch (err) {
    console.error('Error deleting email:', err);
    res.status(500).json({ error: 'Server error while deleting email.' });
  }
};

module.exports = { getEmails, addEmail, deleteEmail };