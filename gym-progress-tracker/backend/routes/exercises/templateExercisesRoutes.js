const express = require('express');
const { getTemplateExercises, addTemplateExercise, deleteTemplateExercise } = require('../../controllers/exercises/templateExercisesController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/:template_id', authMiddleware, getTemplateExercises);
router.post('/', authMiddleware, addTemplateExercise);
router.delete('/:template_exercise_id', authMiddleware, deleteTemplateExercise);

module.exports = router;