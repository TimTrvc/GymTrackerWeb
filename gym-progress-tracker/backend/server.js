const express = require('express');
const cors = require('cors');
const progressRoutes = require('./routes/progressRoutes');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'progress_tracker',
    password: 'admin',
    port: 5432,
});

app.set('db', pool); // Attach the pool to the app for use in routes

// Routes
app.use('/api/progress', progressRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));