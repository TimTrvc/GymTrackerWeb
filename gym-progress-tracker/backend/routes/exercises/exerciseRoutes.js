const express = require('express');
const {
    getAllExercises,
    getExerciseById,
    getExerciseByCategoryId,
    addExercise,
    updateExercise,
    deleteExercise
} = require('../../controllers/exercises/exercisesController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for managing exercises.
 * All routes require authentication.
 *
 * GET /                        - Get all exercises
 * GET /:exercise_id            - Get an exercise by ID
 * GET /category/:category_id   - Get exercises by category ID
 * POST /                       - Add a new exercise
 * PUT /:exercise_id            - Update an exercise by ID
 * DELETE /:exercise_id         - Delete an exercise by ID
 */
router.get('/', authMiddleware, getAllExercises);
router.get('/:exercise_id', authMiddleware, getExerciseById);
router.get('/category/:category_id', authMiddleware, getExerciseByCategoryId);
router.post('/', authMiddleware, addExercise);
router.put('/:exercise_id', authMiddleware, updateExercise);
router.delete('/:exercise_id', authMiddleware, deleteExercise);

module.exports = router;