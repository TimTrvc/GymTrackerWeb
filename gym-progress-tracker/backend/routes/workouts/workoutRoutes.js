const express = require('express');
const {
    getWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout
} = require('../../controllers/workouts/workoutController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for managing workouts.
 * All routes require authentication.
 *
 * GET /         - Get all workouts
 * POST /        - Add a new workout
 * PUT /:id      - Update a workout by ID
 * DELETE /:id   - Delete a workout by ID
 */
router.get('/', authMiddleware, getWorkouts);
router.post('/', authMiddleware, addWorkout);
router.put('/:workout_id', authMiddleware, updateWorkout);
router.delete('/:workout_id', authMiddleware, deleteWorkout);

module.exports = router;