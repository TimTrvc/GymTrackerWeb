const express = require('express');
const { getUserWeightLogs, addUserWeightLog, deleteUserWeightLog } = require('../../controllers/user/userWeightLogsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for managing user weight logs.
 * All routes require authentication.
 *
 * GET /                      - Get all user weight logs
 * POST /                     - Add a new user weight log
 * DELETE /:weight_log_id     - Delete a user weight log by ID
 */
router.get('/', authMiddleware, getUserWeightLogs);
router.post('/', authMiddleware, addUserWeightLog);
router.delete('/:weight_log_id', authMiddleware, deleteUserWeightLog);

module.exports = router;