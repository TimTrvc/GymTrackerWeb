const express = require('express');
const { registerUser, loginUser, getUserById, updateUserById} = require('../../controllers/user/userController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for user registration, login, and profile management.
 *
 * POST /register    - Register a new user
 * POST /login       - Login a user
 * GET /:id          - Get user by ID (auth required)
 * PUT /:id          - Update user by ID (auth required)
 */
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUserById);

module.exports = router;