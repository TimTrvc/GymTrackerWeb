/**
 * Routes for managing workout templates.
 * All routes require authentication.
 *
 * POST /add                - Add a new workout template
 * GET /get                 - Get all workout templates
 * GET /:workout_template_id - Get a workout template by ID
 * POST /edit               - Edit a workout template
 * DELETE /remove           - Remove a workout template
 */
const express = require('express');
const { addWorkout, getWorkouts, getWorkoutById, editWorkout, removeWorkout } = require('../../controllers/workouts/workoutTemplatesController');

const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

// HTTP-Methoden anpassen - POST für das Erstellen/Bearbeiten,
// DELETE für das Löschen oder behalte GET für removeWorkout
router.post('/add', authMiddleware, addWorkout);
router.get('/get', authMiddleware, getWorkouts);
router.get('/:workout_template_id', authMiddleware, getWorkoutById);
router.post('/edit', authMiddleware, editWorkout);
router.delete('/remove', authMiddleware, removeWorkout);

module.exports = router;