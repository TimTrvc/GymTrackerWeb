const Progress = require('../models/progressModel');

const getProgress = async (req, res) => {
    const pool = req.app.get('db'); // Get the PostgreSQL pool from the app

    try {
        // Fetch all progress records
        const result = await pool.query('SELECT * FROM progress');
        const progressRecords = result.rows;

        // Group progress by exercise
        const groupedProgress = progressRecords.reduce((acc, record) => {
            if (!acc[record.exercise]) {
                acc[record.exercise] = [];
            }
            acc[record.exercise].push(record);
            return acc;
        }, {});

        // Calculate improvements
        const progressWithImprovements = Object.entries(groupedProgress).map(([exercise, records]) => {
            records.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date in ascending order
            const improvement = records[records.length - 1].weight - records[0].weight;
            return { exercise, records, improvement };
        });

        res.json(progressWithImprovements);
    } catch (err) {
        console.error('Error fetching progress:', err);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
};
const addProgress = async (req, res) => {
    const pool = req.app.get('db'); // Get the PostgreSQL pool from the app
    const { exercise, date, reps, weight } = req.body;

    console.log('Received data:', { exercise, date, reps, weight }); // Debug log

    try {
        // Insert the new progress entry into the database
        await pool.query(
            'INSERT INTO progress (exercise, date, reps, weight) VALUES ($1, $2, $3, $4)',
            [exercise, date, reps, weight]
        );
        console.log('Progress added successfully'); // Debug log
        res.status(201).json({ message: 'Progress added successfully' });
    } catch (err) {
        console.error('Error adding progress:', err);
        res.status(500).json({ error: 'Failed to add progress' });
    }
};

module.exports = { getProgress, addProgress };