const express = require('express');
const {
    getUserConnections,
    addUserConnection,
    updateUserConnectionStatus,
    deleteUserConnection
} = require('../../controllers/user/userConnectionsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * Routes for managing user connections (friends, followers, etc.).
 * All routes require authentication.
 *
 * GET /                      - Get all user connections
 * POST /                     - Add a new user connection
 * PUT /:connection_id        - Update a user connection status
 * DELETE /:connection_id     - Delete a user connection by ID
 */
router.get('/', authMiddleware, getUserConnections);
router.post('/', authMiddleware, addUserConnection);
router.put('/:connection_id', authMiddleware, updateUserConnectionStatus);
router.delete('/:connection_id', authMiddleware, deleteUserConnection);

module.exports = router;