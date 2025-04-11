const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Benutzerregistrierung
const registerUser = async (req, res) => {
    const pool = req.app.get('db');
    const { username, email, password, firstName, lastName, dateOfBirth, gender, height } = req.body;

    try {
        // Prüfen, ob Benutzer oder E-Mail bereits existieren
        const userCheck = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).json({
                error: 'Benutzername oder E-Mail existiert bereits'
            });
        }

        // Passwort hashen
        const passwordHash = await bcrypt.hash(password, 10);

        // Benutzer in Datenbank einfügen
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, first_name, last_name,
            date_of_birth, gender, height)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id, username, email`,
            [username, email, passwordHash, firstName, lastName, dateOfBirth, gender, height]
        );

        // JWT-Token generieren
        const token = jwt.sign(
            { id: result.rows[0].user_id, username: result.rows[0].username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        res.status(201).json({
            message: 'Benutzer erfolgreich registriert',
            user: {
                id: result.rows[0].user_id,
                username: result.rows[0].username,
                email: result.rows[0].email
            },
            token
        });
    } catch (err) {
        console.error('Fehler bei der Benutzerregistrierung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler bei der Registrierung' });
    }
};

// Benutzeranmeldung
const loginUser = async (req, res) => {
    const pool = req.app.get('db');
    const { username, password } = req.body;

    try {
        // Benutzer in Datenbank suchen
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Ungültige Anmeldeinformationen' });
        }

        const user = result.rows[0];

        // Passwort überprüfen
        const passwordValid = await bcrypt.compare(password, user.password_hash);

        if (!passwordValid) {
            return res.status(401).json({ error: 'Ungültige Anmeldeinformationen' });
        }

        // Letzten Login aktualisieren
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1',
            [user.user_id]
        );

        // JWT-Token generieren
        const token = jwt.sign(
            { id: user.user_id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        res.json({
            message: 'Anmeldung erfolgreich',
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                isAdmin: user.is_admin
            },
            token
        });
    } catch (err) {
        console.error('Fehler bei der Benutzeranmeldung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler bei der Anmeldung' });
    }
};

const getUserById = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.params.id;
  
    try {
      // Use DATE() function to cast the date_of_birth to a date without timezone
      const result = await pool.query(
        `SELECT user_id, username, email, first_name, last_name,
          to_char(date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
          gender, height, profile_picture, created_at, last_login, is_active, is_admin
         FROM users
         WHERE user_id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Benutzer nicht gefunden' });
      }

      const user = result.rows[0];
      res.json({ user });
    } catch (err) {
      console.error('Fehler beim Abrufen des Benutzers:', err);
      res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen des Benutzers' });
    }
  };


const updateUserById = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.params.id;
    const { username, email, height, first_name, last_name, date_of_birth, gender } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users 
             SET username = $1, email = $2, height = $3, first_name = $4, last_name = $5, 
                date_of_birth = $6, gender = $7
             WHERE user_id = $8 
             RETURNING user_id, username, email, height, first_name, last_name, date_of_birth, gender`,
            [username, email, height, first_name, last_name, date_of_birth, gender, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }

        res.status(200).json({
            message: 'Benutzer erfolgreich aktualisiert',
            user: result.rows[0],
        });
    } catch (err) {
        console.error('Fehler beim Aktualisieren des Benutzers:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Aktualisieren des Benutzers' });
    }
};

module.exports = { registerUser, loginUser, getUserById, updateUserById };