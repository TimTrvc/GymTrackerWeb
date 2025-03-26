const express = require('express');
const {
    getWorkoutExercises,
    addWorkoutExercise,
    deleteWorkoutExercise
} = require('../../controllers/workouts/workoutExercisesController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/:workout_id', authMiddleware, getWorkoutExercises);
router.post('/', authMiddleware, addWorkoutExercise);
router.delete('/:workout_exercise_id', authMiddleware, deleteWorkoutExercise);

module.exports = router;