// workoutRoutes.js korrigieren
const express = require('express');
const { addWorkout, getWorkouts, getWorkoutById, editWorkout, removeWorkout } = require('../../controllers/workouts/workoutTemplatesController');

const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

// HTTP-Methoden anpassen - POST für das Erstellen/Bearbeiten,
// DELETE für das Löschen oder behalte GET für removeWorkout
router.post('/add', authMiddleware, addWorkout);
router.get('/get', authMiddleware, getWorkouts);
router.get('/:workout_template_id', authMiddleware, getWorkoutById)
router.post('/edit', authMiddleware,  editWorkout);
router.delete('/remove', authMiddleware,  removeWorkout);  // oder router.get('/remove', removeWorkout);

module.exports = router;