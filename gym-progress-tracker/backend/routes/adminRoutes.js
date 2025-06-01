const express = require('express');
const router = express.Router();

/**
 * GET /test - Serves the API test page for administrators only.
 * @route GET /test
 * @access Admin
 */
router.get('/test', (req, res) => {
    if (!req.users.isAdmin) {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    res.sendFile('apiTest.html', { root: './public' }); // Serve API test page
});

module.exports = router;