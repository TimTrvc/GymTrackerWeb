/**
 * Routes for handling avatar functionality in the GymTracker app.
 * All routes require authentication.
 *
 * GET /              - Get the user's avatar
 * PUT /stats         - Update avatar stats
 * POST /experience   - Add experience to avatar
 * PUT /boss-level    - Update avatar boss level
 */

const express = require('express');
const { 
    getUserAvatar, 
    updateAvatarStats,
    addExperience, 
    updateBossLevel
} = require('../../controllers/user/avatarController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

// All avatar routes are protected by authentication
router.use(authMiddleware);

// Routes
router.get('/', getUserAvatar);
router.put('/stats', updateAvatarStats);
router.post('/experience', addExperience);
router.put('/boss-level', updateBossLevel);

module.exports = router;
