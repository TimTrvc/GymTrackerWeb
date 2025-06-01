const express = require('express');
const { getTemplateExercises, addTemplateExercise, deleteTemplateExercise } = require('../../controllers/exercises/templateExercisesController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for managing template exercises.
 * All routes require authentication.
 *
 * GET /:template_id              - Get all exercises for a template
 * POST /                         - Add an exercise to a template
 * DELETE /:template_exercise_id  - Delete an exercise from a template by ID
 */
router.get('/:template_id', authMiddleware, getTemplateExercises);
router.post('/', authMiddleware, addTemplateExercise);
router.delete('/:template_exercise_id', authMiddleware, deleteTemplateExercise);

module.exports = router;