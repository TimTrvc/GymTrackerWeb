require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const userRoutes = require('./routes/user/userRoutes');
const workoutTemplateRoutes = require('./routes/workouts/workoutTemplateRoutes');
const exerciseCategoriesRoutes = require('./routes/exercises/exerciseCategoriesRoutes');
const exerciseRoutes = require('./routes/exercises/exerciseRoutes');
const activityStatsRoutes = require('./routes/stats/activityStatsRoutes');
const bodyMeasurementRoutes = require('./routes/stats/bodyMeasurementRoutes');
const exercisePerformanceRoutes = require('./routes/exercises/exercisePerformanceRoutes');
const templateExercisesRoutes = require('./routes/exercises/templateExercisesRoutes');
const goalsRoutes = require('./routes/stats/goalsRoutes');
const nutritionLogsRoutes = require('./routes/stats/nutritionLogsRoutes');
const personalRecordsRoutes = require('./routes/stats/personalRecordsRoutes');
const trainingSessionsRoutes = require('./routes/stats/trainingSessionsRoutes');
const userConnectionsRoutes = require('./routes/user/userConnectionsRoutes');
const userWeightLogsRoutes = require('./routes/user/userWeightLogsRoutes');
const workoutRoutes = require('./routes/workouts/workoutRoutes');
const workoutExercisesRoutes = require('./routes/workouts/workoutExercisesRoutes');
const emailRoutes = require('./routes/emailRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authMiddleware = require("./middleware/authMiddleware"); // Neue Admin-Routen importieren


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
    ssl: {
        rejectUnauthorized: false
    }
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
app.use('/api/workout-templates', workoutTemplateRoutes);
app.use('/api/exercise-categories', exerciseCategoriesRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/activity-stats', activityStatsRoutes);
app.use('/api/body-measurement', bodyMeasurementRoutes);
app.use('/api/exercise-performance', exercisePerformanceRoutes);
app.use('/api/template-exercises', templateExercisesRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/nutrition-logs', nutritionLogsRoutes);
app.use('/api/personal-records', personalRecordsRoutes);
app.use('/api/training-sessions', trainingSessionsRoutes);
app.use('/api/user-connections', userConnectionsRoutes);
app.use('/api/user-weight-logs', userWeightLogsRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/workout-exercises', workoutExercisesRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/admin', authMiddleware, adminRoutes); // Admin-Routen hinzufügen

// Einfache Home-Route
app.get('/api', (req, res) => {
    res.json({ message: 'API funktioniert!' });
});

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));