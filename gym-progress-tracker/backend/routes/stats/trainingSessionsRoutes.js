const express = require('express');
const { getTrainingSessions, addTrainingSession, deleteTrainingSession } = require('../../controllers/stats/trainingSessionsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getTrainingSessions);
router.post('/', authMiddleware, addTrainingSession);
router.delete('/:session_id', authMiddleware, deleteTrainingSession);

module.exports = router;