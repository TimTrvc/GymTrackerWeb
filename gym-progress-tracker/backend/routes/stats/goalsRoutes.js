const express = require('express');
const { getGoals, addGoal, updateGoal, deleteGoal } = require('../../controllers/stats/goalsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getGoals); // Fetch all goals for the authenticated user
router.post('/', authMiddleware, addGoal); // Add a new goal
router.put('/:goal_id', authMiddleware, updateGoal); // Update an existing goal
router.delete('/:goal_id', authMiddleware, deleteGoal); // Delete a goal

module.exports = router;