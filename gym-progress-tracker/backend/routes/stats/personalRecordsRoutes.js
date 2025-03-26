const express = require('express');
const { getPersonalRecords, addPersonalRecord, deletePersonalRecord } = require('../../controllers/stats/personalRecordsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getPersonalRecords);
router.post('/', authMiddleware, addPersonalRecord);
router.delete('/:pr_id', authMiddleware, deletePersonalRecord);

module.exports = router;