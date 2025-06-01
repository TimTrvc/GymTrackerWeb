const express = require('express');
const { getTrainingSessions, addTrainingSession, deleteTrainingSession } = require('../../controllers/stats/trainingSessionsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for managing training sessions.
 * All routes require authentication.
 *
 * GET /                  - Get all training sessions
 * POST /                 - Add a new training session
 * DELETE /:session_id    - Delete a training session by ID
 */
router.get('/', authMiddleware, getTrainingSessions);
router.post('/', authMiddleware, addTrainingSession);
router.delete('/:session_id', authMiddleware, deleteTrainingSession);

module.exports = router;