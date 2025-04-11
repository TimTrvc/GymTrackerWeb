const express = require('express');
const { registerUser, loginUser, getUserById, updateUserById} = require('../../controllers/user/userController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUserById);

module.exports = router;