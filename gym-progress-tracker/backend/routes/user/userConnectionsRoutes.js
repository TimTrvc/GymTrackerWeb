const express = require('express');
const {
    getUserConnections,
    addUserConnection,
    updateUserConnectionStatus,
    deleteUserConnection
} = require('../../controllers/user/userConnectionsController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getUserConnections);
router.post('/', authMiddleware, addUserConnection);
router.put('/:connection_id', authMiddleware, updateUserConnectionStatus);
router.delete('/:connection_id', authMiddleware, deleteUserConnection);

module.exports = router;