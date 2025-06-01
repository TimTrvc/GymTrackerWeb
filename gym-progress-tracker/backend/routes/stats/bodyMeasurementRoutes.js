const express = require('express');
const { getBodyMeasurements, addBodyMeasurement, deleteBodyMeasurement } = require('../../controllers/stats/bodyMeasurementsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for managing body measurements.
 * All routes require authentication.
 *
 * GET /                      - Get all body measurements
 * POST /                     - Add a new body measurement
 * DELETE /:measurement_id    - Delete a body measurement by ID
 */
router.get('/', authMiddleware, getBodyMeasurements);
router.post('/', authMiddleware, addBodyMeasurement);
router.delete('/:measurement_id', authMiddleware, deleteBodyMeasurement);

module.exports = router;