const express = require('express');
const { getPersonalRecords, addPersonalRecord, deletePersonalRecord } = require('../../controllers/stats/personalRecordsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for managing personal records.
 * All routes require authentication.
 *
 * GET /                - Get all personal records
 * POST /               - Add a new personal record
 * DELETE /:pr_id       - Delete a personal record by ID
 */
router.get('/', authMiddleware, getPersonalRecords);
router.post('/', authMiddleware, addPersonalRecord);
router.delete('/:pr_id', authMiddleware, deletePersonalRecord);

module.exports = router;