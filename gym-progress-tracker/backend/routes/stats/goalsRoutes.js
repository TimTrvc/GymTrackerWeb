const express = require('express');
const { getGoals, addGoal, updateGoal, deleteGoal } = require('../../controllers/stats/goalsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for managing user goals.
 * All routes require authentication.
 *
 * GET /                - Get all goals for the authenticated user
 * POST /               - Add a new goal
 * PUT /:goal_id        - Update an existing goal
 * DELETE /:goal_id     - Delete a goal by ID
 */
router.get('/', authMiddleware, getGoals);
router.post('/', authMiddleware, addGoal);
router.put('/:goal_id', authMiddleware, updateGoal);
router.delete('/:goal_id', authMiddleware, deleteGoal);

module.exports = router;