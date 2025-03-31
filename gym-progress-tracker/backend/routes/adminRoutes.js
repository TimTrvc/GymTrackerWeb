const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    if (!req.users.isAdmin) {
        return res.status(403).json({ error: 'Zugriff verweigert. Nur Administratoren erlaubt.' });
    }

    res.sendFile('apiTest.html', { root: './public' }); // API-Testseite bereitstellen
});

module.exports = router;