const express = require('express');
const { getExercisePerformances, addExercisePerformance, deleteExercisePerformance } = require('../../controllers/exercises/exercisePerformanceController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/:session_id', authMiddleware, getExercisePerformances);
router.post('/', authMiddleware, addExercisePerformance);
router.delete('/:performance_id', authMiddleware, deleteExercisePerformance);

module.exports = router;