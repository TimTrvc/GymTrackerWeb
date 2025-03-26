const express = require('express');
const { getUserWeightLogs, addUserWeightLog, deleteUserWeightLog } = require('../../controllers/user/userWeightLogsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getUserWeightLogs);
router.post('/', authMiddleware, addUserWeightLog);
router.delete('/:weight_log_id', authMiddleware, deleteUserWeightLog);

module.exports = router;