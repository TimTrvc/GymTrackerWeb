const express = require('express');
const {
    getWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout
} = require('../../controllers/workouts/workoutController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getWorkouts);
router.post('/', authMiddleware, addWorkout);
router.put('/:workout_id', authMiddleware, updateWorkout);
router.delete('/:workout_id', authMiddleware, deleteWorkout);

module.exports = router;