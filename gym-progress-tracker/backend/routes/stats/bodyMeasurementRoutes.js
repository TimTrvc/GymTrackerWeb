const express = require('express');
const { getBodyMeasurements, addBodyMeasurement, deleteBodyMeasurement } = require('../../controllers/stats/bodyMeasurementsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getBodyMeasurements);
router.post('/', authMiddleware, addBodyMeasurement);
router.delete('/:measurement_id', authMiddleware, deleteBodyMeasurement);

module.exports = router;