const express = require('express');
const {
    getWorkoutExercises,
    addWorkoutExercise,
    deleteWorkoutExercise
} = require('../../controllers/workouts/workoutExercisesController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for managing workout exercises.
 * All routes require authentication.
 *
 * GET /:workout_id           - Get all exercises for a workout
 * POST /                     - Add an exercise to a workout
 * DELETE /:workout_exercise_id - Delete an exercise from a workout by ID
 */
router.get('/:workout_id', authMiddleware, getWorkoutExercises);
router.post('/', authMiddleware, addWorkoutExercise);
router.delete('/:workout_exercise_id', authMiddleware, deleteWorkoutExercise);

module.exports = router;