require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL-Verbindung
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'progress_tracker',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5432,
});

// Verbindungstest
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Datenbankverbindung fehlgeschlagen:', err);
    } else {
        console.log('Datenbankverbindung erfolgreich etabliert.');
    }
});

// Datenbank-Pool an App anhängen
app.set('db', pool);

// Statische Dateien aus dem public-Verzeichnis bereitstellen
app.use(express.static('public'));

// Routen
app.use('/api/users', userRoutes);

// Einfache Home-Route
app.get('/api', (req, res) => {
    res.json({ message: 'API funktioniert!' });
});

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));