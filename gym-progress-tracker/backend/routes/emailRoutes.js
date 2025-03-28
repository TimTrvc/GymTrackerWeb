const express = require('express');
const { getEmails, addEmail, deleteEmail } = require('../controllers/emailController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/',/* authMiddleware,*/ getEmails);
router.post('/',/* authMiddleware,*/ addEmail);
router.delete('/:email',/* authMiddleware,*/deleteEmail);

module.exports = router;