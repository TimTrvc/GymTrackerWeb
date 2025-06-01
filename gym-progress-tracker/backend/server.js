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
const avatarRoutes = require('./routes/user/avatarRoutes'); // Import avatar routes
const workoutRoutes = require('./routes/workouts/workoutRoutes');
const workoutExercisesRoutes = require('./routes/workouts/workoutExercisesRoutes');
const emailRoutes = require('./routes/emailRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authMiddleware = require("./middleware/authMiddleware");


const app = express();
app.use(cors());
app.use(express.json());

/**
 * PostgreSQL connection pool setup using environment variables.
 */
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'progress_tracker',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSLMODE === 'require' ? { rejectUnauthorized: false } : false
});


// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connection established successfully.');
    }
});

// Attach database pool to app
app.set('db', pool);

// Serve static files from the public directory
app.use(express.static('public'));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/workout-templates', workoutTemplateRoutes);
app.use('/api/exercise-categories', exerciseCategoriesRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/activity-stats', activityStatsRoutes);
app.use('/api/body-measurements', bodyMeasurementRoutes);
app.use('/api/exercise-performance', exercisePerformanceRoutes);
app.use('/api/template-exercises', templateExercisesRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/nutrition-logs', nutritionLogsRoutes);
app.use('/api/personal-records', personalRecordsRoutes);
app.use('/api/training-sessions', trainingSessionsRoutes);
app.use('/api/user-connections', userConnectionsRoutes);
app.use('/api/user-weight-logs', userWeightLogsRoutes);
app.use('/api/avatar', avatarRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/workout-exercises', workoutExercisesRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

/**
 * Simple home route for API status check.
 */
app.get('/api', (req, res) => {
    res.json({ message: 'API is working!' });
});

/**
 * Start the Express server.
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));