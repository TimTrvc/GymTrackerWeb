const express = require('express');
const {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
} = require('../../controllers/exercises/exerciseCategoriesController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for managing exercise categories.
 * All routes require authentication.
 *
 * GET /                  - Get all categories
 * GET /:category_id      - Get a category by ID
 * POST /                 - Add a new category
 * PUT /:category_id      - Update a category by ID
 * DELETE /:category_id   - Delete a category by ID
 */
router.get('/', authMiddleware, getAllCategories);
router.get('/:category_id', authMiddleware, getCategoryById);
router.post('/', authMiddleware, addCategory);
router.put('/:category_id', authMiddleware, updateCategory);
router.delete('/:category_id', authMiddleware, deleteCategory);

module.exports = router;