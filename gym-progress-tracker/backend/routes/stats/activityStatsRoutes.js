const express = require('express');
const { getActivityStats, addActivityStat, deleteActivityStat } = require('../../controllers/stats/activityStatsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for managing activity statistics.
 * All routes require authentication.
 *
 * GET /              - Get all activity stats
 * POST /             - Add a new activity stat
 * DELETE /:stat_id   - Delete an activity stat by ID
 */
router.get('/', authMiddleware, getActivityStats);
router.post('/', authMiddleware, addActivityStat);
router.delete('/:stat_id', authMiddleware, deleteActivityStat);

module.exports = router;