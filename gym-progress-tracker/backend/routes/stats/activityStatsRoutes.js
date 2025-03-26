const express = require('express');
const { getActivityStats, addActivityStat, deleteActivityStat } = require('../../controllers/stats/activityStatsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/',authMiddleware,getActivityStats);
router.post('/',authMiddleware, addActivityStat);
router.delete('/:stat_id',authMiddleware, deleteActivityStat);

module.exports = router;