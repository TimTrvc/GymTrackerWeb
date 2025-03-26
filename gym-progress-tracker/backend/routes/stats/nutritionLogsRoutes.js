const express = require('express');
const { getNutritionLogs, addNutritionLog, deleteNutritionLog } = require('../../controllers/stats/nutritionLogsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getNutritionLogs);
router.post('/', authMiddleware, addNutritionLog);
router.delete('/:nutrition_log_id', authMiddleware, deleteNutritionLog);

module.exports = router;