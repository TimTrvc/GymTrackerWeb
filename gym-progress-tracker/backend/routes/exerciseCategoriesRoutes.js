const express = require('express');
const {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/exerciseCategoriesController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/',authMiddleware, getAllCategories);
router.get('/:category_id',authMiddleware, getCategoryById);
router.post('/',authMiddleware, addCategory);
router.put('/:category_id',authMiddleware,updateCategory);
router.delete('/:category_id',authMiddleware,deleteCategory);

module.exports = router;