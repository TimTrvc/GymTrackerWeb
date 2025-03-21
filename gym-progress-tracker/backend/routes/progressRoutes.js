const express = require('express');
const { getProgress, addProgress } = require('../controllers/progressController'); // Import addProgress

const router = express.Router();

router.get('/', getProgress); // Fetch progress
router.post('/', addProgress); // Add progress

module.exports = router;