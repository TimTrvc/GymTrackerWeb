const express = require('express');
const {
    getAllExercises,
    getExerciseById,
    addExercise,
    updateExercise,
    deleteExercise
} = require('../controllers/exercisesController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/',/*authMiddleware,*/ getAllExercises);
router.get('/:exercise_id',/*authMiddleware,*/getExerciseById);
router.post('/',/*authMiddleware,*/addExercise);
router.put('/:exercise_id',/*authMiddleware,*/updateExercise);
router.delete('/:exercise_id',/*authMiddleware,*/deleteExercise);

module.exports = router;