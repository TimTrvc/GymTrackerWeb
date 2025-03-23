// workoutRoutes.js korrigieren
const express = require('express');
const { addWorkout, editWorkout, removeWorkout } = require('../controllers/workoutController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// HTTP-Methoden anpassen - POST für das Erstellen/Bearbeiten,
// DELETE für das Löschen oder behalte GET für removeWorkout
router.post('/add', addWorkout);
router.post('/edit', editWorkout);
router.delete('/remove', removeWorkout);  // oder router.get('/remove', removeWorkout);

module.exports = router;