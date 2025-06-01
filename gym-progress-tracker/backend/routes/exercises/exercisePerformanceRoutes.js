const express = require('express');
const { getExercisePerformances, addExercisePerformance, deleteExercisePerformance } = require('../../controllers/exercises/exercisePerformanceController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for managing exercise performances.
 * All routes require authentication.
 *
 * GET /:session_id         - Get all performances for a session
 * POST /                   - Add a performance to a session
 * DELETE /:performance_id  - Delete a performance by ID
 */
router.get('/:session_id', authMiddleware, getExercisePerformances);
router.post('/', authMiddleware, addExercisePerformance);
router.delete('/:performance_id', authMiddleware, deleteExercisePerformance);

module.exports = router;