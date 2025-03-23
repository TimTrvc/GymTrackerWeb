const express = require('express');
const { addWorkout, editWorkout, removeWorkout } = require('../controllers/workoutController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', addWorkout);
router.post('/edit', editWorkout);
router.get('/remove', removeWorkout);

module.exports = router;