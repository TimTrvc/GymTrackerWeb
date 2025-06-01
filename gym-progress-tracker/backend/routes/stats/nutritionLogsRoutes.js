const express = require('express');
const { getNutritionLogs, addNutritionLog, deleteNutritionLog } = require('../../controllers/stats/nutritionLogsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for managing nutrition logs.
 * All routes require authentication.
 *
 * GET /                          - Get all nutrition logs
 * POST /                         - Add a new nutrition log
 * DELETE /:nutrition_log_id      - Delete a nutrition log by ID
 */
router.get('/', authMiddleware, getNutritionLogs);
router.post('/', authMiddleware, addNutritionLog);
router.delete('/:nutrition_log_id', authMiddleware, deleteNutritionLog);

module.exports = router;